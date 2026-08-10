from functools import lru_cache

from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LlamaParse Configuration
    LLAMA_CLOUD_API_KEY: str

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # File Upload Configuration
    MAX_FILE_SIZE: int = 25 * 1024 * 1024  # 25 MB
    ALLOWED_EXTENSIONS: list = [".pdf"]
    UPLOAD_DIR: str = "./uploads"

    # Where extracted JSON results are persisted for later use
    PARSED_DATA_DIR: str = "./parsed_data"

    # Brevo SMTP Configuration (used by services/email_service.py)
    BREVO_SMTP_USER: str
    BREVO_SMTP_PASS: str
    BREVO_SENDER_EMAIL: EmailStr

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
        env_ignore_empty=True,
    )


@lru_cache()
def get_settings():
    return Settings()