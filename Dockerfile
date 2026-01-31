# base image
FROM node:23-alpine AS base

# install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# We need the apps folder for build time generation (SSG) 
# but we will mount it at runtime for updates.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up required folders with correct permissions
RUN mkdir -p /apps /templates && chown nextjs:nodejs /apps /templates

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: Remember to mount your data volumes:
# -v /path/to/your/apps:/apps
# -v /path/to/your/templates:/templates
# Set APPS_DIR=/apps and TEMPLATES_DIR=/templates env vars

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
