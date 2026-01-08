<p align="center">
  <img src="./FIXVERSITY.png" alt="FixVersity Logo" width="300"/>
</p>

<h1 align="center">FIXVERSITY</h1>
<p align="center"><strong>Campus Issue Reporting & Maintenance Management Platform</strong></p>
<p align="center">Campus Problems, Fixed Fast</p>

---

## Overview

FixVersity is a centralized digital platform designed to modernize campus maintenance and administrative issue reporting.  
It enables students and faculty to report issues easily, while administrators track, assign, and resolve them efficiently through a role-based system.

Traditional manual complaint processes often lead to delays, poor tracking, and lack of accountability.  
FixVersity replaces these workflows with real-time tracking, transparency, and smart coordination.

---

## Problem Statement

Manual workflows delay resolution and weaken transparency across campus operations.

---

## Objective

To develop an application that enables campus users to report maintenance and administrative issues and allows authorized administrators to track, manage, and resolve those issues efficiently.

---

## Core Features

### Authentication and Roles
- Secure email and password authentication
- Role-based access for:
  - Student
  - Faculty
  - Worker
  - Administrator

### Issue Reporting
- Report issues with title and description
- Optional image upload
- Automatic issue status assignment

### Issue Tracking
- Real-time status updates:
  - Open
  - In Progress
  - Resolved
- Transparent progress visibility

### Admin Control Panel
- View all reported issues
- Assign workers based on expertise and performance
- Update issue status
- Monitor resolution progress

### Worker Rating System
- Users rate workers after issue resolution
- Ratings influence future worker assignments

### Cross-Platform Support
- Android APK
- iOS Progressive Web App (PWA)
- Web browser support

---

## System Workflow

1. Student or Faculty logs in
2. Issue is submitted with required details
3. Administrator reviews the issue
4. Worker is assigned
5. Worker updates progress
6. Administrator marks issue as resolved
7. User submits feedback and rating

---

## System Architecture

- Layered and scalable architecture
- Secure authentication and role-based access control
- Centralized issue management service
- Worker assignment and rating engine
- Image storage support
- Continuous backend health monitoring

---

## Tech Stack

### Frontend
- React.js
- HTML5, CSS3, JavaScript
- Responsive design

### Backend and Database
- Supabase
  - Authentication (Email & Password)
  - PostgreSQL Database
  - Role-Based Access Control (RLS)

### Mobile Platforms
- Android APK (WebView wrapper)
- iOS PWA (Progressive Web App)

### Deployment
- Cloudflare Pages
  - Global CDN
  - Automatic deployments
  - HTTPS by default

### Tools
- Git and GitHub
- Figma (UI/UX Design)
- Postman (API Testing)

---

## iOS Availability Note

Due to Apple platform restrictions, the native iOS app build is limited to team members via TestFlight or developer mode.  
Full functionality is available for iOS users through the Progressive Web App.

---

## Installation and Usage

### Web
Access the deployed Cloudflare URL using any modern browser.

### Android
Download the APK, enable installation from unknown sources, and install the app.

### iOS
Open the website in Safari and add it to the home screen to use it as a Progressive Web App.

---

## Hackathon Readiness

- Fully functional MVP
- Real-world campus problem focus
- Scalable and secure architecture
- Cross-platform deployment
- Live demo ready

---

## Team

**Team Name:** 404 Found

- Subhajit Pathak  
- Ujjal Roy  
- Ritesh Samanta  

---

## License

This project is developed for educational and hackathon purposes.

---

## Acknowledgements

RKMMVERI Tech Fest – Perceptron ’26  
Open-source tools and platforms used in development
