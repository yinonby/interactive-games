from unittest.mock import ANY, AsyncMock, MagicMock, patch

import pytest

from .new_app_redis_consumer import AppRedisConsumer  # Replace with actual import path


@pytest.fixture
def mock_vars():
    """Mock environment-style variables used for mapping."""
    return {
        "REDIS_MSG_KIND_FIELD_NAME": "kind",
        "REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID": "game_id",
        "REDIS_MSG_DATA_FIELD_NAME_CONVERSATION_ID": "chat_id",
        "REDIS_MSG_KIND_GAME_INSTANCE_UPDATE": "GAME_UPDATE",
        "REDIS_MSG_KIND_CHAT_UPDATE": "CHAT_UPDATE",
        "WS_TOPIC_GAME_PREFIX": "game:",
        "WS_TOPIC_CONVERSATION_PREFIX": "chat:",
        "WS_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE": "game_notif",
        "WS_NOTIFICATION_KIND_CHAT_UPDATE": "chat_notif",
        "WS_NOTIFICATION_KIND_FIELD_NAME": "type",
        "WS_NOTIFICATION_PAYLOAD_FIELD_NAME": "payload",
        "WS_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID": "gi_id",
        "WS_NOTIFICATION_DATA_FIELD_NAME_CONVERSATION_ID": "c_id",
    }


@pytest.fixture
def consumer(mock_vars):
    mock_manager = MagicMock()
    # Mock the broadcast method as an AsyncMock
    mock_manager.broadcast = AsyncMock()

    with patch("redis.asyncio.Redis.from_url"):
        return AppRedisConsumer(
            wsSubscriptionManager=mock_manager,
            redis_url="redis://localhost",
            redis_pubsub_channel_names=["chan1"],
            app_redis_consumer_vars=mock_vars,
        )


def test_map_game_instance_update(consumer, mock_vars):
    """Verify Redis game data maps to the correct WS topic and payload."""
    redis_data = {"kind": "GAME_UPDATE", "game_id": "123"}
    result = consumer.map_redis_message_to_ws_topic_and_message(redis_data)

    assert result["topic"] == "game:123"
    assert result["message"]["type"] == "game_notif"
    assert result["message"]["payload"]["gi_id"] == "123"


def test_map_chat_update(consumer, mock_vars):
    """Verify Redis chat data maps to the correct WS topic and payload."""
    redis_data = {"kind": "CHAT_UPDATE", "chat_id": "abc"}
    result = consumer.map_redis_message_to_ws_topic_and_message(redis_data)

    assert result["topic"] == "chat:abc"
    assert result["message"]["type"] == "chat_notif"
    assert result["message"]["payload"]["c_id"] == "abc"


def test_map_unknown_kind_returns_none(consumer):
    """Verify unknown message types return None."""
    result = consumer.map_redis_message_to_ws_topic_and_message({"kind": "UNKNOWN"})
    assert result is None


@pytest.mark.asyncio
async def test_handle_msg_data_triggers_broadcast(consumer, mock_vars):
    """Verify handle_msg_data creates a task for the subscription manager."""
    redis_data = {
        mock_vars["REDIS_MSG_KIND_FIELD_NAME"]: mock_vars["REDIS_MSG_KIND_GAME_INSTANCE_UPDATE"],
        mock_vars["REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID"]: "456",
    }

    # Patch create_task to capture the coroutine
    with patch("asyncio.create_task") as mock_create_task:
        consumer.handle_msg_data(redis_data)

        # 1. Verify a task was created
        mock_create_task.assert_called_once()

        # 2. Get the coroutine from the call arguments
        # call_args[0][0] gets the first positional argument (the coro)
        coro = mock_create_task.call_args[0][0]

        # 3. Await it so the mock's internal state updates
        await coro

        # 4. Verify the broadcast was called with ANY message
        expected_topic = f"{mock_vars['WS_TOPIC_GAME_PREFIX']}456"
        consumer.wsSubscriptionManager.broadcast.assert_called_once_with(expected_topic, ANY)


@pytest.mark.asyncio
async def test_handle_msg_data_ignores_invalid_mapping(consumer):
    """Verify no task is created if mapping fails."""
    with patch("asyncio.create_task") as mock_create_task:
        consumer.handle_msg_data({"kind": "UNKNOWN"})
        mock_create_task.assert_not_called()
