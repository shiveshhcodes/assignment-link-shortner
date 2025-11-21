# TinyLink Backend

Production-ready backend for TinyLink URL shortener built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Testing**: Jest + Supertest

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your database connection:

```
DATABASE_URL=postgresql://user:password@localhost:5432/tinylink
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### 3. Database Setup

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /healthz` - Returns service health status

### Links Management
- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links (supports pagination and search)
- `GET /api/links/:code` - Get link details
- `DELETE /api/links/:code` - Soft delete a link

### Redirect
- `GET /:code` - Redirect to target URL and increment click count

## API Examples

### Create Link

```bash
curl -X POST http://localhost:8000/api/links \
  -H "Content-Type: application/json" \
  -d '{"target": "https://example.com", "code": "mylink1"}'
```

### List Links

```bash
curl http://localhost:8000/api/links?limit=20&offset=0&q=example
```

### Get Link Details

```bash
curl http://localhost:8000/api/links/mylink1
```

### Delete Link

```bash
curl -X DELETE http://localhost:8000/api/links/mylink1
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Database Management

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

### Reset Database

```bash
npx prisma migrate reset
```

### View Database

```bash
npx prisma studio
```

## Production Deployment

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables

Ensure these are set in production:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_BASE_URL` - Public URL of your backend (e.g., https://api.tinylink.com)

## Project Structure

```
backend/
├── pages/
│   ├── api/
│   │   ├── healthz.ts
│   │   └── links/
│   │       ├── index.ts
│   │       └── [code].ts
│   └── [code].tsx
├── lib/
│   ├── prisma.ts
│   └── validators.ts
├── prisma/
│   └── schema.prisma
├── tests/
│   └── api.test.ts
└── .github/
    └── workflows/
        └── nodejs-ci.yml
```

## Validation Rules

### URL Validation
- Must be valid HTTP or HTTPS URL
- Validated using WHATWG URL standard

### Code Validation
- Length: 6-8 characters
- Characters: Alphanumeric only (A-Z, a-z, 0-9)
- Case-sensitive
- Regex: `/^[A-Za-z0-9]{6,8}$/`

## Error Handling

All errors return JSON with consistent format:

```json
{
  "error": "Error message"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `302` - Redirect
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## CI/CD

GitHub Actions workflow runs on push/PR:
- Installs dependencies
- Generates Prisma Client
- Runs type checking
- Runs linter
- Executes test suite

## License

MIT
