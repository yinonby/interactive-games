#!/usr/bin/env python3
import asyncio
from collections.abc import Sequence

from ig_py_lib import PyLogger, WebsocketServerNew, WsSubscriptionManager

from .app_auth_token_manager import AppAuthTokenManager
from .new_app_redis_consumer import (
    AppRedisConsumer,
)


class NewAppWsProgram:
    def __init__(
        self,
        jwt_secret: str,
        jwt_algorithms: Sequence[str],
        redis_server_host: str,
        redis_server_port: int,
        redis_pubsub_channel_names: Sequence[str],
        ws_server_listen_ip_addr: str,
        ws_server_listen_port: int,
        app_redis_consumer_vars: dict[str, str],
        app_auth_env_vars: dict[str, str],
    ):
        self.logger: PyLogger = PyLogger()

        self.auth_token_manager: AppAuthTokenManager = AppAuthTokenManager(
            jwt_secret=jwt_secret, jwt_algorithms=jwt_algorithms, app_auth_env_vars=app_auth_env_vars
        )

        self.wsSubscriptionManager = WsSubscriptionManager()

        self.redis_consumer = AppRedisConsumer(
            wsSubscriptionManager=self.wsSubscriptionManager,
            redis_url=f"redis://{redis_server_host}:{redis_server_port}",
            redis_pubsub_channel_names=redis_pubsub_channel_names,
            app_redis_consumer_vars=app_redis_consumer_vars,
        )

        self.ws_server = WebsocketServerNew(
            host=ws_server_listen_ip_addr,
            port=ws_server_listen_port,
            wsSubscriptionManager=self.wsSubscriptionManager,
        )

    async def start(self) -> None:
        ws_task = asyncio.create_task(self.ws_server.start(), name="AppWebsocketServerTask")
        redis_task = asyncio.create_task(self.redis_consumer.start(), name="AppRedisConsumerTask")

        done, pending = await asyncio.wait([ws_task, redis_task], return_when=asyncio.FIRST_EXCEPTION)

        for task in done:
            if task.exception():  # check if it raised an exception
                self.logger.warn(f"Task {task.get_name()} raised: {task.exception()}")
            else:
                self.logger.warn(f"Task {task.get_name()} returned: {task.result()}")

        for task in pending:
            task.cancel()
