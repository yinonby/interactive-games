import json
from typing import Any

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from ig_py_lib.log_lib.logger import PyLogger
from ig_py_lib.websocket_lib.ws_subscription_manager import WsSubscriptionManager


class WebsocketServerNew:
    def __init__(
        self, host: str, port: int, wsSubscriptionManager: WsSubscriptionManager
    ):
        self.host = host
        self.port = port
        self.wsSubscriptionManager = wsSubscriptionManager
        self.app = FastAPI()
        self.logger: PyLogger = PyLogger()

    # ------------------------
    # Public startup method
    # ------------------------

    async def start(self) -> None:
        self._register_routes()

        # Start Uvicorn in the background using asyncio.create_task
        config = uvicorn.Config(self.app, host=self.host, port=self.port)
        server = uvicorn.Server(config)
        await server.serve()

    # ------------------------
    # FastAPI wiring
    # ------------------------

    def _register_routes(self) -> None:
        @self.app.websocket("/wss")
        async def websocket_endpoint(ws: WebSocket) -> None:
            await self.handle_connection(ws)

    # ------------------------
    # Connection handling
    # ------------------------

    async def handle_connection(self, ws: WebSocket) -> None:
        await ws.accept()

        try:
            while True:
                raw = await ws.receive_text()
                rawData = json.loads(raw)
                if not isinstance(rawData, dict):
                    self.logger.warn(
                        f"WS Server: received illegal data, rawData {rawData}, dropping..."
                    )
                else:
                    data: dict[str, Any] = rawData
                    await self._handle_message(ws, data)

        except WebSocketDisconnect:
            pass
        finally:
            self.wsSubscriptionManager.cleanup(ws)

    async def _handle_message(self, ws: WebSocket, data: dict[str, Any]) -> None:
        action = data.get("action")
        topic = data.get("topic")

        if not topic:
            self.logger.warn(f"WS Server: missing topic {topic}")
            return

        if action == "subscribe":
            self.logger.debug(f"WS Server: received subscribe message, topic {topic}")
            self.wsSubscriptionManager.subscribe(ws, topic)

        elif action == "unsubscribe":
            self.logger.debug(f"WS Server: received unsubscribe message, topic {topic}")
            self.wsSubscriptionManager.unsubscribe(ws, topic)

        else:
            self.logger.debug(f"WS Server: unknown action {action}")
