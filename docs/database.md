# Database Schema Documentation

## Overview
The database uses a normalized PostgreSQL relational schema powered by Prisma ORM.

## Core Schema Entities (Phase 1 Baseline)
- `PlatformUser`: Platform administrators and super admins.
- `Organization`: Companies/Tenants onboarded on the HCM platform.
- `User`: Accounts associated with organizations (HR Admins, Employees, Managers).
- `Role` & `Permission`: Dynamic RBAC system for grant-based access control.
- `AuditLog`: System-wide immutable action log.
- `SystemHealth`: Node and service heartbeat tracking.

## Multi-Tenant Indexing Strategy
Every tenant model is indexed by `(organizationId, id)` and composite foreign key indices to ensure fast query performance and strict data boundary enforcement.
