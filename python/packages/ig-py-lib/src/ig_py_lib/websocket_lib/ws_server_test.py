import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Replace 'your_module' with the actual path to your classes
from .ws_server import WebsocketServerNew, WsSubscriptionManager


@pytest.fixture
def mock_manager():
    return MagicMock(spec=WsSubscriptionManager)


@pytest.fixture
def server(mock_manager):
    # Initialize server with dummy host/port and mocked manager
    srv = WebsocketServerNew(
        host="127.0.0.1", port=8000, wsSubscriptionManager=mock_manager
    )
    srv._register_routes()  # Ensure routes are registered for the test app
    return srv


@pytest.fixture
def client(server):
    return TestClient(server.app)


def test_websocket_subscribe_action(client, mock_manager):
    """Verify that a 'subscribe' message calls the manager's subscribe method."""
    payload = {"action": "subscribe", "topic": "ticker_data"}

    with client.websocket_connect("/wss") as websocket:
        websocket.send_json(payload)
        # We need to give the server loop a tiny moment to process or send a close
        # but in a simple unit test, we just check the mock interaction

    mock_manager.subscribe.assert_called_once()
    # The first arg is the WebSocket object, the second is the topic
    args, _ = mock_manager.subscribe.call_args
    assert args[1] == "ticker_data"


def test_websocket_unsubscribe_action(client, mock_manager):
    """Verify that an 'unsubscribe' message calls the manager's unsubscribe method."""
    payload = {"action": "unsubscribe", "topic": "ticker_data"}

    with client.websocket_connect("/wss") as websocket:
        websocket.send_json(payload)

    mock_manager.unsubscribe.assert_called_once()
    args, _ = mock_manager.unsubscribe.call_args
    assert args[1] == "ticker_data"


def test_websocket_unknown_action(client, mock_manager):
    """Verify that an 'unsubscribe' message calls the manager's unsubscribe method."""
    payload = {"action": "unknown", "topic": "ticker_data"}

    with client.websocket_connect("/wss") as websocket:
        websocket.send_json(payload)

    mock_manager.subscribe.assert_not_called()
    mock_manager.unsubscribe.assert_not_called()


def test_websocket_cleanup_on_disconnect(client, mock_manager):
    """Verify that manager.cleanup is called when the client disconnects."""
    with client.websocket_connect("/wss"):
        pass  # Immediately closing the connection context

    # cleanup should be called in the 'finally' block of handle_connection
    mock_manager.cleanup.assert_called_once()


def test_invalid_json_is_ignored(client, mock_manager):
    """Verify that sending non-dict data is ignored."""
    with client.websocket_connect("/wss") as websocket:
        # Sending a list instead of a dict should trigger the illegal data check
        websocket.send_text(json.dumps(["not", "a", "dict"]))

    mock_manager.subscribe.assert_not_called()
    mock_manager.unsubscribe.assert_not_called()


def test_missing_topic_logs_warning(client, mock_manager):
    """Verify that messages missing a topic are ignored (not subscribed)."""
    payload = {"action": "subscribe"}  # Missing 'topic'

    with client.websocket_connect("/wss") as websocket:
        websocket.send_json(payload)

    mock_manager.subscribe.assert_not_called()


@pytest.mark.asyncio
async def test_start_configures_and_runs_uvicorn(server):
    """Verify that start() sets up and calls uvicorn.serve()."""

    # 1. Mock the uvicorn Config and Server classes
    with (
        patch("uvicorn.Config") as mock_config_cls,
        patch("uvicorn.Server") as mock_server_cls,
    ):
        # 2. Setup the mock server instance
        mock_server_instance = MagicMock()
        # Mock the async serve method
        mock_server_instance.serve = AsyncMock()
        mock_server_cls.return_value = mock_server_instance

        # 3. Call the start method
        # We use patch.object on _register_routes just to isolate the test
        with patch.object(server, "_register_routes") as mock_reg:
            await server.start()

            # 4. Assertions for Coverage
            mock_reg.assert_called_once()

            # Verify Config was initialized with correct params
            mock_config_cls.assert_called_once_with(
                server.app, host=server.host, port=server.port
            )

            # Verify Server was initialized with that config
            mock_server_cls.assert_called_once_with(mock_config_cls.return_value)

            # Verify serve() was actually awaited
            mock_server_instance.serve.assert_called_once()
