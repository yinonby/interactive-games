import json
from unittest.mock import AsyncMock, MagicMock

import pytest

from .ws_subscription_manager import WsSubscriptionManager


@pytest.fixture
def manager():
    return WsSubscriptionManager()


@pytest.fixture
def mock_ws():
    # Mocking FastAPI WebSocket with an AsyncMock for send_text
    ws = MagicMock()
    ws.send_text = AsyncMock()
    return ws


def test_subscribe(manager, mock_ws):
    """Verify client is added to both topic and client tracking."""
    topic = "test_topic"
    manager.subscribe(mock_ws, topic)

    assert mock_ws in manager.topic_subscribers[topic]
    assert topic in manager.client_subscriptions[mock_ws]


def test_unsubscribe(manager, mock_ws):
    """Verify client is removed and empty topics are deleted."""
    topic = "test_topic"
    manager.subscribe(mock_ws, topic)
    manager.unsubscribe(mock_ws, topic)

    assert topic not in manager.topic_subscribers
    assert topic not in manager.client_subscriptions[mock_ws]


def test_cleanup(manager, mock_ws):
    """Verify all subscriptions for a client are removed at once."""
    topics = ["topic1", "topic2"]
    for t in topics:
        manager.subscribe(mock_ws, t)

    manager.cleanup(mock_ws)

    for t in topics:
        assert t not in manager.topic_subscribers
    assert mock_ws not in manager.client_subscriptions


@pytest.mark.asyncio
async def test_broadcast_success(manager, mock_ws):
    """Verify message is JSON-serialized and sent to all subscribers."""
    topic = "test_topic"
    message = {"data": "hello"}
    manager.subscribe(mock_ws, topic)

    await manager.broadcast(topic, message)

    mock_ws.send_text.assert_called_once_with(json.dumps(message))


@pytest.mark.asyncio
async def test_broadcast_removes_dead_clients(manager, mock_ws):
    """Verify clients that raise exceptions during send are cleaned up."""
    topic = "test_topic"
    message = {"data": "broken"}

    # Simulate a connection error
    mock_ws.send_text.side_effect = Exception("Connection lost")
    manager.subscribe(mock_ws, topic)

    await manager.broadcast(topic, message)

    # Client should be cleaned up automatically
    assert topic not in manager.topic_subscribers
    assert mock_ws not in manager.client_subscriptions


@pytest.mark.asyncio
async def test_broadcast_no_subscribers(manager):
    """Ensure broadcasting to an empty topic does nothing."""
    # This should not raise any errors
    await manager.broadcast("non_existent_topic", {"msg": "nowhere"})
    assert len(manager.topic_subscribers) == 0
