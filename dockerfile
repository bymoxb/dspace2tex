# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:24-alpine AS dependencies

WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# ============================================
# Stage 2: Build
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app
RUN corepack enable pnpm

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# ============================================
# Stage 3: Production dependencies
# ============================================
FROM node:24-alpine AS production-deps

WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile


# ============================================
# Stage 4: Minimal runtime
# ============================================
FROM gcr.io/distroless/nodejs24-debian13:nonroot AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY --from=production-deps --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist
COPY --from=builder --chown=nonroot:nonroot /app/package.json ./package.json

EXPOSE 4321

CMD ["./dist/server/entry.mjs"]
