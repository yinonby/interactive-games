import os
from unittest.mock import patch

import pytest

from .env_utils import EnvUtils


def test_get_env_var_success():
    """Verify it returns the value when the environment variable exists."""
    var_name = "TEST_VAR"
    expected_value = "hello_world"

    # Use patch.dict to temporarily set an environment variable
    with patch.dict(os.environ, {var_name: expected_value}):
        result = EnvUtils.get_env_var(var_name)
        assert result == expected_value


def test_get_env_var_missing_raises_exception():
    """Verify it raises an Exception when the variable is missing."""
    var_name = "NON_EXISTENT_VAR"

    # Ensure the variable is definitely not in the environment
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(Exception) as exc_info:
            EnvUtils.get_env_var(var_name)

        assert str(exc_info.value) == f"Missing env var: {var_name}"


def test_get_env_var_with_monkeypatch(monkeypatch):
    """Alternative way using pytest's built-in monkeypatch fixture."""
    monkeypatch.setenv("API_KEY", "12345")
    assert EnvUtils.get_env_var("API_KEY") == "12345"
