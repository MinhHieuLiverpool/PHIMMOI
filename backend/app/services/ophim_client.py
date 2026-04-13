from __future__ import annotations

from dataclasses import dataclass

import httpx


@dataclass
class UpstreamApiError(Exception):
    status_code: int
    detail: str


class OPhimClient:
    def __init__(self, base_url: str, timeout_seconds: float) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout_seconds = timeout_seconds

    async def get_json(self, path: str, params: dict[str, str] | None = None) -> object:
        url = f"{self.base_url}/{path.lstrip('/')}"

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.get(url, params=params, headers={"accept": "application/json"})
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code
            detail = f"Upstream API returned HTTP {status_code}"
            raise UpstreamApiError(status_code=status_code, detail=detail) from exc
        except httpx.HTTPError as exc:
            raise UpstreamApiError(status_code=502, detail="Cannot reach upstream API") from exc

    async def get_binary(self, url: str) -> tuple[bytes, str]:
        headers = {
            "accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            " (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "referer": "https://ophim1.com/",
        }

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout_seconds,
                follow_redirects=True,
            ) as client:
                response = await client.get(url, headers=headers)

            response.raise_for_status()

            content_type = response.headers.get("content-type", "").split(";")[0].strip()
            if not content_type.startswith("image/"):
                raise UpstreamApiError(
                    status_code=502,
                    detail="Upstream did not return an image payload",
                )

            return response.content, content_type
        except UpstreamApiError:
            raise
        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code
            detail = f"Upstream image returned HTTP {status_code}"
            raise UpstreamApiError(status_code=status_code, detail=detail) from exc
        except httpx.HTTPError as exc:
            raise UpstreamApiError(status_code=502, detail="Cannot reach image upstream") from exc
