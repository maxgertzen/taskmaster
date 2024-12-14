FROM node:20
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

ARG VITE_USE_MOCK
ENV VITE_USE_MOCK=${VITE_USE_MOCK}

ARG VITE_MODE=staging
ENV VITE_MODE=${VITE_MODE}

RUN yarn build --mode ${VITE_MODE}
EXPOSE 3001
CMD ["yarn", "start"]
