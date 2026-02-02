import asyncio
from http.cookies import SimpleCookie
from typing import Any

from ig_py_lib import InterProcessComm, WebSocketServer
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
        self.auth_token_manager: AppAuthTokenManager = auth_token_manager
        self.ipc: InterProcessComm[str] = ipc

    async def handle_ws_client_conn(self, websocket: ServerConnection) -> None:
        user_id = self.get_user_id_from_auth_token(websocket)
        if user_id is None:
            print("WebSocket Server: Disconnecting due to no user id")
            await websocket.close(reason="Invalid auth token")
            return

        print(f"WebSocket Server: User {user_id} connected")
        await self.handle_ws_client_conn_for_user_id(websocket, user_id)

    def get_user_id_from_auth_token(self, websocket: ServerConnection) -> str | None:
        # Extract request
        request: Request | None = websocket.request
        if request is None:
            print("WebSocket Server: Conection missing request info")
            return None

        # Extract cookie header
        cookie_header = request.headers.get("Cookie")
        if cookie_header is None:
            print("WebSocket Server: Conection missing cookie header")
            return None

        # Extract auth jwt cookie
        auth_token = None
        simple_cookie = SimpleCookie()
        simple_cookie.load(cookie_header)
        auth_cookie = simple_cookie.get(AUTH_JWT_COOKIE_NAME)
        if auth_cookie is None:
            print("WebSocket Server: Conection missing auth cookie")
            return None

        # Extract user id from auth jwt cookie
        auth_token = auth_cookie.value
        user_id = self.auth_token_manager.get_user_id_from_auth_token(auth_token)
        if user_id is None:
            print("WebSocket Server: Auth token missing user id")
            return None

        return user_id

    async def handle_ws_client_conn_for_user_id(
        self, websocket: ServerConnection, user_id: str
    ) -> None:
        topic = IPC_TOPIC_USER_PREFIX + user_id
        queue: asyncio.Queue[str] = self.ipc.subscribe(topic)

        try:
            await self.handle_queue_message_loop(websocket, queue)

        except ConnectionClosed:
            print(f"WebSocket Server: Connection closed, user {user_id}")
            pass

        except Exception:
            print(f"WebSocket Server: Unexpected error, user {user_id}")
            pass

        finally:
            print(f"WebSocket Server: User {user_id} disconnected")
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
