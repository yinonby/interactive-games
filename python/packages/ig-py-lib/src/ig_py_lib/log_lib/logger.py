import sys
from datetime import datetime, timezone


class PyLogger:
    def __init__(self, prefix: str = "") -> None:
        self.prefix = f"{prefix}: " if prefix else ""

    # ANSI Color Codes
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    RESET = "\033[0m"

    @staticmethod
    def _get_timestamp() -> str:
        # Returns ISO format with 3-digit milliseconds and Z suffix
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"

    def _log(self, level: str, message: str, color: str = "") -> None:
        timestamp = self._get_timestamp()
        # Format: 2026-02-03T21:39:08.879Z LEVEL: message
        formatted_msg = (
            f"{timestamp} {color}{level}: {self.prefix}{message}{self.RESET}\n"
        )
        sys.stdout.write(formatted_msg)
        sys.stdout.flush()

    def debug(self, msg: str) -> None:
        self._log("DBG", msg, self.CYAN)

    def info(self, msg: str) -> None:
        self._log("INF", msg, self.BLUE)

    def log(self, msg: str) -> None:
        self._log("LOG", msg)

    def warn(self, msg: str) -> None:
        self._log("WRN", msg, self.YELLOW)

    def error(self, msg: str) -> None:
        self._log("ERR", msg, self.RED)
