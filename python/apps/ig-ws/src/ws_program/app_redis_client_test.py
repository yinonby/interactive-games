# tests/test_app_redis_client.py
import json
from unittest.mock import AsyncMock

import pytest
from ig_py_lib import InterProcessComm

from .app_defs import (
    IPC_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID,
    IPC_NOTIFICATION_KIND_FIELD_NAME,
    IPC_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE,
    IPC_TOPIC_USER_PREFIX,
    REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID,
    REDIS_MSG_DATA_FIELD_NAME_PLAYER_IDS,
    REDIS_MSG_KIND_FIELD_NAME,
    REDIS_MSG_KIND_GAME_INSTANCE_UPDATE,
)
from .app_redis_client import AppRedisClient


@pytest.mark.asyncio
async def test_handle_redis_client_message_data_decode_fails():
    ipc = InterProcessComm[str]()
    client = AppRedisClient(ipc, "localhost", 6379, ["channel"])

    # invalid JSON → should raise JSONDecodeError
    invalid_data = b"{bad json}"
    with pytest.raises(json.JSONDecodeError):
        await client.handle_redis_client_message_data(invalid_data)


@pytest.mark.asyncio
async def test_handle_redis_client_message_data_non_user_event():
    ipc = InterProcessComm[str]()
    # mock publish so we can track calls
    ipc.publish = AsyncMock()
    client = AppRedisClient(ipc, "localhost", 6379, ["channel"])

    # message with redisMsgKind != REDIS_MSG_KIND_GAME_INSTANCE_UPDATE
    message = json.dumps({REDIS_MSG_KIND_FIELD_NAME: "UNSUPPORTED_EVENT"}).encode("utf-8")
    await client.handle_redis_client_message_data(message)

    # publish should not be called
    ipc.publish.assert_not_awaited()


@pytest.mark.asyncio
async def test_handle_redis_client_message_data_user_event():
    ipc = InterProcessComm[str]()
    # mock publish
    ipc.publish = AsyncMock()
    client = AppRedisClient(ipc, "localhost", 6379, ["channel"])

    # message with redisMsgKind == REDIS_MSG_KIND_GAME_INSTANCE_UPDATE
    game_instance_id = "giid1"
    payload = {
        REDIS_MSG_KIND_FIELD_NAME: REDIS_MSG_KIND_GAME_INSTANCE_UPDATE,
        REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID: game_instance_id,
        REDIS_MSG_DATA_FIELD_NAME_PLAYER_IDS: ["u123"],
    }
    message = json.dumps(payload).encode("utf-8")
    await client.handle_redis_client_message_data(message)

    # publish should be called once with topic and data
    expected_ipc_topic = IPC_TOPIC_USER_PREFIX + "u123"
    expected_notification_data = {
        IPC_NOTIFICATION_KIND_FIELD_NAME: IPC_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE,
        IPC_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID: game_instance_id,
    }
    ipc.publish.assert_called_once_with(expected_ipc_topic, str(expected_notification_data))
