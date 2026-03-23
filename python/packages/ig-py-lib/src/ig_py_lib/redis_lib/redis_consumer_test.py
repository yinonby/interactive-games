import json
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from .redis_consumer import RedisConsumer


# Concrete implementation for testing
class MockConsumer(RedisConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.received_data = []

    def handle_msg_data(self, msg_data: dict[str, Any]) -> None:
        self.received_data.append(msg_data)


@pytest.fixture
def redis_config():
    return {"url": "redis://localhost", "channels": ["test-channel"]}


@pytest.mark.asyncio
async def test_start_subscribes_and_enters_loop(redis_config):
    """Verify start() subscribes to channels and triggers the event loop."""
    with patch("redis.asyncio.Redis.from_url") as mock_from_url:
        # Setup mocks
        mock_redis = MagicMock()
        mock_pubsub = AsyncMock()
        mock_from_url.return_value = mock_redis
        mock_redis.pubsub.return_value = mock_pubsub

        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        # Patch event_loop to avoid infinite hang
        with patch.object(consumer, "event_loop", new_callable=AsyncMock) as mock_loop:
            await consumer.start()

            mock_pubsub.subscribe.assert_called_once_with(*redis_config["channels"])
            mock_loop.assert_called_once()


@pytest.mark.asyncio
async def test_event_loop_filters_messages(redis_config):
    """Ensure only 'message' types are passed to handle_msg."""
    with patch("redis.asyncio.Redis.from_url"):
        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        # 1. Define an async generator to simulate Redis stream
        async def mock_listen():
            yield {"type": "subscribe", "data": 1}
            yield {"type": "message", "data": '{"key": "value"}'}
            # We don't need a timeout if we just stop yielding here

        # 2. Attach the generator to the mock
        consumer.pubsub.listen = MagicMock(side_effect=mock_listen)

        with patch.object(
            consumer, "handle_msg", new_callable=AsyncMock
        ) as mock_handle:
            # 3. Run the loop (it will exit naturally when the generator is exhausted)
            await consumer.event_loop()

            # 4. Verify only the 'message' type triggered the handler
            assert mock_handle.call_count == 1
            mock_handle.assert_called_with(
                {"type": "message", "data": '{"key": "value"}'}
            )


@pytest.mark.asyncio
async def test_handle_msg_parses_json(redis_config):
    """Verify raw Redis data is parsed and passed to handle_msg_data."""
    with patch("redis.asyncio.Redis.from_url"):
        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        valid_payload = {"topic": "updates", "message": {"id": 1}}
        msg = {"type": "message", "data": json.dumps(valid_payload)}

        await consumer.handle_msg(msg)

        assert len(consumer.received_data) == 1
        assert consumer.received_data[0] == valid_payload


@pytest.mark.asyncio
async def test_handle_msg_ignores_non_dict_json(redis_config):
    """Ensure non-dictionary JSON (like a string or list) is ignored."""
    with patch("redis.asyncio.Redis.from_url"):
        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        msg = {"type": "message", "data": json.dumps(["not", "a", "dict"])}

        await consumer.handle_msg(msg)
        assert len(consumer.received_data) == 0


@pytest.mark.asyncio
async def test_start_success(redis_config):
    """Happy path: successfully subscribe and enter event loop."""
    with patch("redis.asyncio.Redis.from_url"):
        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        # Mock pubsub and event_loop
        consumer.pubsub.subscribe = AsyncMock()

        with patch.object(consumer, "event_loop", new_callable=AsyncMock) as mock_loop:
            await consumer.start()

            # Verify subscription called with correct channels
            consumer.pubsub.subscribe.assert_called_once_with(*redis_config["channels"])
            # Verify event loop was started
            mock_loop.assert_called_once()


@pytest.mark.asyncio
async def test_start_subscription_fails(redis_config):
    """Verify error handling when Redis subscription fails."""
    with patch("redis.asyncio.Redis.from_url"):
        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        # Force subscribe to raise an error
        error_msg = "Connection Refused"
        consumer.pubsub.subscribe = AsyncMock(side_effect=Exception(error_msg))

        # Mock logger to verify warning
        consumer.logger.warn = MagicMock()

        with pytest.raises(Exception) as exc_info:
            await consumer.start()

        assert str(exc_info.value) == error_msg
        consumer.logger.warn.assert_called_with(
            f"Redis error subscribing to channels: {error_msg}"
        )


@pytest.mark.asyncio
async def test_start_event_loop_fails(redis_config):
    """Verify error handling when the event loop crashes after subscribing."""
    with patch("redis.asyncio.Redis.from_url"):
        consumer = MockConsumer(redis_config["url"], redis_config["channels"])

        # Subscription succeeds
        consumer.pubsub.subscribe = AsyncMock()

        # Event loop fails
        error_msg = "Loop Breakout"
        with patch.object(consumer, "event_loop", side_effect=Exception(error_msg)):
            # Mock logger to verify warning
            consumer.logger.warn = MagicMock()

            with pytest.raises(Exception) as exc_info:
                await consumer.start()

            assert str(exc_info.value) == error_msg
            consumer.logger.warn.assert_called_with(
                f"Redis error in the event loop: {error_msg}"
            )
