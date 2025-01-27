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
EXPOSE ${PORT}
CMD ["npm", "start"]

# docker build --tag local-personal-api:latest .
# docker run -d --name personal-api --env-file .env --publish 3000:3000 local-personal-api:latest
