# ---------------------------------------------------
# Stage 1: Base image with runtime dependencies
# ---------------------------------------------------
FROM node:24-bookworm-slim AS base

# Install OpenSSL for Prisma engine & CA certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@12.10.1

WORKDIR /app

# ---------------------------------------------------
# Stage 2: Install dependencies (with build tools for native addons like bcrypt)
# ---------------------------------------------------
FROM base AS dependencies

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    gcc \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# ---------------------------------------------------
# Stage 3: Build application
# ---------------------------------------------------
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client and compile NestJS app
RUN pnpm prisma:generate
RUN pnpm build

# ---------------------------------------------------
# Stage 4: Production dependencies
# ---------------------------------------------------
FROM base AS prod-dependencies

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    gcc \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# ---------------------------------------------------
# Stage 5: Production runner
# ---------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Copy production node_modules, build output, prisma files, and config
COPY --chown=node:node --from=prod-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/generated ./generated
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/prisma7.config.ts ./prisma7.config.ts
COPY --chown=node:node package.json ./

# Copy and setup entrypoint script
COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/src/main"]
