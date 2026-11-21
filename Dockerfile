# Build de la app estática (Vite)
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@12.14.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Servir el resultado con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
