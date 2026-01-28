# Shaka Bank - Modern Banking Application

A full-featured banking application built with the MERN stack (MongoDB, Express.js, React, Node.js) that implements secure banking operations with modern web technologies.

## 🚀 Live Demo
[Insert Live Demo Link Here]

## 📱 Screenshots

| Splash Screen | Login Screen | Dashboard |
|--------------|--------------|-----------|
| ![Splash](screenshots/splash.png) | ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

| Account Details | Fund Transfer | Bills Payment |
|-----------------|---------------|---------------|
| ![Account](screenshots/account.png) | ![Transfer](screenshots/transfer.png) | ![Bills](screenshots/bills.png) |

| Profile | Mobile View |
|---------|-------------|
| ![Profile](screenshots/profile.png) | ![Mobile](screenshots/mobile.png) |

## ✨ Features

### 🔒 Security Features
- **Multi-Factor Authentication** (SMS via Twilio)
- **JWT-based Authentication** with refresh tokens
- **Encrypted Password Storage** using bcrypt
- **Session Management** with device tracking
- **Rate Limiting** on sensitive endpoints
- **CORS Protection** and security headers
- **Input Validation** and sanitization

### 💳 Banking Features
- **Account Management** (Create, View, Freeze accounts)
- **Fund Transfers** (Within bank, Interbank, International)
- **Bill Payments** with auto-pay scheduling
- **Transaction History** with filtering and export
- **Account Statements** (PDF download)
- **Beneficiary Management** for quick transfers
- **Real-time Balance Updates**

### 📊 Dashboard Features
- **Financial Overview** with charts and graphs
- **Spending Analytics** by category
- **Balance History** visualization
- **Quick Action** widgets
- **Recent Transactions** feed
- **Account Summary** cards

### 👤 User Features
- **Profile Management** with photo upload
- **Notification Settings** (Email, SMS, Push)
- **Device Management** (View/revoke sessions)
- **Security Preferences** (2FA, password change)
- **Contact Information** management
- **Account Deletion** with confirmation

## 🏗️ Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router v6** for navigation
- **React Bootstrap** for UI components
- **Chart.js** for data visualization
- **React Hook Form** for form handling
- **Axios** for API requests
- **Framer Motion** for animations
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Twilio** for SMS services
- **Stripe** for payment processing (ready for integration)
- **Socket.io** for real-time features
- **Winston** for logging

### DevOps
- **Docker** containerization
- **NGINX** reverse proxy
- **PM2** process management
- **GitHub Actions** for CI/CD
- **AWS/Heroku** deployment ready

## 📁 Project Structure
