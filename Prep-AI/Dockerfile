# Stage 1: Build static assets
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies using package.json and lock file
COPY package*.json ./
RUN npm install

# Copy source and build project
COPY . .
RUN npm run build

# Stage 2: Serve static assets with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
