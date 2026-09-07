# System Architecture Overview

## Multi-Tenancy Architecture
The platform enforces **Logical Data Isolation via Discriminator (`organizationId`)** on all organization-owned entities in PostgreSQL.

### Key Isolation Principles:
1. **Database Level**: Every organization entity includes an `organizationId` foreign key with composite indexes.
2. **Backend Guarding**: NestJS global guards intercept incoming HTTP requests, extract the tenant context from validated JWT payload (`organizationId`) or header (`x-organization-id`), and inject tenant context into Prisma queries.
3. **API Level**: Endpoints like `GET /api/v1/employees/:id` explicitly check that `employee.organizationId === currentTenantId`.

## System Layers
1. **Web Layer (`apps/web`)**: Next.js 14 App Router, Server/Client components, Tailwind CSS styling, state handling via React Query / Zustand.
2. **API Gateway & Services (`apps/api`)**: Modular NestJS backend exposing `/api/v1` REST endpoints and WebSocket gateways for real-time notifications.
3. **Data Layer**: PostgreSQL 16 managed via Prisma ORM for relational persistence; Redis for session caching, rate limiting, and BullMQ background task queues.
