FROM node:20.11.1-alpine AS build

WORKDIR /app

COPY ../package*.json ./

RUN npm ping
RUN npm install --verbose

COPY .. .

RUN npm run build

FROM node:20.11.1-alpine AS deployer

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

ENTRYPOINT  ["node", "build"]
