FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
RUN apk update
RUN apk add iptables sudo
ENV NODE_ENV production
# RUN adduser user1
# RUN adduser user1 sudo
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chmod=777 idleDocker.sh ./idleDocker.sh
RUN touch ./serverlogs.log
RUN chown nextjs:nodejs ./serverlogs.log
# USER user1
EXPOSE 3000
ENV PORT 3000
CMD ["./idleDocker.sh"]