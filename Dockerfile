FROM node:22-slim AS builder

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/drizzle drizzle/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "node", "build/index.js" ]
