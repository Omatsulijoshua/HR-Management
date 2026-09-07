# Modern Multi-Tenant HR Management & HCM SaaS Platform

A production-ready, highly scalable, multi-tenant Human Resources Management System (HRMS) and Human Capital Management (HCM) SaaS platform.

## 🚀 Core Features & Modules
- **Multi-Tenant Architecture**: Strict organizational isolation at database and application levels.
- **Complete HR Lifecycle**: Recruitment → Onboarding → Attendance → Leave → Payroll → Performance → Skills → Career → Expenses → Assets → Offboarding → Analytics.
- **Platform & Organization Environments**: Dedicated Super Admin dashboard alongside tenant-specific HR workflows.
- **Role-Based Access Control (RBAC)**: Fine-grained configurable permissions system.
- **AI-Powered HR Assistant & ATS**: Resume parsing, job description generation, role-aware Q&A, and candidate matching.
- **Workflow Automation Engine**: Event-triggered automated workflows, task assignments, and webhooks.

## 🛠 Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: NestJS, REST API (`/api/v1/`), WebSockets, BullMQ background processing.
- **Database & Cache**: PostgreSQL, Prisma ORM, Redis.
- **Infrastructure**: Docker Compose, S3-compatible Object Storage abstraction.

## 📁 Repository Structure
```
├── apps/
│   ├── api/        # NestJS Backend API & Prisma ORM
│   └── web/        # Next.js Frontend Application
├── docs/           # Architecture, Database, API, & Setup Guides
├── docker-compose.yml
├── .env.example
├── .env.development
└── README.md
```

## 🏁 Quick Start (Development)
1. **Start Infrastructure Services**:
   ```bash
   docker-compose up -d
   ```
2. **Install Dependencies & Set Up Database**:
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```
3. **Run Applications**:
   - Backend API (`http://localhost:4000`): `npm run dev:api`
   - API Documentation (`http://localhost:4000/api/docs`): Swagger UI
   - Web App (`http://localhost:3000`): `npm run dev:web`

## 📖 Documentation
Detailed documentation is maintained in the [`/docs`](./docs) directory:
- [Setup & Development Guide](./docs/setup.md)
- [System Architecture](./docs/architecture.md)
- [Database Schema Design](./docs/database.md)
- [API Guidelines](./docs/api.md)

## 📄 License
MIT
