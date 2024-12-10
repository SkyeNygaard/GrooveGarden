# Build stage
FROM node:20.18.0 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM node:20.18.0-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/svrdist/server.js ./dist/server.js
COPY --from=build /app/package.json ./

RUN yarn install --production --frozen-lockfile

EXPOSE 3001

CMD ["node", "./dist/server.js"]
