FROM node:16 as builder
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine as runner
COPY --from=builder site /usr/share/nginx/html
