# tests/test_app_websocket_server.py
import asyncio
from unittest import mock
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from ig_py_lib import InterProcessComm
from websockets import ConnectionClosed, Request

from .app_auth_token_manager import AppAuthTokenManager
from .app_defs import AUTH_JWT_COOKIE_NAME, IPC_TOPIC_USER_PREFIX
from .app_websocket_server import AppWebSocketServer


# --------------------------
# Helpers
# --------------------------
class DummyAuthManager(AppAuthTokenManager):
    def __init__(self, return_value=None):
        self.return_value = return_value
        super().__init__("secret", ["HS256"])

    def get_account_id_from_auth_token(self, token):
        return self.return_value


# --------------------------
# Tests
# --------------------------


@pytest.mark.asyncio
async def test_handle_ws_client_conn_account_none():
    """If get_account_id_from_auth_token returns None, websocket.close is called"""
    ipc = InterProcessComm[str]()
    auth_manager = DummyAuthManager(return_value=None)  # invalid token
    server = AppWebSocketServer(ipc, auth_manager, "localhost", 8765)

    websocket = AsyncMock()
    websocket.request = Request(path="", headers={"Cookie": AUTH_JWT_COOKIE_NAME + "=bad-token"})
    websocket.close = AsyncMock()

    await server.handle_ws_client_conn(websocket)

    websocket.close.assert_awaited_once_with(reason="Invalid auth token")


@pytest.mark.asyncio
async def test_handle_ws_client_conn_account_id_not_none():
    # --- Setup mocks ---
    mock_websocket = AsyncMock()
    mock_websocket.request = Request(
        path="", headers={"Cookie": AUTH_JWT_COOKIE_NAME + "=valid-token"}
    )
    mock_websocket.send = AsyncMock()
    mock_websocket.close = AsyncMock()

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_auth_token_manager.get_account_id_from_auth_token.return_value = "account123"

    mock_ipc = MagicMock(spec=InterProcessComm)

    # --- Create server instance ---
    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Patch handle_ws_client_conn_for_account_id to avoid infinite loops
    server.handle_ws_client_conn_for_account_id = AsyncMock()

    # --- Call the method under test ---
    await server.handle_ws_client_conn(mock_websocket)

    # --- Assertions ---
    mock_auth_token_manager.get_account_id_from_auth_token.assert_called_once_with("valid-token")
    server.handle_ws_client_conn_for_account_id.assert_called_once_with(
        mock_websocket, "account123"
    )
    mock_websocket.close.assert_not_called()


def test_get_account_id_from_auth_token_missing_request():
    # --- Setup mocks ---
    mock_websocket = MagicMock()
    mock_websocket.request = None

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_ipc = MagicMock(spec=InterProcessComm)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    account_id = server.get_account_id_from_auth_token(mock_websocket)

    assert account_id is None
    mock_auth_token_manager.get_account_id_from_auth_token.assert_not_called()


def test_get_account_id_from_auth_token_missing_cookie_in_headers():
    # --- Setup mocks ---
    mock_websocket = MagicMock()
    mock_websocket.request = Request(path="", headers={})

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_ipc = MagicMock(spec=InterProcessComm)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    account_id = server.get_account_id_from_auth_token(mock_websocket)

    assert account_id is None
    mock_auth_token_manager.get_account_id_from_auth_token.assert_not_called()


def test_get_account_id_from_auth_token_missing_auth_jwt_cookie():
    # --- Setup mocks ---
    mock_websocket = MagicMock()
    mock_websocket.request = Request(path="", headers={"Cookie": "cookie1=val1"})

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_auth_token_manager.get_account_id_from_auth_token.return_value = None

    mock_ipc = MagicMock(spec=InterProcessComm)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    account_id = server.get_account_id_from_auth_token(mock_websocket)

    assert account_id is None
    mock_auth_token_manager.get_account_id_from_auth_token.assert_not_called()


def test_get_account_id_from_auth_token_missing_account_id_in_auth_jwt_cookie():
    # --- Setup mocks ---
    mock_websocket = MagicMock()
    mock_websocket.request = Request(
        path="", headers={"Cookie": AUTH_JWT_COOKIE_NAME + "=valid-token"}
    )

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_auth_token_manager.get_account_id_from_auth_token.return_value = None

    mock_ipc = MagicMock(spec=InterProcessComm)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    account_id = server.get_account_id_from_auth_token(mock_websocket)

    assert account_id is None
    mock_auth_token_manager.get_account_id_from_auth_token.assert_called_with("valid-token")


def test_get_account_id_from_auth_token_success():
    # --- Setup mocks ---
    mock_websocket = MagicMock()
    mock_websocket.request = Request(
        path="", headers={"Cookie": AUTH_JWT_COOKIE_NAME + "=valid-token"}
    )

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_auth_token_manager.get_account_id_from_auth_token.return_value = "account123"

    mock_ipc = MagicMock(spec=InterProcessComm)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # --- Call the method ---
    account_id = server.get_account_id_from_auth_token(mock_websocket)

    # --- Assertions ---
    assert account_id == "account123"
    mock_auth_token_manager.get_account_id_from_auth_token.assert_called_once_with("valid-token")


def test_get_account_id_from_auth_token_success_with_multiple_cookies():
    # --- Setup mocks ---
    mock_websocket = MagicMock()
    mock_websocket.request = Request(
        path="",
        headers={
            "Cookie": "cookie1=val1;" + AUTH_JWT_COOKIE_NAME + "=valid-token" + ";cookie2=val2;"
        },
    )

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)
    mock_auth_token_manager.get_account_id_from_auth_token.return_value = "account123"

    mock_ipc = MagicMock(spec=InterProcessComm)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # --- Call the method ---
    account_id = server.get_account_id_from_auth_token(mock_websocket)

    # --- Assertions ---
    assert account_id == "account123"
    mock_auth_token_manager.get_account_id_from_auth_token.assert_called_once_with("valid-token")


@pytest.mark.asyncio
async def test_handle_ws_client_conn_for_account_id_connection_closed():
    mock_websocket = AsyncMock()
    mock_ipc = MagicMock(spec=InterProcessComm)
    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Patch handle_queue_message_loop to raise ConnectionClosed
    def raise_connection_closed(*args, **kwargs):
        raise ConnectionClosed.__new__(ConnectionClosed)

    server.handle_queue_message_loop = AsyncMock(side_effect=raise_connection_closed)

    await server.handle_ws_client_conn_for_account_id(mock_websocket, "account123")

    mock_ipc.subscribe.assert_called_once_with(IPC_TOPIC_USER_PREFIX + "account123")
    mock_ipc.unsubscribe.assert_called_once_with(IPC_TOPIC_USER_PREFIX + "account123", mock.ANY)


@pytest.mark.asyncio
async def test_handle_ws_client_conn_for_account_id_other_exception():
    mock_websocket = AsyncMock()
    mock_ipc = MagicMock(spec=InterProcessComm)
    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Patch handle_queue_message_loop to raise a generic exception
    server.handle_queue_message_loop = AsyncMock(side_effect=ValueError("oops"))

    await server.handle_ws_client_conn_for_account_id(mock_websocket, "account123")

    mock_ipc.subscribe.assert_called_once_with(IPC_TOPIC_USER_PREFIX + "account123")
    mock_ipc.unsubscribe.assert_called_once_with(IPC_TOPIC_USER_PREFIX + "account123", mock.ANY)


@pytest.mark.asyncio
async def test_handle_ws_client_conn_for_account_id_success():
    mock_websocket = AsyncMock()
    mock_ipc = MagicMock(spec=InterProcessComm)
    mock_ipc.subscribe = MagicMock()
    mock_ipc.unsubscribe = MagicMock()

    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Patch handle_queue_message_loop to run normally
    server.handle_queue_message_loop = AsyncMock(return_value=None)

    await server.handle_ws_client_conn_for_account_id(mock_websocket, "account123")

    mock_ipc.subscribe.assert_called_once_with(IPC_TOPIC_USER_PREFIX + "account123")
    mock_ipc.unsubscribe.assert_called_once_with(IPC_TOPIC_USER_PREFIX + "account123", mock.ANY)
    server.handle_queue_message_loop.assert_awaited_once_with(mock_websocket, mock.ANY)


@pytest.mark.asyncio
async def test_handle_queue_message_loop_once_then_cancelled():
    mock_websocket = AsyncMock()
    mock_ipc = MagicMock(spec=InterProcessComm)
    mock_auth_token_manager = MagicMock(spec=AppAuthTokenManager)

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Create a queue with one message
    queue = asyncio.Queue()
    await queue.put("test-message")

    # Patch handle_queue_message to track the call
    server.handle_queue_message = AsyncMock()

    # Patch asyncio.sleep to raise CancelledError after first call
    async def sleep_mock(duration):
        raise asyncio.CancelledError()

    with patch("asyncio.sleep", new=sleep_mock):
        with pytest.raises(asyncio.CancelledError):
            await server.handle_queue_message_loop(mock_websocket, queue)

    # Check that the message was processed
    server.handle_queue_message.assert_awaited_once_with(mock_websocket, "test-message")


@pytest.mark.asyncio
async def test_handle_queue_message_sends_msg():
    # Arrange
    mock_websocket = AsyncMock()
    mock_ipc = None  # not needed for this test
    mock_auth_token_manager = None

    server = AppWebSocketServer(
        ipc=mock_ipc,
        auth_token_manager=mock_auth_token_manager,
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Act
    await server.handle_queue_message(mock_websocket, "hello world")

    # Assert
    mock_websocket.send.assert_awaited_once_with("hello world")
