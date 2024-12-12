FROM node:20-alpine AS builder
WORKDIR /app

ARG NODE_ENV=development
ARG DB_TYPE=redis
ARG USE_MOCK=true

ENV NODE_ENV=${NODE_ENV}
ENV DB_TYPE=${DB_TYPE}
ENV USE_MOCK=${USE_MOCK}

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app

ARG NODE_ENV
ARG DB_TYPE
ARG USE_MOCK
ENV NODE_ENV=${NODE_ENV}
ENV DB_TYPE=${DB_TYPE}
ENV USE_MOCK=${USE_MOCK}

RUN apk add --no-cache curl mongodb-tools mongodb-shell

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY <<'EOF' /app/healthcheck.sh
#!/bin/sh
set -e
if [ "$DB_TYPE" = "mongo" ]; then
    mongosh "$MONGODB_URI" --eval "db.runCommand('ping')" >/dev/null && \
    curl -f http://redis:6379 >/dev/null 2>&1
else
    curl -f http://redis:6379 >/dev/null 2>&1
fi
curl -f http://redis:6379 >/dev/null 2>&1
EOF

RUN chmod +x /app/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /app/healthcheck.sh

EXPOSE 3000
CMD ["yarn", "start"]
