# bun-react-template

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
