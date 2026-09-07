# API Guidelines & Specification

## Versioning & Base URL
All REST endpoints are versioned under:
`http://localhost:4000/api/v1`

## Standard API Response Structure
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {},
  "timestamp": "2026-09-07T00:00:00.000Z"
}
```

## Standard Error Response Structure
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found",
  "timestamp": "2026-09-07T00:00:00.000Z",
  "path": "/api/v1/employees/invalid-id"
}
```

## Health Checks Endpoint
`GET /api/v1/health`
Response:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```
