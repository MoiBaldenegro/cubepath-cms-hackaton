# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Argumentos de construcción para recibir las variables de entorno
ARG VITE_API_URL
ARG VITE_ORG_ID
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

# Establecer las variables de entorno para que estén disponibles durante el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ORG_ID=$VITE_ORG_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]