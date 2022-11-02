FROM node:16 as builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine as runner
COPY --from=builder /app/dist /usr/share/nginx/html
