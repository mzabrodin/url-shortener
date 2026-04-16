FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.base.json ./
COPY shared/package.json                  ./shared/
COPY packages/gateway/package.json        ./packages/gateway/
COPY packages/shorten/package.json        ./packages/shorten/
COPY packages/redirect/package.json       ./packages/redirect/
COPY packages/analytics/package.json      ./packages/analytics/
COPY packages/stats/package.json          ./packages/stats/

RUN npm install

COPY shared            ./shared
COPY packages/stats    ./packages/stats

RUN npm run build -w @url-shortener/shared
RUN npm run build -w @url-shortener/stats

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json tsconfig.base.json ./
COPY shared/package.json                  ./shared/
COPY packages/gateway/package.json        ./packages/gateway/
COPY packages/shorten/package.json        ./packages/shorten/
COPY packages/redirect/package.json       ./packages/redirect/
COPY packages/analytics/package.json      ./packages/analytics/
COPY packages/stats/package.json          ./packages/stats/

RUN npm install --omit=dev

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/packages/stats/dist ./packages/stats/dist

USER node

CMD ["node", "packages/stats/dist/index.js"]
