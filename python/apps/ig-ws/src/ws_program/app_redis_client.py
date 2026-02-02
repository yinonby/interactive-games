import json
from collections.abc import Sequence

from ig_py_lib import InterProcessComm, RedisClient

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


class AppRedisClient(RedisClient):
    def __init__(
        self,
        ipc: InterProcessComm[str],
        redis_server_host: str,
        redis_server_port: int,
        redis_pubsub_channel_names: Sequence[str],
    ):
        super().__init__(redis_server_host, redis_server_port, redis_pubsub_channel_names)

        self.ipc: InterProcessComm[str] = ipc

    async def handle_redis_client_message_data(self, messageData: bytes) -> None:
        data = json.loads(messageData.decode("utf-8"))
        msg_type = data[REDIS_MSG_KIND_FIELD_NAME]
        if msg_type == REDIS_MSG_KIND_GAME_INSTANCE_UPDATE:
            game_instance_id = data[REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID]
            player_user_ids = data[REDIS_MSG_DATA_FIELD_NAME_PLAYER_IDS]
            for player_user_id in player_user_ids:
                await self.notifyUserOfGameInstanceUpdate(player_user_id, game_instance_id)

    async def notifyUserOfGameInstanceUpdate(self, user_id: str, game_instance_id: str) -> None:
        ipc_topic = IPC_TOPIC_USER_PREFIX + user_id
        notification_data = {
            IPC_NOTIFICATION_KIND_FIELD_NAME: IPC_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE,
            IPC_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID: game_instance_id,
        }

        await self.ipc.publish(ipc_topic, str(notification_data))
