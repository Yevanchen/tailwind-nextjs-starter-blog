FROM node:20-alpine AS base

# 添加必要的构建工具和依赖
RUN apk add --no-cache python3 g++ make git libc6-compat linux-headers vips-dev build-base

# 安装依赖
FROM base AS deps
WORKDIR /app

# 复制package.json和锁文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .yarnrc.yml ./
COPY .yarn ./.yarn

# 设置构建相关环境变量
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp
ENV npm_config_build_from_source=true
ENV ESBUILD_BINARY_PATH=/usr/local/bin/esbuild
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 安装依赖 - 首先安装原生依赖
RUN yarn install --immutable --network-timeout 600000

# 开发环境构建
FROM base AS builder
WORKDIR /app

# 首先复制必要的目录和文件
COPY tsconfig.json tsconfig.contentlayer.json next.config.js ./
COPY types ./types
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY data ./data
COPY layouts ./layouts
COPY public ./public
COPY css ./css

# 然后复制其他目录和文件
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV SHARP_IGNORE_GLOBAL_LIBVIPS 1
ENV npm_config_build_from_source true
ENV NODE_OPTIONS="--experimental-json-modules --experimental-vm-modules"

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