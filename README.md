# Music Library Application

## Student Information

**Name:** Sunil Kumar

**Capstone Project Presentation – 12th June 2026:** 

**Project:** Music Library Application

---

# Project Overview

Music Library Application is a MERN-based platform that allows users to:

* Browse and search songs
* Create and manage playlists
* Add songs to playlists
* Play and organize music collections
* Receive notifications for new songs

The project supports two roles:

### User

* Register/Login
* Browse Songs
* Search Songs
* Create Multiple Playlists
* Manage Playlist Songs
* Play, Repeat, Shuffle Songs

### Admin

* Login
* Manage Songs (CRUD)
* Control Song Visibility
* Send Notifications

---

# Technology Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js
* Jest

## Frontend

* React.js
* Axios
* Bootstrap / Material UI
* React Router

---

# Project Structure

## Backend

backend/

├── config
│   └── db.js
│
├── controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── notificationController.js
│   ├── playlistController.js
│   └── songController.js
│
├── middleware
│   ├── adminMiddleware.js
│   └── authMiddleware.js
│
├── models
│   ├── User.js
│   ├── Song.js
│   ├── Playlist.js
│   └── Notification.js
│
├── routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── notificationRoutes.js
│   ├── playlistRoutes.js
│   └── songRoutes.js
│
├── services
│   ├── adminService.js
│   ├── authService.js
│   ├── notificationService.js
│   ├── playlistService.js
│   ├── songService.js
│   └── userService.js
│
├── test
│
├── app.js
├── server.js
└── .env

---

## Frontend

frontend/

├── src
│
├── components
│   └── common
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       └── SidebarSongs.jsx
│
├── pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── Songs.jsx
│   ├── MusicPlayer.jsx
│   ├── Playlists.jsx
│   ├── ManageSongs.jsx
│   ├── Profile.jsx
│   └── SearchBar.jsx
│
├── routes
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│
├── services
│   └── api.js
│
├── style
    ├── AdminDashboard.css
    ├── ManageSongs.css
    ├── Playlists.css
    └── Songs.css

---

# Setup Instructions

## Backend Setup

### Install Dependencies

```bash
npm install
```

### Run Backend

```bash
npm run dev
```

Expected Output

```bash
MongoDB Connected
Server running on port 5000
```

---

# Frontend Setup

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend URL

```text
http://localhost:5173
```

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Songs

### Get All Songs

```http
GET /api/songs
```

### Add Song (Admin)

```http
POST /api/songs
```

### Update Song

```http
PUT /api/songs/:id
```

### Delete Song

```http
DELETE /api/songs/:id
```

---

## Playlists

### Create Playlist

```http
POST /api/playlists
```

### Get User Playlists

```http
GET /api/playlists
```

### Add Song To Playlist

```http
POST /api/playlists/:id/songs
```

---

# Database Collections

## User

* name
* email
* phone
* password
* role

## Song

* songName
* singer
* albumName
* musicDirector
* songUrl
* image
* visibility

## Playlist

* name
* userId
* songs[]

## Notification

* title
* message
* songId
* createdBy

---

# Security Features

* JWT Authentication
* Password Encryption (bcrypt)
* Protected Routes
* Role-Based Access Control
* Session Management using Local Storage

---

# Features Implemented

## User Features

* Registration & Login
* Song Browsing
* Song Search
* Playlist Management
* Add Songs to Playlist
* Music Controls (Play, Repeat, Shuffle)

## Admin Features

* Song CRUD Operations
* Visibility Control
* Notification Management
* Content Administration

---

# Testing

Run Tests

```bash
npm test
```

Test Cases

* User Registration
* User Login
* Song CRUD
* Playlist CRUD
* Authentication Validation
* Protected Route Testing

---

# Sample Data

## Songs

Song 1 – Shape of You

Song 2 – Believer

Song 3 – Perfect

Song 4 – Blinding Lights

---

# Screenshots

## Backend

1. User Registration API
2. Login API
3. Song CRUD API
4. Playlist API
5. Notification API

## Frontend

1. Login Page
2. Registration Page
3. Song Library
4. Playlist Management
5. Admin Dashboard
6. Notification Screen

---

# Conclusion

The Music Library Application successfully implements a complete MERN Stack solution with secure authentication, song management, playlist functionality, notification services, and role-based access control. The system provides a responsive, scalable, and user-friendly platform for both music listeners and administrators.
