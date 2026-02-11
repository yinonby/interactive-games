from datetime import datetime, timezone
from unittest.mock import patch

import pytest

from .logger import Colors, PyLogger  # Path based on your error log

logger = PyLogger()


@pytest.fixture
def fixed_time():
    """Fixes the time for deterministic testing."""
    mock_now = datetime(2026, 2, 3, 21, 39, 8, 879000, tzinfo=timezone.utc)
    # We target the 'datetime' name INSIDE the logger module
    with patch("ig_py_lib.log_lib.logger.datetime") as mock_datetime:
        mock_datetime.now.return_value = mock_now
        mock_datetime.timezone = timezone
        yield mock_now


@pytest.mark.parametrize(
    "level_func,label,color",
    [
        (logger.trace, "TRC", Colors.MAGENTA),
        (logger.debug, "DBG", Colors.CYAN),
        (logger.info, "INF", Colors.GREEN),
        (logger.warn, "WRN", Colors.YELLOW),
        (logger.error, "ERR", Colors.RED),
    ],
)
def test_all_shorthand_labels(fixed_time, level_func, label, color):
    with patch("sys.stdout.write") as mock_write:
        level_func("test message")
        actual_call = mock_write.call_args[0][0]
        expected = (
            f"2026-02-03T21:39:08.879Z {color}{label}: test message{Colors.RESET}\n"
        )
        assert actual_call == expected
