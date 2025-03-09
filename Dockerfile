FROM node:22

# Create app directory
WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm ci

COPY . .
RUN npm install

# Cnnot run build here, but we can copy the app-output directly into container
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
# EXPOSE 24678
CMD ["node", "build/index.js"]