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

RUN apk add --no-cache curl netcat-openbsd

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY <<'EOF' /app/healthcheck.sh
#!/bin/sh
if [ "$DB_TYPE" = "mongo" ]; then
    # Check MongoDB
    if ! nc -z mongodb 27017; then
        echo "MongoDB check failed"
        exit 1
    fi
    
    # Check Redis
    if ! nc -z redis 6379; then
        echo "Redis check failed"
        exit 1
    fi
else
    # Only check Redis
    if ! nc -z redis 6379; then
        echo "Redis check failed"
        exit 1
    fi
fi

echo "All checks passed"
exit 0
EOF

RUN chmod +x /app/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /app/healthcheck.sh

EXPOSE 3000
CMD ["yarn", "start"]
