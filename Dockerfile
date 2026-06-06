# Use the official Bun image
FROM oven/bun:latest AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Use a non‑root user for security
RUN groupadd --system --gid 1001 bunjs && 
    useradd --system --uid 1001 --gid bunjs bunjs
USER bunjs

# Expose the port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["bun", "src/index.ts"]
