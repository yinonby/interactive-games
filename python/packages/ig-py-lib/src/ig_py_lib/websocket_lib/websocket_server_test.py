# tests/test_websocket_server_abc.py
import asyncio
from unittest.mock import AsyncMock, patch

import pytest

from ig_py_lib import WebSocketServer


# Concrete subclass for testing
class DummyWebSocketServer(WebSocketServer):
    async def handle_ws_client_conn(self, websocket) -> None:
        # Simple mock implementation
        await websocket.send("hello")


@pytest.mark.asyncio
async def test_start_loop_creates_server():
    """Test that start_loop calls websockets.serve and awaits wait_closed"""

    server = DummyWebSocketServer(
        ws_server_listen_ip_addr="localhost", ws_server_listen_port=8765
    )

    # Mock the server returned by websockets.serve
    mock_ws_server = AsyncMock()

    # Patch websockets.serve as an async function returning mock_ws_server
    with patch(
        "websockets.serve", new_callable=AsyncMock, return_value=mock_ws_server
    ) as serve_mock:
        # Run start_loop in a task to allow cancellation
        task = asyncio.create_task(server.start_loop())
        await asyncio.sleep(0)  # let start_loop start
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

        # Assertions
        serve_mock.assert_awaited_once_with(
            handler=server.handle_ws_client_conn, host="localhost", port=8765
        )
        mock_ws_server.wait_closed.assert_awaited_once()


@pytest.mark.asyncio
async def test_handle_ws_client_conn_sends_message() -> None:
    # Create concrete server
    server = DummyWebSocketServer(
        ws_server_listen_ip_addr="localhost", ws_server_listen_port=8765
    )

    # Mock websocket
    mock_ws = AsyncMock()
    await server.handle_ws_client_conn(mock_ws)

    # Should call send
    mock_ws.send.assert_awaited_once_with("hello")


@pytest.mark.asyncio
async def test_start_loop_waits_for_server_closed():
    """Test that start_loop calls websockets.serve and awaits wait_closed"""

    server = DummyWebSocketServer("localhost", 8765)

    # Create a mock server whose wait_closed is AsyncMock
    mock_ws_server = AsyncMock()

    # Patch websockets.serve to be an async function returning mock_ws_server
    with patch(
        "websockets.serve", new_callable=AsyncMock, return_value=mock_ws_server
    ) as serve_mock:
        # Run start_loop in a task to allow cancellation
        task = asyncio.create_task(server.start_loop())
        await asyncio.sleep(0)  # let the task start
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

        # Assertions
        serve_mock.assert_awaited_once_with(
            handler=server.handle_ws_client_conn, host="localhost", port=8765
        )
        mock_ws_server.wait_closed.assert_awaited_once()
