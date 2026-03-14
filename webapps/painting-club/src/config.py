from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class PostgreSQLConfig(BaseSettings):
    host: str = "localhost"
    name: str = "app"
    port: int = 5432
    user: str = "postgres"
    password: str = "postgres"

    model_config = SettingsConfigDict(
        env_prefix="PG_",
        env_file=Path(__file__).parent.parent / ".env",
        case_sensitive=False,
    )

    @property
    def connection_string(self) -> str:
        return (
            f"postgresql+asyncpg://{self.user}:{quote_plus(self.password)}"
            f"@{self.host}:{self.port}/{self.name}"
        )
    
    @property
    def connection_string_sync(self) -> str:
        return (
            f"postgresql://{self.user}:{quote_plus(self.password)}"
            f"@{self.host}:{self.port}/{self.name}"
        )
