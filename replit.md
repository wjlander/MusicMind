# Overview

A song quiz application built with React and Vite that integrates with the Spotify API to create music-based trivia games. The application allows users to play interactive quizzes featuring song previews, artist information, and multiple-choice questions. The frontend is styled with modern CSS animations using Framer Motion and provides a responsive, visually appealing interface with gradient backgrounds and smooth transitions.

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
- Modular React components for different quiz states and UI elements
- Separation of concerns with dedicated service layer for API interactions
- Event-driven architecture for user interactions and quiz progression

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