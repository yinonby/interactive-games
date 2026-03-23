#!/usr/bin/env python3
import asyncio
import os
from typing import Any

from dotenv import load_dotenv
from ig_py_lib import EnvUtils, NetUtils

from ws_program.new_app_ws_program import NewAppWsProgram


def load_env_variables(env: str) -> dict[str, Any]:
    # Load .env file (for common variables)
    load_dotenv(dotenv_path="../../../.env")

    # Load environment-specific .env.<env> and .env.<env>.local files
    load_dotenv(f"../../../.env.{env}")
    load_dotenv(f"../../../.env.{env}.local")

    # Load the environment variables with parsing
    jwt_secret = EnvUtils.get_env_var("IG_ENV__AUTH__JWT_SECRET")
    jwt_algorithms = parse_colon_separated_string(EnvUtils.get_env_var("IG_ENV__AUTH__JWT_ALGORITHM"))
    redis_server_host = EnvUtils.get_env_var("IG_ENV__REDIS__SERVER_HOST")
    redis_server_port = parse_int(EnvUtils.get_env_var("IG_ENV__REDIS__LISTEN_PORT"))
    redis_pubsub_channel_names = [
        EnvUtils.get_env_var("IG_ENV__REDIS__CHAT_UPDATE_NOTIFICATION_CHANNEL_NAME"),
        EnvUtils.get_env_var("IG_ENV__REDIS__GAME_INSTANCE_UPDATE_NOTIFICATION_CHANNEL_NAME"),
    ]
    ws_server_listen_if_name = EnvUtils.get_env_var("IG_ENV__WSS__SERVER_LISTEN_IF_NAME")
    ws_server_listen_port = parse_int(EnvUtils.get_env_var("IG_ENV__WSS__LISTEN_PORT"))

    # AUTH
    AUTH_JWT_USER_ID_FIELD_NAME: str = EnvUtils.get_env_var("IG_ENV__AUTH__JWT_USER_ID_FIELD_NAME")
    AUTH_JWT_ACCOUNT_ID_FIELD_NAME: str = EnvUtils.get_env_var("IG_ENV__AUTH__JWT_ACCOUNT_ID_FIELD_NAME")

    # REDIS
    REDIS_MSG_KIND_FIELD_NAME: str = EnvUtils.get_env_var("IG_ENV__REDIS__MSG_KIND_FIELD_NAME")
    REDIS_MSG_KIND_GAME_INSTANCE_UPDATE: str = EnvUtils.get_env_var("IG_ENV__REDIS__GAME_INSTANCE_UPDATE_MSG_KIND")
    REDIS_MSG_KIND_CHAT_UPDATE: str = EnvUtils.get_env_var("IG_ENV__REDIS__CHAT_UPDATE_MSG_KIND")
    REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID: str = EnvUtils.get_env_var("IG_ENV__REDIS__GAME_INSTANCE_ID_FIELD_NAME")
    REDIS_MSG_DATA_FIELD_NAME_CONVERSATION_ID: str = EnvUtils.get_env_var("IG_ENV__REDIS__CONVERSATION_ID_FIELD_NAME")

    # WS MESSAGES

    WS_TOPIC_GAME_PREFIX: str = EnvUtils.get_env_var("IG_ENV__WS__GAME_INSTANCE_TOPIC_PREFIX")
    WS_TOPIC_CONVERSATION_PREFIX: str = EnvUtils.get_env_var("IG_ENV__WS__CONVERSATION_TOPIC_PREFIX")

    WS_NOTIFICATION_KIND_FIELD_NAME: str = EnvUtils.get_env_var("IG_ENV__WS__NOTIFICATION_KIND_FIELD_NAME")
    WS_NOTIFICATION_PAYLOAD_FIELD_NAME: str = EnvUtils.get_env_var("IG_ENV__WS__NOTIFICATION_PAYLOAD_FIELD_NAME")

    WS_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE: str = EnvUtils.get_env_var(
        "IG_ENV__WS__GAME_INSTANCE_UPDATE_NOTIFICATION_KIND"
    )
    WS_NOTIFICATION_KIND_CHAT_UPDATE: str = EnvUtils.get_env_var("IG_ENV__WS__CHAT_UPDATE_NOTIFICATION_KIND")

    WS_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID: str = EnvUtils.get_env_var(
        "IG_ENV__WS__GAME_INSTANCE_ID_FIELD_NAME"
    )
    WS_NOTIFICATION_DATA_FIELD_NAME_CONVERSATION_ID: str = EnvUtils.get_env_var(
        "IG_ENV__WS__CONVERSATION_ID_FIELD_NAME"
    )

    # Create a dictionary to store the values
    env_vars = {
        "jwt_secret": jwt_secret,
        "jwt_algorithms": jwt_algorithms,
        "redis_server_host": redis_server_host,
        "redis_server_port": redis_server_port,
        "redis_pubsub_channel_names": redis_pubsub_channel_names,
        "ws_server_listen_if_name": ws_server_listen_if_name,
        "ws_server_listen_port": ws_server_listen_port,
        "app_auth_env_vars": {
            "AUTH_JWT_USER_ID_FIELD_NAME": AUTH_JWT_USER_ID_FIELD_NAME,
            "AUTH_JWT_ACCOUNT_ID_FIELD_NAME": AUTH_JWT_ACCOUNT_ID_FIELD_NAME,
        },
        "app_redis_consumer_vars": {
            "REDIS_MSG_DATA_FIELD_NAME_CONVERSATION_ID": REDIS_MSG_DATA_FIELD_NAME_CONVERSATION_ID,
            "REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID": REDIS_MSG_DATA_FIELD_NAME_GAME_INSTANCE_ID,
            "REDIS_MSG_KIND_CHAT_UPDATE": REDIS_MSG_KIND_CHAT_UPDATE,
            "REDIS_MSG_KIND_FIELD_NAME": REDIS_MSG_KIND_FIELD_NAME,
            "REDIS_MSG_KIND_GAME_INSTANCE_UPDATE": REDIS_MSG_KIND_GAME_INSTANCE_UPDATE,
            "WS_NOTIFICATION_DATA_FIELD_NAME_CONVERSATION_ID": WS_NOTIFICATION_DATA_FIELD_NAME_CONVERSATION_ID,
            "WS_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID": WS_NOTIFICATION_DATA_FIELD_NAME_GAME_INSTANCE_ID,
            "WS_NOTIFICATION_KIND_CHAT_UPDATE": WS_NOTIFICATION_KIND_CHAT_UPDATE,
            "WS_NOTIFICATION_KIND_FIELD_NAME": WS_NOTIFICATION_KIND_FIELD_NAME,
            "WS_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE": WS_NOTIFICATION_KIND_GAME_INSTANCE_UPDATE,
            "WS_NOTIFICATION_PAYLOAD_FIELD_NAME": WS_NOTIFICATION_PAYLOAD_FIELD_NAME,
            "WS_TOPIC_CONVERSATION_PREFIX": WS_TOPIC_CONVERSATION_PREFIX,
            "WS_TOPIC_GAME_PREFIX": WS_TOPIC_GAME_PREFIX,
        },
    }

    return env_vars


def parse_colon_separated_string(value: str) -> list[str]:
    """Parses a colon-separated string into a list of strings."""
    return value.split(":") if value else []


def parse_int(value: str) -> int:
    """Parses a string to an integer, returns the default value if parsing fails."""
    try:
        return int(value)
    except ValueError:
        return 0  # Default to 0 if parsing fails


# Example usage
if __name__ == "__main__":
    # You can set the environment ('development' or 'production') here
    env = os.getenv("ENV", "development")  # Default to 'development' if ENV is not set

    # load env
    env_vars = load_env_variables(env)

    # Get the ip address of the requested interface on which the websocket server should listen
    ws_server_listen_ip_addr = NetUtils.get_interface_ip(env_vars["ws_server_listen_if_name"])

    # init program
    wsPogram = NewAppWsProgram(
        jwt_secret=env_vars["jwt_secret"],
        jwt_algorithms=env_vars["jwt_algorithms"],
        redis_server_host=env_vars["redis_server_host"],
        redis_server_port=env_vars["redis_server_port"],
        redis_pubsub_channel_names=env_vars["redis_pubsub_channel_names"],
        ws_server_listen_ip_addr=ws_server_listen_ip_addr,
        ws_server_listen_port=env_vars["ws_server_listen_port"],
        app_redis_consumer_vars=env_vars["app_redis_consumer_vars"],
        app_auth_env_vars=env_vars["app_auth_env_vars"],
    )

    # run program
    asyncio.run(wsPogram.start())
