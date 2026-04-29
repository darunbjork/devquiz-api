# syntax=docker/dockerfile:1
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (including dev dependencies for tests)
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Run tests in a separate stage (optional, keeps final image small)
FROM deps AS test
COPY . .
RUN bun test

# Final production image
FROM base AS runner
WORKDIR /app

# Copy only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use a non‑root user for security
RUN addgroup --system --gid 1001 bunjs && \
  adduser --system --uid 1001 bunjs
USER bunjs

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "start"]