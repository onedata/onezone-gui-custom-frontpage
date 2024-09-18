FROM node:22.8.0-alpine3.19

RUN apk --no-cache add curl
RUN npm install -g http-server@14.1.1
