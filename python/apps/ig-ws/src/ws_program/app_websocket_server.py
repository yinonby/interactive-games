import asyncio
from http.cookies import SimpleCookie
from typing import Any

from ig_py_lib import InterProcessComm, PyLogger, WebSocketServer
from websockets import ConnectionClosed, Request, ServerConnection

from .app_auth_token_manager import AppAuthTokenManager
from .app_defs import AUTH_JWT_COOKIE_NAME, IPC_TOPIC_USER_PREFIX


class AppWebSocketServer(WebSocketServer):
    def __init__(
        self,
        ipc: InterProcessComm[str],
        auth_token_manager: AppAuthTokenManager,
        ws_server_listen_ip_addr: str,
        ws_server_listen_port: int,
    ):
        super().__init__(ws_server_listen_ip_addr, ws_server_listen_port)

        self.logger: PyLogger = PyLogger()
        self.auth_token_manager: AppAuthTokenManager = auth_token_manager
        self.ipc: InterProcessComm[str] = ipc

    async def handle_ws_client_conn(self, websocket: ServerConnection) -> None:
        account_id = self.get_account_id_from_auth_token(websocket)
        if account_id is None:
            self.logger.debug("WebSocket Server: Disconnecting due to no account id")
            await websocket.close(reason="Invalid auth token")
            return

        self.logger.debug(f"WebSocket Server: Account {account_id} connected")
        await self.handle_ws_client_conn_for_account_id(websocket, account_id)

    def get_account_id_from_auth_token(self, websocket: ServerConnection) -> str | None:
        # Extract request
        request: Request | None = websocket.request
        if request is None:
            self.logger.debug("WebSocket Server: Conection missing request info")
            return None

        # Extract cookie header
        cookie_header = request.headers.get("Cookie")
        if cookie_header is None:
            self.logger.debug("WebSocket Server: Conection missing cookie header")
            return None

        # Extract auth jwt cookie
        auth_token = None
        simple_cookie = SimpleCookie()
        simple_cookie.load(cookie_header)
        auth_cookie = simple_cookie.get(AUTH_JWT_COOKIE_NAME)
        if auth_cookie is None:
            self.logger.debug("WebSocket Server: Conection missing auth cookie")
            return None

        # Extract account id from auth jwt cookie
        auth_token = auth_cookie.value
        account_id = self.auth_token_manager.get_account_id_from_auth_token(auth_token)
        if account_id is None:
            self.logger.debug("WebSocket Server: Auth token missing account id")
            return None

        return account_id

    async def handle_ws_client_conn_for_account_id(
        self, websocket: ServerConnection, account_id: str
    ) -> None:
        topic = IPC_TOPIC_USER_PREFIX + account_id
        queue: asyncio.Queue[str] = self.ipc.subscribe(topic)

        try:
            await self.handle_queue_message_loop(websocket, queue)

        except ConnectionClosed:
            self.logger.debug(f"WebSocket Server: Connection closed, account {account_id}")
            pass

        except Exception:
            self.logger.debug(f"WebSocket Server: Unexpected error, account {account_id}")
            pass

        finally:
            self.logger.debug(f"WebSocket Server: Account {account_id} disconnected")
            self.ipc.unsubscribe(topic, queue)

    async def handle_queue_message_loop(
        self, websocket: ServerConnection, queue: asyncio.Queue[str]
    ) -> None:
        while True:
            msg = await queue.get()
            await self.handle_queue_message(websocket, msg)
            await asyncio.sleep(1)

    async def handle_queue_message(self, websocket: ServerConnection, msg: Any) -> None:
        await websocket.send(msg)
