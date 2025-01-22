FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]

# docker build --tag personal-api:1.0 .
# docker run --name personal-api --env-file .env --volume C:/path/to/service-account-key.json:/app/service-account-key.json --publish 3000:3000 personal-api:1.0
