import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import redis

from ig_py_lib import RedisClient

DUMMY_PORT = 28399


# Dummy subclass to satisfy the abstract method
class DummyRedisClient(RedisClient):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.last_handled = None

    async def handle_redis_client_message_data(
        self, messageData: bytes
    ):  # pragma: no cover
        self.last_handled = messageData


@pytest.mark.asyncio
async def test_connect_redis_with_retries_success():
    """
    Test that connect_redis_with_retries exits early if connect succeeds
    """
    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])

    # Patch connect to succeed immediately
    client.connect = AsyncMock()

    # Should succeed on first try
    await client.connect_redis_with_retries(retries=3, delay=0)

    # connect should have been called exactly once
    client.connect.assert_awaited_once()


@pytest.mark.asyncio
async def test_connect_redis_with_retries_connet_failure():
    """
    Test that connect_redis_with_retries raises the last exception if all retries fail
    """
    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])

    # Patch connect to always raise ConnectionError
    exc = redis.ConnectionError("cannot connect")
    client.connect = AsyncMock(side_effect=exc)

    # Should raise after retries exhausted
    with pytest.raises(redis.ConnectionError):
        await client.connect_redis_with_retries(retries=2, delay=0)

    # connect should have been called exactly 2 times
    assert client.connect.await_count == 2


@pytest.mark.asyncio
async def test_connect_redis_with_retries_other_failure():
    """
    Test that connect_redis_with_retries raises the last exception if all retries fail
    """
    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])

    # Patch connect to always raise Exception
    exc = Exception
    client.connect = AsyncMock(side_effect=exc)

    # Should raise after retries exhausted
    with pytest.raises(Exception):
        await client.connect_redis_with_retries(retries=2, delay=0)

    # connect should have been called exactly 2 times
    assert client.connect.await_count == 2


@pytest.mark.asyncio
async def test_connect_success():
    """Test successful connect() path"""
    dummy_pubsub = MagicMock()
    dummy_redis = MagicMock()
    dummy_redis.pubsub = MagicMock(return_value=dummy_pubsub)
    dummy_redis.ping = MagicMock()

    with patch("redis.Redis", return_value=dummy_redis):
        client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
        await client.connect()

        dummy_redis.pubsub.assert_called_once()
        dummy_pubsub.subscribe.assert_called_once_with(["chan"])
        dummy_redis.ping.assert_called_once()


@pytest.mark.asyncio
async def test_connect_redis_creation_failure():
    """Test failure when redis.Redis() raises an exception"""
    with patch("redis.Redis", side_effect=redis.ConnectionError("fail")):
        client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
        with pytest.raises(redis.ConnectionError):
            await client.connect()


@pytest.mark.asyncio
async def test_connect_pubsub_subscribe_failure():
    """Test failure when pubsub.subscribe raises an exception"""
    dummy_pubsub = MagicMock()
    dummy_pubsub.subscribe.side_effect = redis.ConnectionError("fail subscribe")
    dummy_redis = MagicMock()
    dummy_redis.pubsub = MagicMock(return_value=dummy_pubsub)
    dummy_redis.ping = MagicMock()

    with patch("redis.Redis", return_value=dummy_redis):
        client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
        with pytest.raises(redis.ConnectionError):
            await client.connect()


@pytest.mark.asyncio
async def test_connect_ping_failure():
    """Test failure when ping() raises an exception"""
    dummy_pubsub = MagicMock()
    dummy_redis = MagicMock()
    dummy_redis.pubsub = MagicMock(return_value=dummy_pubsub)
    dummy_redis.ping.side_effect = redis.ConnectionError("ping fail")

    with patch("redis.Redis", return_value=dummy_redis):
        client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
        with pytest.raises(redis.ConnectionError):
            await client.connect()


@pytest.mark.asyncio
async def test_redis_listener_loop_calls_listener_once():
    """Test that redis_listener_loop calls redis_listener and stops after one sleep"""
    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])

    # Patch redis_listener to an AsyncMock
    client.redis_listener = AsyncMock()

    # Patch sleep to raise CancelledError to break the infinite loop
    async def fake_sleep(sec):
        raise asyncio.CancelledError()

    with patch("asyncio.sleep", new=fake_sleep):
        with pytest.raises(asyncio.CancelledError):
            await client.redis_listener_loop()

    # Verify that redis_listener() was called exactly once
    client.redis_listener.assert_awaited_once()


@pytest.mark.asyncio
async def test_redis_listener_pubsub_none():
    """Test that redis_listener raises an exception if pubsub is None"""
    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
    client.pubsub = None  # explicitly set pubsub to None

    with pytest.raises(Exception) as exc_info:
        await client.redis_listener()

    assert "Unexpected missing pubsub" in str(exc_info.value)


@pytest.mark.asyncio
async def test_redis_listener_get_message_connection_error_triggers_reconnect():
    """Test that redis_listener calls connect_redis_with_retries if get_message() raises ConnectionError"""

    # Setup Dummy pubsub
    dummy_pubsub = MagicMock()
    dummy_pubsub.get_message.side_effect = redis.ConnectionError(
        "get_message fail"
    )  # raise on listen

    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
    client.pubsub = dummy_pubsub

    # Patch connect_redis_with_retries to an AsyncMock
    client.connect_redis_with_retries = AsyncMock()

    # Patch asyncio.sleep to be a no-op to avoid waiting
    async def fake_sleep(sec):
        return

    with patch("asyncio.sleep", new=fake_sleep):
        await client.redis_listener()

    # Verify that reconnect was attempted
    client.connect_redis_with_retries.assert_awaited_once()


@pytest.mark.asyncio
async def test_redis_listener_get_message_raises_other_exception():
    """Test that redis_listener propagates non-ConnectionError exceptions from get_message()"""

    dummy_pubsub = MagicMock()
    dummy_pubsub.get_message.side_effect = RuntimeError(
        "boom"
    )  # some exception other than ConnectionError

    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
    client.pubsub = dummy_pubsub

    # Patch connect_redis_with_retries to AsyncMock
    client.connect_redis_with_retries = AsyncMock()

    # Patch sleep to do nothing
    async def fake_sleep(sec):
        return

    with pytest.raises(RuntimeError) as exc_info:
        await client.redis_listener()

    assert str(exc_info.value) == "boom"
    # Ensure reconnect was NOT called
    client.connect_redis_with_retries.assert_not_awaited()


@pytest.mark.asyncio
async def test_redis_listener_handler_raises():
    """Test that redis_listener propagates exceptions from handle_redis_client_message_data"""

    class ThrowDummyRedisClient(RedisClient):
        async def handle_redis_client_message_data(self, messageData: bytes):
            # Simulate failure in handler
            raise RuntimeError("handler failed")

    # Setup pubsub to return one normal message
    class DummyPubSub:
        def get_message(self, ignore_subscribe_messages: bool):
            return {"type": "message", "data": b"hello"}

    client = ThrowDummyRedisClient("localhost", DUMMY_PORT, ["chan"])
    client.pubsub = DummyPubSub()

    # Patch connect_redis_with_retries just to verify it's not called
    client.connect_redis_with_retries = AsyncMock()

    with pytest.raises(RuntimeError) as exc_info:
        await client.redis_listener()

    # Exception should be from handler
    assert str(exc_info.value) == "handler failed"

    # reconnect should NOT be called
    client.connect_redis_with_retries.assert_not_awaited()


@pytest.mark.asyncio
async def test_redis_listener_message_type_not_message():
    """Test that redis_listener calls handle_redis_client_message_data on a normal message"""

    class DummyPubSub:
        def get_message(self, ignore_subscribe_messages: bool):
            return {"type": "invalid-message", "data": b"hello"}

    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
    client.pubsub = DummyPubSub()

    # Patch connect_redis_with_retries to avoid accidental retries
    client.connect_redis_with_retries = AsyncMock()

    # Patch sleep to do nothing (though it won't be reached in this test)
    async def fake_sleep(sec):
        return

    await client.redis_listener()

    # Verify that the handler was called with the message
    assert client.last_handled is None

    # reconnect should NOT be called
    client.connect_redis_with_retries.assert_not_awaited()


@pytest.mark.asyncio
async def test_redis_listener_handle_success():
    """Test that redis_listener calls handle_redis_client_message_data on a normal message"""

    class DummyPubSub:
        def get_message(self, ignore_subscribe_messages: bool):
            return {"type": "message", "data": b"hello"}

    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])
    client.pubsub = DummyPubSub()

    # Patch connect_redis_with_retries to avoid accidental retries
    client.connect_redis_with_retries = AsyncMock()

    await client.redis_listener()

    # Verify that the handler was called with the message
    assert client.last_handled == b"hello"
    # reconnect should NOT be called
    client.connect_redis_with_retries.assert_not_awaited()


@pytest.mark.asyncio
async def test_start_loop_calls_connect_and_listener_loop():
    """Test that start_loop calls connect_redis_with_retries and redis_listener_loop"""

    client = DummyRedisClient("localhost", DUMMY_PORT, ["chan"])

    # Patch both methods to AsyncMock
    client.connect_redis_with_retries = AsyncMock()
    client.redis_listener_loop = AsyncMock()

    await client.start_loop()

    # Verify both were awaited
    client.connect_redis_with_retries.assert_awaited_once()
    client.redis_listener_loop.assert_awaited_once()
