from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    ophim_base_url: str
    allowed_origins: list[str]
    request_timeout_seconds: float
    image_proxy_allowed_hosts: list[str]


settings = Settings(
    ophim_base_url=os.getenv("OPHIM_BASE_URL", "https://ophim1.com/v1/api"),
    allowed_origins=[
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ],
    request_timeout_seconds=float(os.getenv("REQUEST_TIMEOUT_SECONDS", "20")),
    image_proxy_allowed_hosts=[
        host.strip().lower()
        for host in os.getenv("IMAGE_PROXY_ALLOWED_HOSTS", "img.ophim.live").split(",")
        if host.strip()
    ],
)
