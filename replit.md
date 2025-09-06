# Overview

A comprehensive wellness platform built with React and Vite that supports mental health through various interactive tools and games. Originally a music quiz app with Spotify integration, it has evolved into a complete mental wellness ecosystem featuring therapeutic activities, crisis support, habit tracking, emotional processing tools, and advanced data analytics. The platform now includes sophisticated features like personalized recommendations, data export capabilities, offline functionality, and comprehensive progress tracking. The application provides a safe, supportive environment for users to engage with evidence-based mental health practices through an intuitive, beautifully designed interface that adapts to individual needs and patterns.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19 with Vite as the build tool for fast development and hot module replacement
- **Styling**: Custom CSS with gradient backgrounds and modern UI components, no external CSS frameworks
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **Icons**: Lucide React for consistent iconography
- **State Management**: React's built-in state management (useState, useEffect)

## Development Setup
- **Build Tool**: Vite configured for React with development server on port 5000
- **Code Quality**: ESLint with React-specific rules and hooks validation
- **Module System**: ES modules with modern JavaScript features

## API Integration
- **Spotify Service**: Custom service class for handling Spotify Web API integration
- **Authentication**: Client credentials flow for accessing Spotify's public data
- **HTTP Client**: Axios for making API requests to external services
- **Token Management**: Automatic token refresh and caching within the SpotifyService class

## Component Structure
- Modular React components for different wellness activities and therapeutic tools
- Separation of concerns with dedicated service layer for API interactions
- Event-driven architecture for user interactions and wellness activity progression
- Local storage integration for persistent user data (mood tracking, journal entries, habit progress)

## Mental Health Features
- **Crisis Support**: Emergency hotlines, immediate coping strategies, safety planning resources
- **Therapeutic Journaling**: Guided writing prompts across 6 categories (gratitude, emotional processing, CBT, mindfulness, growth, relationships)
- **Habit Tracker**: Daily wellness routine tracking with streak counters and progress analytics
- **Mood Tracker**: Daily emotional check-ins with pattern recognition and insights
- **Meditation Timer**: Guided meditation sessions (mindfulness, loving-kindness, body scan, gratitude)
- **Breathing Exercises**: Visual breathing guides for anxiety and stress reduction
- **Progressive Muscle Relaxation**: Guided tension release techniques
- **Sleep Preparation**: Bedtime routine guidance for better sleep hygiene
- **Daily Affirmations**: Positive mindset training and self-confidence building
- **Color Therapy**: Art therapy and creative expression tools
- **Memory Games**: Cognitive training and brain fitness activities
- **Music Quiz**: Mood-lifting cognitive stimulation through music trivia with multiplayer support (1-4 players)
- **Gratitude Practices**: Daily gratitude exercises and positive psychology tools
- **Nature Sounds**: Ambient soundscapes for relaxation and meditation
- **Couples Activities**: Relationship wellness and communication exercises
- **Wellness Dashboard**: Progress tracking and insights across all activities

## Advanced Wellness Features (2025 Enhancement)
- **Personalized Recommendations**: AI-driven activity suggestions based on user patterns, mood trends, and effectiveness data
- **Cross-Component Data Integration**: Comprehensive analysis linking mood patterns with activity effectiveness and user behavior
- **Progressive Onboarding**: Guided wellness pathways for new users with personalized goal setting and experience assessment
- **Enhanced Dashboard**: Today's Focus widget, emergency wellness access, comprehensive statistics, and quick actions
- **Advanced Progress Visualization**: Correlation charts, trend analysis, activity effectiveness metrics, and detailed insights
- **Data Export Tools**: Healthcare provider reports, anonymous research contribution, and personal data backup capabilities
- **Offline Capability**: Service worker implementation for core wellness tools with automatic data synchronization
- **Performance Optimizations**: Lazy loading, virtualized lists, optimized caching, and enhanced loading states

# External Dependencies

## Core Technologies
- **React 19**: Frontend framework for building the user interface
- **Vite**: Modern build tool and development server
- **Axios**: HTTP client for API requests

## UI and Animation
- **Framer Motion**: Animation library for smooth transitions and micro-interactions
- **Lucide React**: Icon library for consistent visual elements

## Development Tools
- **ESLint**: Code linting with React-specific rules
- **Vite React Plugin**: React support and fast refresh capabilities

## External APIs
- **Spotify Web API**: Music data source for tracks, artists, and audio previews
  - Uses client credentials authentication flow
  - Requires VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET environment variables
  - Provides access to track search, artist information, and 30-second audio previews

## Environment Configuration
- Environment variables for Spotify API credentials
- Development server configured for external access (host: '0.0.0.0')
- HTTPS-ready configuration for secure deployment
- Local storage for persistent user data (client-side only)

## Deployment Information

### Ubuntu Server Deployment
A comprehensive installation script (`ubuntu-install.sh`) is provided for production deployment on Ubuntu servers. The script includes:

- **Automated Setup**: Node.js installation, app deployment, and NGINX configuration
- **SSL/TLS Security**: Automatic Let's Encrypt certificate generation and renewal
- **Security Hardening**: Firewall configuration, security headers, and access controls
- **Performance Optimization**: Gzip compression, caching strategies, and asset optimization
- **Monitoring & Maintenance**: Automated backups, log management, and update procedures
- **Environment Management**: Secure environment variable configuration

### Deployment Features
- **Port Configuration**: Designed to work alongside existing applications (avoids port conflicts)
- **Reverse Proxy**: NGINX configuration for serving static assets and handling HTTPS
- **Domain Support**: Custom domain configuration with DNS management
- **Auto-Renewal**: Automatic SSL certificate renewal via cron jobs
- **Backup System**: Daily automated backups with retention management
- **Update Process**: Streamlined update and rollback procedures

### Installation Usage
```bash
./ubuntu-install.sh your-domain.com your-email@example.com
```

The script sets up a production-ready deployment with security best practices, performance optimizations, and automated maintenance tasks.