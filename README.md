https://github.com/darunbjork/devquiz-api

# bun-react-template

Tests of All Endpoints:

<img width="1440" height="900" alt="Screenshot 2026-02-27 at 16 07 41" src="https://github.com/user-attachments/assets/d79c74f4-8401-407a-b831-1b12b62fd446" />
<img width="1440" height="900" alt="Screenshot 2026-02-27 at 16 03 19" src="https://github.com/user-attachments/assets/919a0ea6-c25c-4e62-ac10-ebc0f217ff5e" />
<img width="1440" height="900" alt="Screenshot 2026-02-27 at 16 03 12" src="https://github.com/user-attachments/assets/ff66e046-2abc-45ad-a6e8-43566293c6d0" />
<img width="1440" height="900" alt="Screenshot 2026-02-27 at 16 03 04" src="https://github.com/user-attachments/assets/66e7d43a-8c82-40e5-93e3-2e57dd44cdff" />


The Swagger UI screenshot
<img width="2880" height="10297" alt="SCR-20260225-sdht" src="https://github.com/user-attachments/assets/d47ad9a3-aa51-41ac-91ab-1c746f0605af" />

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

---

## Backend Server Commands

To start the backend Fastify server in watch mode:

```bash
bun --watch index.ts
```

To verify the backend server is running and connected to the database:

```bash
curl http://localhost:3000/health
```

Expected output: `{"status":"ok","db":"connected"}`

To access the API documentation (Swagger UI) in your browser:

```
http://localhost:3000/docs
```


---

## Database Seeding & Docker Commands

To seed the database with an admin user and sample data (requires MongoDB to be running, e.g., via Docker Compose):

```bash
bun run seed.ts
```

To build and run the application and a MongoDB instance using Docker Compose:
(Note: Ensure no local processes are using ports 3000 or 27017 before running this command)

```bash
docker compose up --build
```

To test the application's health once running via Docker:

```bash
curl http://localhost:3000/health
```
Expected output: `{"db":"connected","status":"ok"}`

To test admin login with the seeded user (email: `admin@devquiz.com`, password: `admin123`):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@devquiz.com","password":"admin123"}'
```
Expected output: A JSON object containing `token`, `refreshToken`, and `user` data.

---

## ESLint Commands

To run ESLint to check for code quality and style issues:

```bash
bun eslint .
```

To run ESLint and automatically fix fixable issues:

```bash
bun eslint . --fix
```

---

## Testing Commands

Here are some commands to quickly verify core functionalities:

#### Test TypeScript Configuration
```bash
echo 'console.log("DevQuiz API ✅")' > test.ts && bun test.ts && rm test.ts
```

#### Test Logger Functionality
```bash
bun -e "import logger from './logger.ts'; logger.info('Logger works!');"
```
```bash
cat logs/combined.log
```

#### Test Error Classes
```bash
bun -e "
import { NotFoundError } from './errors.ts';
try { throw new NotFoundError('Quiz'); }
catch(e) { console.log(e.message, 'Status:', e.statusCode); }
"
```

#### Test Database Connection

To start MongoDB with Docker:

```bash
docker run -d --name devquiz-mongo -p 27017:27017 mongo:7
```

To test the DB connection:

```bash
bun -e "
import { connectMongo } from './db.ts';
await connectMongo();
console.log('MongoDB connection verified! 🚀');
process.exit(0);
"
```

#### Test Password Utilities
```bash
bun -e "
import { hashPassword, verifyPassword } from './utils/password.ts';
const testPassword = 'mysecretpassword';
const hashedPassword = await hashPassword(testPassword);
console.log('Hashed Password:', hashedPassword);
const isMatch = await verifyPassword(hashedPassword, testPassword);
console.log('Password Verified:', isMatch);
const isMismatched = await verifyPassword(hashedPassword, 'wrongpassword');
console.log('Password Mismatched (expected false):', isMismatched);
"
```
# or
```bash
bun -e '
import { hashPassword, verifyPassword } from "./utils/password.ts";
const testPassword = "mysecretpassword";
const hashedPassword = await hashPassword(testPassword);
console.log("Hashed Password:", hashedPassword);
const isMatch = await verifyPassword(hashedPassword, testPassword);
console.log("Password Verified:", isMatch);
const isMismatched = await verifyPassword(hashedPassword, "wrongpassword");
console.log("Password Mismatched (expected false):", isMismatched);
'
```
