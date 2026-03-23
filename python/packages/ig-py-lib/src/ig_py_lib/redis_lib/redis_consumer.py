import json
from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import Any, TypedDict

import redis.asyncio as redis

from ig_py_lib.log_lib.logger import PyLogger


class WsMessageData(TypedDict):
    topic: str
    message: dict[str, Any]


class RedisConsumer(ABC):
    def __init__(
        self,
        redis_url: str,
        redis_pubsub_channel_names: Sequence[str],
    ):
        self.redis = redis.Redis.from_url(redis_url)
        self.pubsub = self.redis.pubsub()
        self.redis_pubsub_channel_names = redis_pubsub_channel_names
        self.logger: PyLogger = PyLogger()

    async def start(self) -> None:
        try:
            await self.pubsub.subscribe(*self.redis_pubsub_channel_names)
        except Exception as e:
            self.logger.warn(f"Redis error subscribing to channels: {e}")
            raise e

        try:
            await self.event_loop()
        except Exception as e:
            self.logger.warn(f"Redis error in the event loop: {e}")
            raise e

    async def event_loop(self) -> None:
        async for msg in self.pubsub.listen():
            if msg["type"] != "message":
                continue
            await self.handle_msg(msg)

    async def handle_msg(self, msg: dict[str, Any]) -> None:
        raw_data = json.loads(msg["data"])
        if not isinstance(raw_data, dict):
            return

        msg_data: dict[str, Any] = raw_data
        self.handle_msg_data(msg_data)

    @abstractmethod
    def handle_msg_data(self, msg_data: dict[str, Any]) -> None:  # pragma: no cover
        pass
