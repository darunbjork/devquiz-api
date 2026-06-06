FROM oven/bun:latest

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose the port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["bun", "src/index.ts"]
