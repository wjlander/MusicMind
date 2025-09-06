#!/bin/bash

# Deployment script for Wellness App
# This script builds the project and deploys it to /var/www/wellness-app

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_DIR="$(pwd)"
TARGET_DIR="/var/www/wellness-app"
BACKUP_DIR="/var/backups/wellness-app-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}📁 Source directory: ${SOURCE_DIR}${NC}"
echo -e "${BLUE}📁 Target directory: ${TARGET_DIR}${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project directory.${NC}"
    exit 1
fi

# Check if target directory exists, create if not
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}📁 Creating target directory: $TARGET_DIR${NC}"
    sudo mkdir -p "$TARGET_DIR"
fi

# Backup existing deployment if it exists
if [ -d "$TARGET_DIR" ] && [ "$(ls -A $TARGET_DIR)" ]; then
    echo -e "${YELLOW}💾 Backing up existing deployment...${NC}"
    sudo mkdir -p "$(dirname "$BACKUP_DIR")"
    sudo cp -r "$TARGET_DIR" "$BACKUP_DIR"
    echo -e "${GREEN}✅ Backup created at: $BACKUP_DIR${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: Build failed - dist directory not found${NC}"
    exit 1
fi

# Stop any running services (optional - uncomment if using systemd service)
# echo -e "${YELLOW}⏸️  Stopping wellness-app service...${NC}"
# sudo systemctl stop wellness-app || true

# Clear target directory
echo -e "${YELLOW}🧹 Clearing target directory...${NC}"
sudo rm -rf "$TARGET_DIR"/*

# Copy built files to target directory
echo -e "${BLUE}📋 Copying files to target directory...${NC}"
sudo cp -r dist/* "$TARGET_DIR/"

# Copy additional files if they exist
if [ -f ".htaccess" ]; then
    sudo cp .htaccess "$TARGET_DIR/"
fi

# Set proper ownership and permissions
echo -e "${BLUE}🔐 Setting permissions...${NC}"
sudo chown -R www-data:www-data "$TARGET_DIR"
sudo find "$TARGET_DIR" -type d -exec chmod 755 {} \;
sudo find "$TARGET_DIR" -type f -exec chmod 644 {} \;

# Restart services (optional - uncomment if using systemd service)
# echo -e "${BLUE}🔄 Restarting wellness-app service...${NC}"
# sudo systemctl start wellness-app

# If using nginx, reload configuration
if command -v nginx &> /dev/null; then
    echo -e "${BLUE}🔄 Reloading nginx...${NC}"
    sudo nginx -t && sudo systemctl reload nginx
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📍 App deployed to: $TARGET_DIR${NC}"
echo -e "${GREEN}💾 Backup available at: $BACKUP_DIR${NC}"

# Display some useful information
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "Source: ${SOURCE_DIR}"
echo -e "Target: ${TARGET_DIR}"
echo -e "Backup: ${BACKUP_DIR}"
echo -e "Files deployed: $(find $TARGET_DIR -type f | wc -l)"
echo -e "Total size: $(du -sh $TARGET_DIR | cut -f1)"

echo ""
echo -e "${GREEN}✅ Deployment complete! Your wellness app is now live.${NC}"