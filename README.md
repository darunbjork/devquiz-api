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
