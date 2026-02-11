from abc import ABC, abstractmethod

import websockets

from ig_py_lib.log_lib.logger import PyLogger


class WebSocketServer(ABC):
    def __init__(self, ws_server_listen_ip_addr: str, ws_server_listen_port: int):
        self.logger: PyLogger = PyLogger()
        self.ws_server_listen_ip_addr = ws_server_listen_ip_addr
        self.ws_server_listen_port = ws_server_listen_port

    @abstractmethod
    async def handle_ws_client_conn(
        self, websocket: websockets.ServerConnection
    ) -> None:  # pragma: no cover
        pass

    async def start_loop(self) -> None:
        self.logger.info(
            f"WebSocket server starting on {self.ws_server_listen_ip_addr}:{self.ws_server_listen_port}..."
        )

        ws_server = await websockets.serve(
            handler=self.handle_ws_client_conn,
            host=self.ws_server_listen_ip_addr,
            port=self.ws_server_listen_port,
        )
        self.logger.info(
            f"WebSocket server listening on {self.ws_server_listen_ip_addr}:{self.ws_server_listen_port}..."
        )

        await ws_server.wait_closed()
