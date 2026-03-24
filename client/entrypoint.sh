#!/bin/sh

# Create env-config.js with environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_ORG_ID: "${VITE_ORG_ID}",
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_KEY: "${VITE_SUPABASE_KEY}"
};
EOF

# Start Nginx
exec nginx -g "daemon off;"
