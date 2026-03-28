#building stagee
FROM node:20-alpine AS builder
WORKDIR /app

ARG API_PROXY_TARGET=http://api-gateway:9000
ENV API_PROXY_TARGET=${API_PROXY_TARGET}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

##run stageee
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm" , "start"]
