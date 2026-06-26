# Knowles Knives API

REST API for the **Knowles Knives** custom knife-making business. Powers the public Angular website and admin panel.

## Tech Stack

- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT authentication
- bcrypt password hashing

## Prerequisites

- Node.js 18+
- MySQL 8+

## MySQL Database Setup

1. Start MySQL on your machine.

2. Create the database:

```sql
CREATE DATABASE knowles_knives CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. (Optional) Create a dedicated user:

```sql
CREATE USER 'knowles_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON knowles_knives.* TO 'knowles_user'@'localhost';
FLUSH PRIVILEGES;
```

## Installation

1. Clone or open this project.

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and update values:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

4. Edit `.env` with your MySQL credentials and a strong `JWT_SECRET`.

5. Run migrations and seed (first time only):

```bash
npm run setup
```

Or step by step:

```bash
npm run db:migrate
npm run seed
```

## Database Migrations

Schema changes are managed with **Sequelize migrations**, not at server startup.

| Command | Purpose |
|---------|---------|
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:migrate:undo` | Roll back the last migration |
| `npm run db:migrate:undo:all` | Roll back all migrations |

`npm start` and `npm run dev` only connect to the database — they do **not** create or alter tables.

When you change models in the future, add a new file under `src/migrations/` and run `npm run db:migrate`.

**Already created tables via the old sync approach?** Either:

- Drop and recreate the database, then run `npm run setup`, or
- If you want to keep existing data, manually insert a row into `SequelizeMeta`:

```sql
INSERT INTO SequelizeMeta (name) VALUES ('20260622140000-create-initial-schema.js');
```

## Running the API

Development (with auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

The API runs at `http://localhost:5000` by default.

Health check: `GET http://localhost:5000/api/health`

## Seed Data

Run migrations before seeding. Seed scripts insert data only — they do not create tables.

Seed the admin user:

```bash
npm run seed:admin
```

Seed mock knives, services, and enquiries:

```bash
npm run seed:mock
```

Seed everything:

```bash
npm run seed
```

**Default admin credentials:**

| Field    | Value                        |
|----------|------------------------------|
| Email    | admin@knowlesknives.co.za    |
| Password | Admin123!                    |

## Environment Variables

| Variable         | Description                          | Example                    |
|------------------|--------------------------------------|----------------------------|
| PORT             | Server port                          | 5000                       |
| DB_HOST          | MySQL host                           | localhost                  |
| DB_PORT          | MySQL port                           | 3306                       |
| DB_NAME          | Database name                        | knowles_knives             |
| DB_USER          | MySQL user                           | root                       |
| DB_PASSWORD      | MySQL password                       | password                   |
| JWT_SECRET       | Secret for signing JWTs              | (use a long random string) |
| JWT_EXPIRES_IN   | Token expiry                         | 1d                         |
| CLIENT_URL       | Angular frontend URL for CORS        | http://localhost:4200      |
| NODE_ENV         | Environment                          | development                |

## API Response Format

**Success:**

```json
{
  "success": true,
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Authentication

Protected admin routes require:

```
Authorization: Bearer <jwt_token>
```

Obtain a token via `POST /api/auth/login`.

## Endpoints

### Auth

| Method | Endpoint           | Access | Description              |
|--------|--------------------|--------|--------------------------|
| POST   | /api/auth/login    | Public | Login, returns JWT       |
| GET    | /api/auth/me       | Admin  | Current user             |
| POST   | /api/auth/logout   | Admin  | Logout (stateless)       |

### Knives (Public)

| Method | Endpoint              | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| GET    | /api/knives           | Active knives (filters: category, availability, featured, search) |
| GET    | /api/knives/:slug     | Single active knife by slug                      |

### Knives (Admin)

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | /api/admin/knives                 | All knives                     |
| GET    | /api/admin/knives/:id             | Single knife by ID             |
| POST   | /api/admin/knives                 | Create knife (1–4 images)      |
| PUT    | /api/admin/knives/:id             | Update knife and images        |
| DELETE | /api/admin/knives/:id             | Soft delete (active = false)   |
| PATCH  | /api/admin/knives/:id/status      | Update availability            |

### Services (Public)

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | /api/services         | Active services                |
| GET    | /api/services/:slug   | Single active service by slug  |

### Services (Admin)

| Method | Endpoint                                  | Description              |
|--------|-------------------------------------------|--------------------------|
| GET    | /api/admin/services                       | All services             |
| GET    | /api/admin/services/:id                   | Single service           |
| POST   | /api/admin/services                       | Create service           |
| PUT    | /api/admin/services/:id                   | Update service           |
| DELETE | /api/admin/services/:id                   | Soft delete              |
| PATCH  | /api/admin/services/:id/toggle-active     | Toggle active/inactive   |

### Enquiries

| Method | Endpoint                              | Access | Description           |
|--------|---------------------------------------|--------|-----------------------|
| POST   | /api/enquiries                        | Public | Submit enquiry        |
| GET    | /api/admin/enquiries                  | Admin  | List enquiries        |
| GET    | /api/admin/enquiries/:id              | Admin  | Single enquiry        |
| PATCH  | /api/admin/enquiries/:id/status       | Admin  | Update status         |
| DELETE | /api/admin/enquiries/:id              | Admin  | Delete enquiry        |

### Uploads (Admin)

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | /api/admin/upload           | Upload one image (`image` field)     |
| POST   | /api/admin/upload/multiple  | Upload up to 4 images (`images` field) |

### Dashboard

| Method | Endpoint               | Access | Description        |
|--------|------------------------|--------|--------------------|
| GET    | /api/admin/dashboard   | Admin  | Dashboard stats    |

## Example: Create Knife (Admin)

```bash
curl -X POST http://localhost:5000/api/admin/knives \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Fieldmaster Hunter",
    "category": "Hunting",
    "price": 485,
    "availability": "Available",
    "shortDescription": "A durable hunting knife built for field use.",
    "description": "Full detailed description here.",
    "steelType": "High carbon steel",
    "handleMaterial": "Walnut",
    "bladeLength": "110mm",
    "overallLength": "230mm",
    "notes": "Includes leather sheath.",
    "featured": true,
    "active": true,
    "images": [
      {
        "imageUrl": "assets/images/knife-1.jpg",
        "altText": "Fieldmaster Hunter main image"
      }
    ]
  }'
```

## Example: Submit Enquiry (Public)

```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "0821234567",
    "enquiryType": "General",
    "message": "Do you offer international shipping?"
  }'
```

## Image Uploads (Admin — from device)

Admins can upload images from their device. Files are saved to `uploads/` and served at `/uploads/<filename>`.

**Single image** (e.g. service photo):

```http
POST /api/admin/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

**Multiple images** (knife gallery, max 4):

```http
POST /api/admin/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: <file>
images: <file>
```

**Response (single):**

```json
{
  "success": true,
  "data": {
    "url": "http://localhost:5000/uploads/1719061234567-123456789.jpg",
    "filename": "1719061234567-123456789.jpg",
    "originalName": "knife-photo.jpg",
    "size": 245678,
    "mimeType": "image/jpeg"
  }
}
```

**Response (multiple):**

```json
{
  "success": true,
  "data": {
    "images": [
      { "url": "http://localhost:5000/uploads/...", "filename": "...", "originalName": "...", "size": 12345, "mimeType": "image/jpeg" }
    ]
  }
}
```

Use the returned `url` as `imageUrl` when creating/updating knives or services:

```json
{
  "name": "Fieldmaster Hunter",
  "images": [
    { "imageUrl": "http://localhost:5000/uploads/1719061234567-123456789.jpg", "altText": "Main view" }
  ]
}
```

### Angular upload example

```typescript
uploadKnifeImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  return this.http.post<{ success: boolean; data: { images: { url: string }[] } }>(
    `${environment.apiUrl}/admin/upload/multiple`,
    formData
  );
}
```

Do **not** set `Content-Type` manually — the browser adds the multipart boundary. Attach the JWT via an HTTP interceptor.

Allowed types: JPEG, PNG, WebP, GIF. Max size: 5 MB per file.

## Project Structure

```
src/
├── config/
├── migrations/
├── models/
├── controllers/
├── routes/
├── middleware/
├── seeders/
├── utils/
├── app.js
└── server.js
```

## Security Notes

- Passwords are hashed with bcrypt
- JWT tokens expire based on `JWT_EXPIRES_IN`
- Helmet, CORS, and rate limiting are enabled
- Login endpoint has stricter rate limiting
- Stack traces are hidden in production errors
