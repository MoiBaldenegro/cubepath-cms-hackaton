
FROM node:20-alpine as build

WORKDIR /app

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

# Create entrypoint script inline to avoid CRLF issues
RUN printf '#!/bin/sh\n\
\n\
# Create env-config.js with environment variables\n\
cat <<EOF > /usr/share/nginx/html/env-config.js\n\
window.ENV = {\n\
  VITE_API_URL: "${VITE_API_URL}",\n\
  VITE_ORG_ID: "${VITE_ORG_ID}",\n\
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",\n\
  VITE_SUPABASE_KEY: "${VITE_SUPABASE_KEY}"\n\
};\n\
EOF\n\
\n\
# Start Nginx\n\
exec nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start Nginx via entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]