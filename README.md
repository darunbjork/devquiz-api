# DevQuiz API

A high-performance, scalable backend API built with Bun, Fastify, and MongoDB.

## Key Libraries

- **Fastify**: A high-performance, low-overhead web framework for Node.js.
- **MongoDB**: A scalable NoSQL database with native TypeScript support.
- **Bcrypt.js**: A library for hashing passwords securely.
- **Winston**: A versatile logging library for Node.js.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **@fastify/jwt**: JSON Web Token support for Fastify.
- **@fastify/swagger**: API documentation generation.

## Production Deployment
The DevQuiz API is deployed on Render:
[API Documentation](https://devquiz-api-nblo.onrender.com/docs)

---

## Quick Start

### Prerequisites
- [Bun](https://bun.com) (latest version recommended)
- MongoDB instance

### Installation
```bash
bun install
```

### Development Server
```bash
bun dev
```

### Production Build
```bash
bun start
```

---

## API Documentation
Once the server is running, access the Swagger UI:
`http://localhost:3000/docs`

---

## Database & Docker

### Seeding Data
Seed the database with an admin user and sample data:
```bash
bun run src/scripts/seed.ts
```

### Docker Compose
Run the application and a MongoDB instance using Docker:
```bash
docker compose up --build
```

---

## Code Quality & Testing

### ESLint
Check for code quality issues:
```bash
bun eslint .
```
Fix issues automatically:
```bash
bun eslint . --fix
```

### Testing
Run tests to verify functionality:
```bash
bun test
```
