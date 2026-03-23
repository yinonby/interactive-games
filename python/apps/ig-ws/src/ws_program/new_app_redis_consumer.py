import asyncio
from collections.abc import Sequence
from typing import Any

from ig_py_lib import RedisConsumer, WsMessageData, WsSubscriptionManager


class AppRedisConsumer(RedisConsumer):
    def __init__(
        self,
        wsSubscriptionManager: WsSubscriptionManager,
        redis_url: str,
        redis_pubsub_channel_names: Sequence[str],
        app_redis_consumer_vars: dict[str, str],
    ):
        super().__init__(redis_url, redis_pubsub_channel_names)

        self.wsSubscriptionManager = wsSubscriptionManager
        self.app_redis_consumer_vars = app_redis_consumer_vars

    def handle_msg_data(self, msg_data: dict[str, Any]) -> None:
        self.logger.debug(f"Redis received message: {msg_data}")

        result = self.map_redis_message_to_ws_topic_and_message(msg_data)
        if result is None:
            return

        topic = result["topic"]
        message = result["message"]
        self.logger.debug(f"Redis parsed message to topic {topic}, and message {message}")

        if topic is not None:
            # run broadcast in async task, to avoid blocking of reading next messages from redis
            asyncio.create_task(self.wsSubscriptionManager.broadcast(topic, message))

    def map_redis_message_to_ws_topic_and_message(self, data: dict[str, Any]) -> WsMessageData | None:
        redisMsgKind = data.get(self.app_redis_consumer_vars["REDIS_MSG_KIND_FIELD_NAME"])
        topic: str
        ws_msg_kind: str
        ws_payload: dict[str, Any]

        if redisMsgKind == self.app_redis_consumer_vars["REDIS_MSG_KIND_GAME_INSTANCE_UPDATE"]:
            game_instance_id = data.get(self.app_redis_consumer_vars["REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID"])
            topic = f"{self.app_redis_consumer_vars['WS_TOPIC_GAME_PREFIX']}{game_instance_id}"
            ws_msg_kind = self.app_redis_consumer_vars["WS_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE"]
            ws_payload = {
                self.app_redis_consumer_vars["WS_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID"]: game_instance_id,
            }
        elif redisMsgKind == self.app_redis_consumer_vars["REDIS_MSG_KIND_CHAT_UPDATE"]:
            conversation_id = data.get(self.app_redis_consumer_vars["REDIS_MSG_DATA_FIELD_NAME_CONVERSATION_ID"])
            topic = f"{self.app_redis_consumer_vars['WS_TOPIC_CONVERSATION_PREFIX']}{conversation_id}"
            ws_msg_kind = self.app_redis_consumer_vars["WS_NOTIFICATION_KIND_CHAT_UPDATE"]
            ws_payload = {
                self.app_redis_consumer_vars["WS_NOTIFICATION_DATA_FIELD_NAME_CONVERSATION_ID"]: conversation_id,
            }
        else:
            return None

        ws_message: dict[str, Any] = self.build_ws_notification_message(ws_msg_kind, ws_payload)
        return {
            "topic": topic,
            "message": ws_message,
        }

    def build_ws_notification_message(self, msg_kind: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            self.app_redis_consumer_vars["WS_NOTIFICATION_KIND_FIELD_NAME"]: msg_kind,
            self.app_redis_consumer_vars["WS_NOTIFICATION_PAYLOAD_FIELD_NAME"]: payload,
        }
