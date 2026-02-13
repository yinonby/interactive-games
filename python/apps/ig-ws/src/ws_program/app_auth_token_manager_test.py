from unittest.mock import MagicMock

import pytest

from ws_program.app_defs import AUTH_JWT_ACCOUNT_ID_FIELD_NAME, AUTH_JWT_USER_ID_FIELD_NAME

from .app_auth_token_manager import AppAuthTokenManager


@pytest.mark.parametrize(
    "decode_side_effect, decoded_token, expected",
    [
        # decode_token raises exception → return None
        (Exception("decode failed"), None, None),
        # decode_token returns None → return None
        (None, None, None),
        # decode_token succeeds but decoded_token.get raises → return None
        (None, MagicMock(get=MagicMock(side_effect=Exception("get failed"))), None),
        # Success → return user id
        (None, {AUTH_JWT_USER_ID_FIELD_NAME: "abc123"}, "abc123"),
    ],
)
def test_get_user_id_from_auth_token(monkeypatch, decode_side_effect, decoded_token, expected):
    # Arrange
    manager = AppAuthTokenManager(jwt_secret="secret", jwt_algorithms=["HS256"])

    # Patch decode_token on the internal jwt_utils
    if decode_side_effect:
        # simulate exception when calling decode_token
        monkeypatch.setattr(
            manager.jwt_utils,
            "decode_token",
            lambda token: (_ for _ in ()).throw(decode_side_effect),
        )
    else:
        monkeypatch.setattr(manager.jwt_utils, "decode_token", lambda token: decoded_token)

    # Act
    result = manager.get_user_id_from_auth_token("dummy_token")

    # Assert
    assert result == expected


@pytest.mark.parametrize(
    "decode_side_effect, decoded_token, expected",
    [
        # decode_token raises exception → return None
        (Exception("decode failed"), None, None),
        # decode_token returns None → return None
        (None, None, None),
        # decode_token succeeds but decoded_token.get raises → return None
        (None, MagicMock(get=MagicMock(side_effect=Exception("get failed"))), None),
        # Success → return account id
        (None, {AUTH_JWT_ACCOUNT_ID_FIELD_NAME: "abc123"}, "abc123"),
    ],
)
def test_get_account_id_from_auth_token(monkeypatch, decode_side_effect, decoded_token, expected):
    # Arrange
    manager = AppAuthTokenManager(jwt_secret="secret", jwt_algorithms=["HS256"])

    # Patch decode_token on the internal jwt_utils
    if decode_side_effect:
        # simulate exception when calling decode_token
        monkeypatch.setattr(
            manager.jwt_utils,
            "decode_token",
            lambda token: (_ for _ in ()).throw(decode_side_effect),
        )
    else:
        monkeypatch.setattr(manager.jwt_utils, "decode_token", lambda token: decoded_token)

    # Act
    result = manager.get_account_id_from_auth_token("dummy_token")

    # Assert
    assert result == expected
