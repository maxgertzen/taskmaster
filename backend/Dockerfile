FROM node:20
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

ARG USE_MOCK
ENV USE_MOCK=${USE_MOCK}

RUN yarn build
EXPOSE 3000
CMD ["yarn", "dev"]
