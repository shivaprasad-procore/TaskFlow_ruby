# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /Frontend

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy React build from previous step
COPY --from=build /Frontend/build /usr/share/nginx/html

# Optional: Copy custom nginx config (if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
