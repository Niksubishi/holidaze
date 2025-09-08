# 🏨 Holidaze

A modern accommodation booking platform built with React, featuring venue browsing, booking management, and venue administration capabilities.

**Developer:** Nik Bishop  
**Project:** FED2 Exam Project  
**Institution:** Noroff School of Technology and Digital Media

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Stories](#user-stories)
- [API Integration](#api-integration)
- [Design & Accessibility](#design--accessibility)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Holidaze is a comprehensive accommodation booking platform that serves both customers looking for vacation rentals and venue managers who want to list their properties. The application provides a seamless user experience with modern UI/UX design, responsive layouts, and robust functionality.

### Key Highlights

- **Dual User Roles**: Supports both customers and venue managers with role-based access control
- **Modern Architecture**: Built with React 19+ using modern hooks and context patterns
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Interactive Maps**: Integrated with Leaflet for venue location display
- **Performance Optimized**: Image optimization, lazy loading, and skeleton loading states
- **Accessible**: WCAG compliant with proper semantic HTML and keyboard navigation
- **Dark/Light Theme**: User-controlled theme switching with persistent preferences

## ✨ Features

### For All Users
- 🏠 **Venue Browsing**: Browse and search through available accommodations
- 🔍 **Advanced Search**: Filter venues by location, amenities, and availability
- 📅 **Availability Calendar**: View booking status and available dates
- 🗺️ **Interactive Maps**: Explore venue locations with map integration
- 👤 **Public Profiles**: View other users' public profiles and their venues
- 🌓 **Theme Toggle**: Switch between light and dark modes

### For Customers
- 🔐 **Account Management**: Register, login, and manage profile
- 📝 **Booking System**: Create and manage venue reservations
- 📊 **Booking History**: View past and upcoming bookings
- 👨‍💼 **Profile Customization**: Update avatar and personal information

### For Venue Managers
- 🏢 **Venue Management**: Create, edit, and delete venue listings
- 📈 **Booking Oversight**: Monitor bookings for managed venues
- 🖼️ **Media Management**: Upload and manage venue images
- ⚙️ **Venue Settings**: Configure amenities, pricing, and availability

## 🛠 Technology Stack

### Frontend
- **React** 19.1.1 - Component-based UI framework
- **React Router DOM** 7.8.2 - Client-side routing
- **Tailwind CSS** 4.1.12 - Utility-first CSS framework
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 5.0.0 - React components for Leaflet

### Development Tools
- **Vite** 7.1.2 - Build tool and development server
- **ESLint** 9.33.0 - Code linting and formatting
- **PostCSS** 8.5.6 - CSS processing
- **Autoprefixer** 10.4.21 - CSS vendor prefixing

### Architecture Patterns
- **Context API** - State management for auth, theme, loading, and toast notifications
- **Custom Hooks** - Reusable logic for API calls, form validation, and UI patterns
- **Component Composition** - Modular and reusable component design
- **Protected Routes** - Role-based access control

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/niksubishi/holidaze.git
   cd holidaze
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── api/                    # API service modules
│   ├── auth.js            # Authentication API calls
│   ├── bookings.js        # Booking-related API calls
│   ├── config.js          # API configuration
│   ├── profiles.js        # Profile management API calls
│   └── venues.js          # Venue-related API calls
├── components/            # Reusable UI components
│   ├── Auth/              # Authentication components
│   ├── Layout/            # Layout components (Header, Footer, etc.)
│   ├── Profile/           # Profile-related components
│   ├── UI/                # Generic UI components
│   └── Venues/            # Venue-specific components
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state management
│   ├── LoadingContext.jsx # Loading state management
│   ├── ThemeContext.jsx   # Theme management
│   └── ToastContext.jsx   # Toast notification management
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── utils/                 # Utility functions
└── assets/               # Static assets
```

## 👥 User Stories

### ✅ Completed User Stories

**All Users**
- [x] View a list of venues with pagination and filtering
- [x] Search for specific venues by name and location
- [x] View detailed venue pages with images, amenities, and pricing
- [x] Register as either a Customer or Venue Manager
- [x] View calendar with available and booked dates

**Customers**
- [x] Create an account and log in/out securely
- [x] Create bookings for available venues
- [x] View and manage upcoming bookings
- [x] Update profile picture and personal information

**Venue Managers**
- [x] Create an account with venue management capabilities
- [x] Create, edit, and delete venue listings
- [x] Upload multiple images for venues
- [x] View bookings for managed venues
- [x] Update venue details and pricing

## 🔌 API Integration

The application integrates with the official Holidaze API, providing:

- **Authentication**: JWT-based authentication with secure token management
- **Venue Management**: Full CRUD operations for venue listings
- **Booking System**: Complete booking lifecycle management
- **Profile Management**: User profile and avatar management
- **Media Upload**: Image upload for venues and profiles

### API Configuration

The API base URL and endpoints are configured in `src/api/config.js`, with environment-specific settings for development and production.

## 🎨 Design & Accessibility

### Design Principles
- **Mobile-First**: Responsive design that works seamlessly across all devices
- **Clean UI**: Minimalist interface with intuitive navigation
- **Consistent Branding**: Cohesive color scheme and typography
- **Performance**: Optimized images and lazy loading for fast page loads

### Accessibility Features
- **WCAG Compliance**: Follows Web Content Accessibility Guidelines
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios for text readability
- **Focus Management**: Clear focus indicators and logical tab order

### Theme Support
- **Dark/Light Mode**: User-controlled theme switching
- **Persistent Preferences**: Theme selection saved in local storage
- **System Preference Detection**: Automatic theme based on system settings

## 🚀 Deployment

The application is deployed using modern static hosting services:

- **Build Process**: Optimized production build with Vite
- **Environment Variables**: Secure handling of API keys and configuration
- **CDN Integration**: Fast content delivery through hosting provider CDNs
- **Continuous Deployment**: Automated deployment on code changes

### Deployment Platforms
- Netlify

## 🤝 Contributing

While this is primarily an academic project, contributions and feedback are welcome.

## 📞 Contact

**Nik Bishop**
- GitHub: [@niksubishi](https://github.com/niksubishi)
- Email: nikbishopdesign@gmail.com

## 📄 License

This project is part of the Noroff FED2 Exam and is for educational purposes.

---

*Built with ❤️ for the Noroff FED2 Exam Project*
