# # ---------- Stage 1: Build ----------
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# RUN npm run build


# # ---------- Stage 2: Export build ----------
# FROM alpine

# WORKDIR /app

# COPY --from=builder /app/dist ./dist



FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# билдим и кладём в volume
CMD ["sh", "-c", "npm run build && cp -r dist/* /output"]