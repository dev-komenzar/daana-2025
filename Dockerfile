FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG MICROCMS_API_KEY=""
ARG PB_URL="https://pb.samgha.org"
ARG CMS_SOURCE="pocketbase"

ENV MICROCMS_API_KEY=$MICROCMS_API_KEY \
    PB_URL=$PB_URL \
    CMS_SOURCE=$CMS_SOURCE

RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["node", "build"]
