# Development Setup & Local Environment Guide

## Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)
- Redis (via Docker)

## Step-by-Step Local Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Omatsulijoshua/HR-Management.git
   cd HR-Management
   ```

2. **Environment File Setup**:
   Copy `.env.example` to `.env.development` or configure workspace-level `.env` files inside `apps/api` and `apps/web`.

3. **Start Local Docker Containers**:
   ```bash
   docker-compose up -d
   ```
   This initializes:
   - PostgreSQL on `localhost:5432` (`hrms_db`)
   - Redis on `localhost:6379`

4. **Install Monorepo Dependencies**:
   ```bash
   npm install
   ```

5. **Run Database Migrations & Generate Prisma Client**:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

6. **Start Backend API (NestJS)**:
   ```bash
   npm run dev:api
   ```
   - REST API Base URL: `http://localhost:4000/api/v1`
   - Health Check: `http://localhost:4000/api/v1/health`
   - Swagger OpenAPI Docs: `http://localhost:4000/api/docs`

7. **Start Frontend Web Application (Next.js)**:
   ```bash
   npm run dev:web
   ```
   - Application URL: `http://localhost:3000`
