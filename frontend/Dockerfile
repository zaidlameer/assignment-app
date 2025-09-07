# ----------- Build Stage -----------
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and lock file first (to leverage caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production bundle (Vite outputs to "dist")
RUN npm run build

# ----------- Production Stage -----------
FROM nginx:alpine

# Copy built files from build stage to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a default nginx.conf (optional if you want SPA routing)
# If not provided, nginx will just serve index.html normally
# Uncomment the following if you want to handle React Router SPA routes:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
