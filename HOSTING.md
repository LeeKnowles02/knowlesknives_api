# Knowles Knives API — Code Capsules Hosting

Deploy the API as a **Backend Capsule** bound to a **MySQL Data Capsule**.

## Build and run

```bash
npm ci
npm run db:migrate
ADMIN_PASSWORD=your-strong-password npm run seed:admin
npm start
```

Run `db:migrate` on every deploy that includes schema changes. Run `seed:admin` once only.

## Required environment variables

| Variable | Purpose |
|----------|---------|
| `DB_HOST` | MySQL host (from Data Capsule) |
| `DB_PORT` | MySQL port (usually `3306`) |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Min 16 characters — signing secret for admin JWTs |
| `CLIENT_URL` | Public website URL for CORS (exact match) |
| `NODE_ENV` | Set to `production` |
| `PORT` | Provided by Code Capsules |

## Recommended for production

| Variable | Purpose |
|----------|---------|
| `CLOUDINARY_URL` | Cloudinary credentials (copy from dashboard) |
| `ADMIN_PASSWORD` | Required once to seed the admin user in production |

When `CLOUDINARY_URL` is set, admin uploads go to Cloudinary. Without it, files are stored on local disk (not durable across redeploys).

## Health check

```text
GET /api/health
```

Returns `{ status: "ok", database: "connected" }` when MySQL is reachable.

## Frontend routing

The Angular site calls `/api` on the same origin. Either:

- Route `/api/*` at the Code Capsules platform level to this API capsule, or
- Set `API_ORIGIN` on the web SSR capsule so it proxies `/api` to this API URL.

## First deploy checklist

1. Create MySQL Data Capsule and bind to Backend Capsule
2. Set all required env vars
3. Set `CLOUDINARY_URL`
4. Run migrations
5. Seed admin once with `ADMIN_PASSWORD`
6. Start API and verify `/api/health`
7. Log in at `/admin` on the website and test an image upload
