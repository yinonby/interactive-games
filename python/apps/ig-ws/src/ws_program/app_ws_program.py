#!/usr/bin/env python3
import asyncio
from collections.abc import Sequence

from ig_py_lib import InterProcessComm

from .app_auth_token_manager import AppAuthTokenManager
from .app_redis_client import AppRedisClient
from .app_websocket_server import AppWebSocketServer


class AppWebSocketProgram:
    def __init__(
        self,
        jwt_secret: str,
        jwt_algorithms: Sequence[str],
        redis_server_host: str,
        redis_server_port: int,
        redis_pubsub_channel_names: Sequence[str],
        ws_server_listen_ip_addr: str,
        ws_server_listen_port: int,
    ):
        self.auth_token_manager: AppAuthTokenManager = AppAuthTokenManager(
            jwt_secret=jwt_secret, jwt_algorithms=jwt_algorithms
        )
        self.ipc = InterProcessComm[str]()
        self.redis_client = AppRedisClient(
            ipc=self.ipc,
            redis_server_host=redis_server_host,
            redis_server_port=redis_server_port,
            redis_pubsub_channel_names=redis_pubsub_channel_names,
        )
        self.web_socket_server = AppWebSocketServer(
            ipc=self.ipc,
            auth_token_manager=self.auth_token_manager,
            ws_server_listen_ip_addr=ws_server_listen_ip_addr,
            ws_server_listen_port=ws_server_listen_port,
        )

    async def start(self) -> None:
        ws_task = asyncio.create_task(
            self.web_socket_server.start_loop(), name="AppWebSocketProgram"
        )
        redis_task = asyncio.create_task(self.redis_client.start_loop(), name="RedisClient")

        done, pending = await asyncio.wait(
            [ws_task, redis_task], return_when=asyncio.FIRST_EXCEPTION
        )

        for task in done:
            if task.exception():  # check if it raised an exception
                print(f"Task {task.get_name()} raised: {task.exception()}")
            else:
                print(f"Task {task.get_name()} returned: {task.result()}")

        for task in pending:
            task.cancel()
