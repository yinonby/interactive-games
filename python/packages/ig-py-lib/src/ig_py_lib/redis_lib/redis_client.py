import asyncio
from abc import ABC, abstractmethod
from typing import Sequence

import redis


class RedisClient(ABC):
    def __init__(
        self,
        redis_server_host: str,
        redis_server_port: int,
        redis_pubsub_channel_names: Sequence[str],
    ):
        self.redis_server_host = redis_server_host
        self.redis_server_port = redis_server_port
        self.redis_pubsub_channel_names = redis_pubsub_channel_names
        self.redis_client: redis.Redis | None = None
        self.pubsub: redis.client.PubSub | None = None

    @abstractmethod
    async def handle_redis_client_message_data(
        self, messageData: bytes
    ) -> None:  # pragma: no cover
        pass

    async def connect_redis_with_retries(
        self, retries: int = 5, delay: int = 5
    ) -> None:
        last_exc: Exception

        for attempt in range(1, retries + 1):
            try:
                print(f"Redis client connecting (attempt {attempt}/{retries})...")
                await self.connect()
                return  # success, exit early

            except redis.ConnectionError as e:
                last_exc = e
                print(
                    f"Redis connection failed (attempt {attempt}/{retries}), retrying in {delay}s..."
                )
                await asyncio.sleep(delay)

            except Exception as e:
                last_exc = e
                print(
                    f"Redis failed (attempt {attempt}/{retries}): {e}, retrying in {delay}s..."
                )
                await asyncio.sleep(delay)

        # all retries exhausted
        print("Redis connection failed after all retries")
        raise last_exc

    async def connect(self) -> None:
        print(
            f"Redis client connecting to {self.redis_server_host}:{self.redis_server_port}..."
        )

        self.redis_client = redis.Redis(
            host=self.redis_server_host,
            port=self.redis_server_port,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=5,
        )

        print("Redis client setting up pubsub...")
        self.pubsub = self.redis_client.pubsub()  # type: ignore[no-untyped-call]

        print("Redis client subscribing to pubsub...")
        self.pubsub.subscribe(self.redis_pubsub_channel_names)

        # Test connection
        print("Redis client testing connection with ping...")
        self.redis_client.ping()

        print("Connected to Redis")

    async def redis_listener_loop(self) -> None:
        while True:
            print("Redis client listening...")
            await self.redis_listener()

            print("Redis client sleeping...")
            await asyncio.sleep(1)

    async def redis_listener(self) -> None:
        if self.pubsub is None:
            raise Exception("Unexpected missing pubsub at this point")

        try:
            # do not use pubsub.listen() because it will hang if there are no messages in the pubsub
            # if this process hangs then when running in parallel with other processes (asyncio.wait), other
            # processes will hang as well
            message = self.pubsub.get_message(ignore_subscribe_messages=True)
            if message and message["type"] == "message":
                await self.handle_redis_client_message_data(message["data"])

        except redis.ConnectionError:
            print("Lost Redis connection, reconnecting...")
            await self.connect_redis_with_retries()

    async def start_loop(self) -> None:
        print("Redis starting...")

        await self.connect_redis_with_retries()
        await self.redis_listener_loop()
