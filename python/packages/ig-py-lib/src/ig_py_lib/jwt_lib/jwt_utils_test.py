# tests/test_auth_token_manager.py
import pytest
import jwt
from ig_py_lib import JwtUtils

SECRET = "my_secret_key_my_secret_key_my_secret_key_my_secret_key"
ALGORITHMS = ["HS256"]


@pytest.mark.parametrize("token_prop", ["123", "user_abc", 42])
def test_decode_token(token_prop):
    # Create the payload
    payload = {"tokenProp": token_prop}

    # Encode the JWT
    token = jwt.encode(payload, SECRET, algorithm="HS256")

    # Instantiate the JwtUtils
    manager = JwtUtils(jwt_secret=SECRET, jwt_algorithms=ALGORITHMS)

    # Decode token
    decoded_token = manager.decode_token(token)

    # Extract token_prop
    decoded_token_prop = decoded_token.get("tokenProp")

    # Assert correct extraction
    assert decoded_token_prop == token_prop


def test_decode_token_invalid_secret():
    # Create the payload
    payload = {"tokenProp": "11"}

    # Encode the JWT
    invalid_token = jwt.encode(
        payload,
        "other_secret_other_secret_other_secret_other_secret",
        algorithm="HS256",
    )

    # Instantiate the JwtUtils
    manager = JwtUtils(jwt_secret=SECRET, jwt_algorithms=ALGORITHMS)

    # Decode token
    assert manager.decode_token(invalid_token) is None


def test_decode_token_invalid_token() -> None:
    # Invalid JWT
    invalid_token = "this.is.not.a.valid.jwt"

    manager = JwtUtils(jwt_secret=SECRET, jwt_algorithms=ALGORITHMS)

    # Should return None on invalid token
    assert manager.decode_token(invalid_token) is None
