FROM node:20-alpine AS base

# 添加必要的构建工具和依赖
RUN apk add --no-cache python3 g++ make git libc6-compat

# 安装依赖
FROM base AS deps
WORKDIR /app

# 复制package.json和锁文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .yarnrc.yml ./
COPY .yarn ./.yarn

# 分两步安装依赖，先安装生产依赖，再安装所有依赖(包括开发依赖)
# 首先设置构建相关环境变量
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp
ENV npm_config_build_from_source=true
ENV ESBUILD_BINARY_PATH=/usr/local/bin/esbuild

# 安装依赖 - 直接在命令中设置超时参数
RUN yarn install --immutable --network-timeout 600000

# 开发环境构建
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV SHARP_IGNORE_GLOBAL_LIBVIPS 1
ENV npm_config_build_from_source true

# 构建应用
RUN yarn build

# 生产环境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 