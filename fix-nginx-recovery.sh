#!/bin/bash

# NGINX Recovery Script
# This script fixes the SSL certificate issue and restores your existing app

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

log "Starting NGINX recovery process..."

# Step 1: Remove the problematic wellness app site
log "Removing problematic wellness app NGINX configuration..."
if [ -f "/etc/nginx/sites-enabled/wellness-app" ]; then
    sudo rm -f /etc/nginx/sites-enabled/wellness-app
    log "Removed wellness-app from sites-enabled"
fi

if [ -f "/etc/nginx/sites-available/wellness-app" ]; then
    sudo mv /etc/nginx/sites-available/wellness-app /etc/nginx/sites-available/wellness-app.broken
    log "Moved broken wellness-app config to .broken backup"
fi

# Step 2: Test NGINX configuration
log "Testing NGINX configuration..."
if sudo nginx -t; then
    log "✓ NGINX configuration is now valid"
else
    error "NGINX configuration still has issues. Let's check default site..."
    # Make sure default site exists
    if [ ! -f "/etc/nginx/sites-available/default" ]; then
        warn "Default NGINX site missing. Creating basic default site..."
        cat << 'EOF' | sudo tee /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
        sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    fi
fi

# Step 3: Restart NGINX
log "Restarting NGINX..."
sudo systemctl restart nginx

# Step 4: Check NGINX status
if sudo systemctl is-active --quiet nginx; then
    log "✓ NGINX is now running successfully"
else
    error "NGINX failed to start. Checking logs..."
    sudo journalctl -u nginx --no-pager -l -n 20
fi

# Step 5: Clean up any problematic Let's Encrypt certificates
log "Checking for problematic SSL certificates..."
CERT_DIR="/etc/letsencrypt/live"
if [ -d "$CERT_DIR" ]; then
    # Look for directories with @ symbol (email addresses)
    for dir in "$CERT_DIR"/*@*; do
        if [ -d "$dir" ]; then
            warn "Found problematic certificate directory: $dir"
            sudo rm -rf "$dir"
            log "Removed problematic certificate directory"
        fi
    done
fi

# Step 6: Check if existing app is accessible
log "Checking if your existing applications are accessible..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    log "✓ Web server is responding to requests"
else
    warn "Web server may not be responding properly. Please check your app configurations."
fi

# Step 7: Create a new corrected wellness app configuration
log "Creating corrected wellness app configuration..."

# Ask for the correct domain and email
echo ""
echo "To properly set up the wellness app, please provide:"
read -p "Domain name (e.g., wellness.yourdomain.com): " DOMAIN
read -p "Email address for SSL certificate: " EMAIL

# Validate inputs
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    error "Domain and email are required. You can run this script again later."
    exit 1
fi

# Create corrected NGINX configuration without SSL first
cat << EOF | sudo tee /etc/nginx/sites-available/wellness-app
server {
    listen 80;
    server_name $DOMAIN;
    
    # Document root
    root /var/www/wellness-app;
    index index.html;
    
    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security - deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
EOF

# Test configuration before enabling
if sudo nginx -t; then
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/wellness-app /etc/nginx/sites-enabled/wellness-app
    sudo systemctl reload nginx
    
    log "Wellness app NGINX configuration created (HTTP only for now)"
    log "You can now obtain SSL certificate with:"
    log "sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive"
else
    error "New configuration has errors. Please check manually."
fi

log ""
log "=========================================="
log "           RECOVERY COMPLETE"
log "=========================================="
log ""
log "Status:"
log "✓ NGINX is running"
log "✓ Problematic SSL configuration removed"
log "✓ Wellness app configuration created (HTTP only)"
log ""
log "Next steps:"
log "1. Test your existing app to make sure it's working"
log "2. If wellness app domain is configured in DNS, run:"
log "   sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive"
log "3. Check that both apps work correctly"
log ""
log "If you need help, the broken config is saved as:"
log "/etc/nginx/sites-available/wellness-app.broken"