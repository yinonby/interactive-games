# tests/test_program.py
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from .app_ws_program import AppWebSocketProgram


@pytest.mark.asyncio
async def test_wsprogram_start_creates_tasks():
    ws_loop_mock = AsyncMock()
    ws_loop_future = asyncio.Future()  # never set result
    ws_loop_mock.return_value = ws_loop_future
    redis_loop_mock = AsyncMock(side_effect=Exception("redis fail"))

    # Arrange
    ws_program = AppWebSocketProgram(
        jwt_secret="secret",
        jwt_algorithms=["HS256"],
        redis_server_host="localhost",
        redis_server_port=6379,
        redis_pubsub_channel_names=["chan1"],
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Patch start_loop methods to avoid infinite loops
    ws_program.web_socket_server.start_loop = ws_loop_mock
    ws_program.redis_client.start_loop = redis_loop_mock

    # Act
    await ws_program.start()

    # Assert start_loop was called
    ws_program.web_socket_server.start_loop.assert_awaited_once()
    ws_program.redis_client.start_loop.assert_awaited_once()


@pytest.mark.asyncio
async def test_wsprogram_start_cancels_pending_task():
    # Arrange
    ws_program = AppWebSocketProgram(
        jwt_secret="secret",
        jwt_algorithms=["HS256"],
        redis_server_host="localhost",
        redis_server_port=6379,
        redis_pubsub_channel_names=["chan1"],
        ws_server_listen_ip_addr="127.0.0.1",
        ws_server_listen_port=8000,
    )

    # Patch start_loop methods to return dummy results
    ws_program.web_socket_server.start_loop = AsyncMock()
    ws_program.redis_client.start_loop = AsyncMock()

    # Create fake tasks
    done_task = MagicMock()
    done_task.exception.return_value = None
    done_task.get_name.return_value = "done_task"

    pending_task = MagicMock()
    pending_task.cancel = MagicMock()
    pending_task.get_name.return_value = "pending_task"

    # Patch asyncio.wait to return one done and one pending
    with patch("asyncio.wait", return_value=({done_task}, {pending_task})) as mock_wait:
        await ws_program.start()

    # Assert asyncio.wait was called
    mock_wait.assert_called_once()

    # Assert pending task was cancelled
    pending_task.cancel.assert_called_once()
