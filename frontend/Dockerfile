FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# volume точка назначения
VOLUME ["/frontend_dist"]

CMD ["sh", "-c", "cp -r dist/* /frontend_dist/"]