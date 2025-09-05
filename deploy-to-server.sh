#!/bin/bash

# Deploy Wellness App to Ubuntu Server
# This script helps you copy the built app to your server

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Wellness App Deployment Helper${NC}"
echo "======================================="
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}Building the app first...${NC}"
    npm run build
fi

echo "Built app files are ready in the 'dist' folder."
echo ""
echo "To deploy to your Ubuntu server:"
echo ""
echo "1. Copy all files from the 'dist' folder to your server:"
echo "   scp -r dist/* user@your-server:/var/www/wellness-app/"
echo ""
echo "2. OR use rsync for better synchronization:"
echo "   rsync -avz --delete dist/ user@your-server:/var/www/wellness-app/"
echo ""
echo "3. Make sure permissions are correct on your server:"
echo "   sudo chown -R www-data:www-data /var/www/wellness-app"
echo "   sudo chmod -R 755 /var/www/wellness-app"
echo ""
echo "4. Test your wellness app - the Spotify music quiz should now work!"
echo ""
echo "Alternative: Manual copy method:"
echo "===============================
echo "1. Download the 'dist' folder from this Replit"
echo "2. Extract it on your local computer"
echo "3. Upload the contents to /var/www/wellness-app/ on your server"
echo ""
echo "The app includes working Spotify API credentials and all the mental health features."