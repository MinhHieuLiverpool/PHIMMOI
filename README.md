# PHIMMOI Fullstack (React + FastAPI)

Project duoc tach ro thanh 2 folder:

- `frontend`: React + TypeScript + Vite + pnpm
- `backend`: Python FastAPI (proxy OPhim API)

## 1) Chay Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend docs:

- Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

## 2) Chay Frontend

```bash
cd frontend
copy .env.example .env
pnpm install
pnpm dev
```

Frontend mac dinh goi backend qua:

- `VITE_API_BASE_URL=http://localhost:8000/api`

## 3) Cac endpoint backend da ho tro

- `GET /api/home`
- `GET /api/danh-sach/{slug}`
- `GET /api/tim-kiem?keyword=...`
- `GET /api/the-loai`
- `GET /api/the-loai/{slug}`
- `GET /api/quoc-gia`
- `GET /api/quoc-gia/{slug}`
- `GET /api/nam-phat-hanh`
- `GET /api/nam-phat-hanh/{year}`
- `GET /api/phim/{slug}`
- `GET /api/phim/{slug}/images`
- `GET /api/phim/{slug}/peoples`
- `GET /api/phim/{slug}/keywords`

Tat ca endpoint tren deu proxy den OPhim API base URL:

- `https://ophim1.com/v1/api`

## 4) Bien moi truong backend

Copy file mau:

```bash
cd backend
copy .env.example .env
```

Gia tri:

- `OPHIM_BASE_URL`: URL API upstream
- `ALLOWED_ORIGINS`: origin FE duoc phep CORS, cach nhau boi dau phay
- `REQUEST_TIMEOUT_SECONDS`: timeout request den upstream
