# Weski

Hotel search app with a NestJS API backend and a React + Vite frontend. Results are streamed progressively to the UI via Server-Sent Events (SSE).

## Structure

```
weski/
├── weski-api/          # NestJS backend (port 3000)
└── weski-hotels-app/   # React + Vite frontend (port 5173)
```

## Running locally

Both services need to run simultaneously. Open two terminals.

### 1. Backend

```bash
cd weski-api
npm install
npm run start:dev
```

API available at `http://localhost:3000/api`

### 2. Frontend

```bash
cd weski-hotels-app
npm install
npm run dev
```

App available at `http://localhost:5173`

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/hotels/search` | SSE stream of hotel results |

### Search query params

| Param | Type | Example |
|-------|------|---------|
| `skiSiteId` | number | `1` |
| `groupSize` | number | `4` |
| `startDate` | string (YYYY-MM-DD) | `2026-03-15` |
| `endDate` | string (YYYY-MM-DD) | `2026-03-20` |

## Notes

- No database is connected yet — all data is mocked in the services.
- The search endpoint fans out across multiple providers and group sizes, streaming batches of results as they resolve.
