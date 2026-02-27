FROM oven/bun:latest

WORKDIR /app

# Install dependencies first (for caching)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the code
COPY . .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
