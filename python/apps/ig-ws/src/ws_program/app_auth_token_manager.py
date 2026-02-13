from collections.abc import Sequence

from ig_py_lib import JwtUtils

from ws_program.app_defs import AUTH_JWT_ACCOUNT_ID_FIELD_NAME, AUTH_JWT_USER_ID_FIELD_NAME


class AppAuthTokenManager(JwtUtils):
    def __init__(self, jwt_secret: str, jwt_algorithms: Sequence[str]):
        self.jwt_secret = jwt_secret
        self.jwt_algorithms = jwt_algorithms
        self.jwt_utils: JwtUtils = JwtUtils(jwt_secret, jwt_algorithms)

    def get_user_id_from_auth_token(self, auth_token: str) -> str | None:
        try:
            decoded_token = self.jwt_utils.decode_token(auth_token)
            if decoded_token is None:
                raise Exception("Could not decode token")

            return decoded_token.get(AUTH_JWT_USER_ID_FIELD_NAME)

        except Exception:
            return None

    def get_account_id_from_auth_token(self, auth_token: str) -> str | None:
        try:
            decoded_token = self.jwt_utils.decode_token(auth_token)
            if decoded_token is None:
                raise Exception("Could not decode token")

            return decoded_token.get(AUTH_JWT_ACCOUNT_ID_FIELD_NAME)

        except Exception:
            return None
