import sys
from datetime import datetime, timezone


class Colors:
    # Standard colors
    BLACK = "\033[30m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"

    # Bright / Bold variants
    BRIGHT_BLACK = "\033[90m"
    BRIGHT_RED = "\033[91m"
    BRIGHT_GREEN = "\033[92m"
    BRIGHT_YELLOW = "\033[93m"
    BRIGHT_BLUE = "\033[94m"
    BRIGHT_MAGENTA = "\033[95m"
    BRIGHT_CYAN = "\033[96m"
    BRIGHT_WHITE = "\033[97m"

    # Styles
    RESET = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    REVERSED = "\033[7m"


class PyLogger:
    def __init__(self, prefix: str = "") -> None:
        self.prefix = f"{prefix}: " if prefix else ""

    @staticmethod
    def _get_timestamp() -> str:
        # Returns ISO format with 3-digit milliseconds and Z suffix
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"

    def _log(self, level: str, message: str, color: str = "") -> None:
        timestamp = self._get_timestamp()
        # Format: 2026-02-03T21:39:08.879Z LEVEL: message
        formatted_msg = (
            f"{timestamp} {color}{level}: {self.prefix}{message}{Colors.RESET}\n"
        )
        sys.stdout.write(formatted_msg)
        sys.stdout.flush()

    def trace(self, msg: str) -> None:
        self._log("TRC", msg, Colors.MAGENTA)

    def debug(self, msg: str) -> None:
        self._log("DBG", msg, Colors.CYAN)

    def info(self, msg: str) -> None:
        self._log("INF", msg, Colors.GREEN)

    def warn(self, msg: str) -> None:
        self._log("WRN", msg, Colors.YELLOW)

    def error(self, msg: str) -> None:
        self._log("ERR", msg, Colors.RED)
