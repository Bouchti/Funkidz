# Step 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Note: In production, we'll use the main nginx container as a reverse proxy,
# but this Dockerfile allows the frontend to be built as a standalone unit if needed.
# For the funkidz structure, the root nginx container handles the proxy.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
