# Use the official NGINX image
FROM nginx:latest

# Copy the NGINX configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the HTTP port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
