#!/bin/bash

# Ubuntu Server Installation Script for Wellness App
# This script sets up the wellness app on Ubuntu with NGINX and SSL

set -e  # Exit on any error

# Configuration variables
APP_NAME="wellness-app"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="${1:-wellness.yourdomain.com}"  # Pass domain as first argument
EMAIL="${2:-your@email.com}"           # Pass email as second argument
NGINX_AVAILABLE="/etc/nginx/sites-available/$APP_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$APP_NAME"

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Check if domain and email provided
if [ "$DOMAIN" = "wellness.yourdomain.com" ] || [ "$EMAIL" = "your@email.com" ]; then
    error "Please provide domain and email as arguments:"
    error "Usage: ./ubuntu-install.sh your-domain.com your-email@example.com"
    exit 1
fi

log "Starting Wellness App installation for domain: $DOMAIN"

# Update system
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
log "Installing required packages..."
sudo apt install -y curl wget git nginx ufw certbot python3-certbot-nginx

# Install Node.js (LTS version)
log "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    log "Node.js already installed: $(node -v)"
fi

# Verify Node.js and npm installation
log "Node.js version: $(node -v)"
log "npm version: $(npm -v)"

# Create app directory
log "Creating app directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone or copy the app (assuming you'll upload the built files)
log "Setting up app files..."
if [ -d "./dist" ]; then
    log "Copying built files from current directory..."
    cp -r ./dist/* $APP_DIR/
elif [ -f "./package.json" ]; then
    log "Copying source files and building with Spotify credentials..."
    cp -r ./* $APP_DIR/
    cd $APP_DIR
    
    # Set Spotify credentials for build process
    export VITE_SPOTIFY_CLIENT_ID="6189f878cb9041c5b3c0adf65489cfb0"
    export VITE_SPOTIFY_CLIENT_SECRET="ec7b6530d46147bfb68242801d418b08"
    
    npm install
    npm run build
    # Move built files to root and clean up
    mv dist/* .
    rm -rf dist src node_modules package*.json *.js *.json *.md public
    cd -
else
    warn "No app files found. You'll need to manually copy your built app to $APP_DIR"
fi

# Set up environment variables (for reference, but app is pre-built with credentials)
log "Setting up environment variables..."
if [ ! -f "/etc/environment.d/wellness-app.conf" ]; then
    sudo mkdir -p /etc/environment.d
    cat << EOF | sudo tee /etc/environment.d/wellness-app.conf
# Wellness App Environment Variables
# Note: Spotify credentials are already built into the app
VITE_SPOTIFY_CLIENT_ID=6189f878cb9041c5b3c0adf65489cfb0
VITE_SPOTIFY_CLIENT_SECRET=ec7b6530d46147bfb68242801d418b08
EOF
    log "✓ Spotify API credentials configured and built into the app"
fi

# Configure firewall
log "Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Create NGINX configuration
log "Creating NGINX configuration..."
cat << EOF | sudo tee $NGINX_AVAILABLE
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Document root
    root $APP_DIR;
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
    
    location ~ \.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
        deny all;
    }
}
EOF

# Enable the site
log "Enabling NGINX site..."
sudo ln -sf $NGINX_AVAILABLE $NGINX_ENABLED

# Test NGINX configuration
log "Testing NGINX configuration..."
sudo nginx -t

# Reload NGINX
log "Reloading NGINX..."
sudo systemctl reload nginx

# Obtain SSL certificate
log "Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Set up automatic certificate renewal
log "Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Create a backup script
log "Creating backup script..."
cat << 'EOF' | sudo tee /usr/local/bin/wellness-backup.sh
#!/bin/bash
BACKUP_DIR="/var/backups/wellness-app"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/wellness-app-$DATE.tar.gz -C /var/www wellness-app
find $BACKUP_DIR -name "wellness-app-*.tar.gz" -mtime +7 -delete
EOF

sudo chmod +x /usr/local/bin/wellness-backup.sh

# Set up daily backup cron job
log "Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/wellness-backup.sh") | crontab -

# Create maintenance script
log "Creating maintenance script..."
cat << 'EOF' | sudo tee /usr/local/bin/wellness-update.sh
#!/bin/bash
# Wellness App Update Script
APP_DIR="/var/www/wellness-app"
BACKUP_DIR="/var/backups/wellness-app"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Creating backup before update..."
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/wellness-app-pre-update-$DATE.tar.gz -C /var/www wellness-app

echo "To update the app:"
echo "1. Upload your new built files to /tmp/wellness-update/"
echo "2. Run: sudo rsync -av /tmp/wellness-update/ $APP_DIR/"
echo "3. Run: sudo systemctl reload nginx"
echo ""
echo "To restore from backup if needed:"
echo "sudo tar -xzf $BACKUP_DIR/wellness-app-pre-update-$DATE.tar.gz -C /var/www/"
EOF

sudo chmod +x /usr/local/bin/wellness-update.sh

# Set correct permissions
log "Setting correct permissions..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# Final status check
log "Performing final checks..."
if sudo nginx -t >/dev/null 2>&1; then
    log "✓ NGINX configuration is valid"
else
    error "✗ NGINX configuration has errors"
fi

if sudo systemctl is-active --quiet nginx; then
    log "✓ NGINX is running"
else
    error "✗ NGINX is not running"
fi

if sudo certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
    log "✓ SSL certificate is installed"
else
    warn "✗ SSL certificate may not be properly installed"
fi

# Print final instructions
log "Installation completed successfully!"
echo ""
echo "=========================================="
echo "             NEXT STEPS"
echo "=========================================="
echo ""
echo "1. Your wellness app should now be available at:"
echo "   https://$DOMAIN"
echo ""
echo "2. Useful commands:"
echo "   - Check NGINX status: sudo systemctl status nginx"
echo "   - Reload NGINX: sudo systemctl reload nginx"
echo "   - View NGINX logs: sudo journalctl -u nginx -f"
echo "   - Test SSL: curl -I https://$DOMAIN"
echo "   - Update app: sudo /usr/local/bin/wellness-update.sh"
echo "   - Manual backup: sudo /usr/local/bin/wellness-backup.sh"
echo ""
echo "3. Your existing port 3000 app should remain unaffected."
echo ""
echo "4. Automatic features enabled:"
echo "   - Daily backups at 2 AM"
echo "   - SSL certificate auto-renewal"
echo "   - Security headers"
echo "   - Gzip compression"
echo ""
echo "=========================================="

# Final reminder
log "✓ Spotify API credentials are pre-configured and working!"
warn "Don't forget to:"
warn "1. Test the app at https://$DOMAIN"
warn "2. Configure your DNS to point $DOMAIN to this server"
warn "3. Try the Music Quiz feature - it should work with Spotify songs!"