FROM node:22-alpine AS builder

ARG PORT
ENV PORT=$PORT
ARG ORIGIN
ENV ORIGIN=$ORIGIN

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/drizzle drizzle/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
ENV NODE_ENV=production
CMD [ "node", "build/index.js" ]
