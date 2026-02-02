from typing import Any, Sequence

import jwt


class JwtUtils:
    def __init__(self, jwt_secret: str, jwt_algorithms: Sequence[str]):
        self.jwt_secret = jwt_secret
        self.jwt_algorithms = jwt_algorithms

    # Pseudo function to extract userId from auth token
    def decode_token(self, token: str) -> dict[str, Any] | None:
        try:
            payload: dict[str, Any] = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=self.jwt_algorithms,
            )
            return payload
        except Exception:
            return None
