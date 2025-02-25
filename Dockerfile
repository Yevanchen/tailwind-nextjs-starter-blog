FROM node:20-alpine AS base

# 添加必要的构建工具和依赖
RUN apk add --no-cache python3 g++ make git libc6-compat linux-headers vips-dev build-base

# 安装依赖
FROM base AS deps
WORKDIR /app

# 复制package.json和锁文件
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn ./.yarn

# 设置构建相关环境变量
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp
ENV npm_config_build_from_source=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 安装依赖
RUN yarn install --immutable --network-timeout 600000

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制项目文件
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--experimental-json-modules --experimental-vm-modules"

# 构建应用
RUN yarn build --no-lint

# 生产环境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 添加非root用户运行应用
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 只复制生产环境需要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口
EXPOSE 3000

# 设置启动变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动命令
CMD ["node", "server.js"] 