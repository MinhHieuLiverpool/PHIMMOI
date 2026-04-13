from urllib.parse import urlparse

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response

from app.core.config import settings
from app.services.ophim_client import OPhimClient, UpstreamApiError

router = APIRouter(prefix="/api", tags=["ophim"])
client = OPhimClient(
    base_url=settings.ophim_base_url,
    timeout_seconds=settings.request_timeout_seconds,
)


def proxy_error(exc: UpstreamApiError) -> HTTPException:
    return HTTPException(status_code=exc.status_code, detail=exc.detail)


def is_allowed_image_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False

    if not parsed.hostname:
        return False

    hostname = parsed.hostname.lower()

    for allowed_host in settings.image_proxy_allowed_hosts:
        if hostname == allowed_host or hostname.endswith(f".{allowed_host}"):
            return True

    return False


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "backend-fastapi"}


@router.get("/image")
async def image_proxy(url: str = Query(..., min_length=10, max_length=1600)) -> Response:
    if not is_allowed_image_url(url):
        raise HTTPException(status_code=400, detail="Image host is not allowed")

    try:
        image_bytes, content_type = await client.get_binary(url)
        return Response(
            content=image_bytes,
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=3600"},
        )
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/home")
async def home() -> object:
    try:
        return await client.get_json("home")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/danh-sach/{slug}")
async def danh_sach(slug: str) -> object:
    try:
        return await client.get_json(f"danh-sach/{slug}")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/tim-kiem")
async def tim_kiem(keyword: str = Query(..., min_length=1)) -> object:
    try:
        return await client.get_json("tim-kiem", params={"keyword": keyword})
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/the-loai")
async def the_loai() -> object:
    try:
        return await client.get_json("the-loai")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/the-loai/{slug}")
async def the_loai_slug(slug: str) -> object:
    try:
        return await client.get_json(f"the-loai/{slug}")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/quoc-gia")
async def quoc_gia() -> object:
    try:
        return await client.get_json("quoc-gia")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/quoc-gia/{slug}")
async def quoc_gia_slug(slug: str) -> object:
    try:
        return await client.get_json(f"quoc-gia/{slug}")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/nam-phat-hanh")
async def nam_phat_hanh() -> object:
    try:
        return await client.get_json("nam-phat-hanh")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/nam-phat-hanh/{year}")
async def nam_phat_hanh_year(year: int) -> object:
    try:
        return await client.get_json(f"nam-phat-hanh/{year}")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/phim/{slug}")
async def phim(slug: str) -> object:
    try:
        return await client.get_json(f"phim/{slug}")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/phim/{slug}/images")
async def phim_images(slug: str) -> object:
    try:
        return await client.get_json(f"phim/{slug}/images")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/phim/{slug}/peoples")
async def phim_peoples(slug: str) -> object:
    try:
        return await client.get_json(f"phim/{slug}/peoples")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc


@router.get("/phim/{slug}/keywords")
async def phim_keywords(slug: str) -> object:
    try:
        return await client.get_json(f"phim/{slug}/keywords")
    except UpstreamApiError as exc:
        raise proxy_error(exc) from exc
