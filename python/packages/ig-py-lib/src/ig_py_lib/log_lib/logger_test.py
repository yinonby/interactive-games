from datetime import datetime, timezone
from unittest.mock import patch

import pytest

from .logger import PyLogger  # Path based on your error log

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


def test_log_format_standard(fixed_time):
    # Patch sys.stdout.write specifically to capture the string
    with patch("sys.stdout.write") as mock_write:
        logger.log("test message")

        # Get the actual string passed to sys.stdout.write
        actual_call = mock_write.call_args[0][0]
        expected = "2026-02-03T21:39:08.879Z LOG: test message\033[0m\n"
        assert actual_call == expected


def test_warn_color_and_level(fixed_time):
    with patch("sys.stdout.write") as mock_write:
        logger.warn("warning message")
        actual_call = mock_write.call_args[0][0]

        assert logger.YELLOW in actual_call
        assert "WRN: warning message" in actual_call
        assert actual_call.endswith("\033[0m\n")


@pytest.mark.parametrize(
    "level_func,label",
    [
        (logger.info, "INF"),
        (logger.debug, "DBG"),
        (logger.warn, "WRN"),
        (logger.error, "ERR"),
    ],
)
def test_all_shorthand_labels(fixed_time, level_func, label):
    with patch("sys.stdout.write") as mock_write:
        level_func("msg")
        actual_call = mock_write.call_args[0][0]
        assert f"{label}: msg" in actual_call
