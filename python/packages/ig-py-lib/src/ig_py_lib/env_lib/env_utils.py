import os


class EnvUtils:
    @staticmethod
    def get_env_var(var_name: str) -> str:
        """Retrieves env var, throws if doesn't exist."""
        val = os.getenv(var_name)
        if val is None:
            raise Exception(f"Missing env var: {var_name}")
        return val
