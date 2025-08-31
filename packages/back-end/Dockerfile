FROM node:22.19.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM node:22.19.0-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:22.19.0-alpine AS runner
WORKDIR /usr/app
ARG APP_ENV
COPY --from=builder /app/build ./build
COPY package.json ./
COPY .env.$APP_ENV .env
RUN npm install -g pnpm
RUN pnpm install --prod
USER node
ENV NODE_ENV="production"
CMD ["npm", "start"]
