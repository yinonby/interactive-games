#!/usr/bin/env python3
import asyncio
import os
from typing import Any

from dotenv import load_dotenv
from ig_py_lib import NetUtils

from ws_program.app_ws_program import AppWebSocketProgram


def load_env_variables(env: str) -> dict[str, Any]:
    # Load .env file (for common variables)
    load_dotenv()

    # Load environment-specific .env.<env> and .env.<env>.local files
    load_dotenv(f".env.{env}")
    load_dotenv(f".env.{env}.local")

    # Load the environment variables with parsing
    jwt_secret = get_env_var("IG_WS__JWT_SECRET")
    jwt_algorithms = parse_colon_separated_string(get_env_var("IG_WS__JWT_ALGORITHMS"))
    redis_server_host = get_env_var("IG_WS__REDIS_SERVER_HOST")
    redis_server_port = parse_int(get_env_var("IG_WS__REDIS_SERVER_PORT"))
    redis_pubsub_channel_names = parse_colon_separated_string(
        get_env_var("IG_WS__REDIS_PUBSUB_CHANNEL_NAMES")
    )
    ws_server_listen_if_name = get_env_var("IG_WS__WS_SERVER_LISTEN_IF_NAME")
    ws_server_listen_port = parse_int(get_env_var("IG_WS__WS_SERVER_LISTEN_PORT"))

    # Create a dictionary to store the values
    env_vars = {
        "jwt_secret": jwt_secret,
        "jwt_algorithms": jwt_algorithms,
        "redis_server_host": redis_server_host,
        "redis_server_port": redis_server_port,
        "redis_pubsub_channel_names": redis_pubsub_channel_names,
        "ws_server_listen_if_name": ws_server_listen_if_name,
        "ws_server_listen_port": ws_server_listen_port,
    }

    return env_vars


def get_env_var(var_name: str) -> str:
    """Retrieves env var, throws if doesn't exist."""
    val = os.getenv(var_name)
    if val is None:
        raise Exception(f"Missing env var: {var_name}")
    return val


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
    wsPogram = AppWebSocketProgram(
        jwt_secret=env_vars["jwt_secret"],
        jwt_algorithms=env_vars["jwt_algorithms"],
        redis_server_host=env_vars["redis_server_host"],
        redis_server_port=env_vars["redis_server_port"],
        redis_pubsub_channel_names=env_vars["redis_pubsub_channel_names"],
        ws_server_listen_ip_addr=ws_server_listen_ip_addr,
        ws_server_listen_port=env_vars["ws_server_listen_port"],
    )

    # run program
    asyncio.run(wsPogram.start())
