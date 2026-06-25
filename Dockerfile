FROM node:18-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY backend/package.json backend/package-lock.json backend/.npmrc ./
RUN npm ci

COPY backend/.babelrc ./
COPY backend/src ./src
RUN npx babel src --out-dir dist

RUN npm prune --omit=dev

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/server.js"]
