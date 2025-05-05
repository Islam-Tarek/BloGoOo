# BloGoOo - Blogging Platform

A modern full-stack blogging platform for sharing, discovering, and managing blogs with a beautiful UI and robust features.

<!-- Table of Contents -->

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack & Tools](#-tech-stack--tools)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Demo](#-demo)
- [Usage](#-usage)
- [Brand](#brand)

## 🚀 Features

- **User Authentication**

  - Register with email, username, and password
  - Secure login with JWT-based authentication
  - Password change functionality

- **Profile Management**

  - View and edit personal profile (username, email, bio, profile picture)
  - Upload profile pictures via ImgBB integration

- **Blog Management**

  - Create new blogs with title, content, and image (upload or URL)
  - Edit and delete your own blogs
  - Hide blogs from your feed (for non-authors)
  - View all blogs or filter/search by title, content, or author

- **Community Features**

  - View other users' profiles and their blogs
  - Responsive and modern UI with Tailwind CSS and DaisyUI
  - Toast notifications for all major actions

- **Search**

  - Real-time search across blog titles, captions, and usernames

- **Protected Routes**
  - Only authenticated users can access certain pages (profile, write, edit, etc.)

## 🛠️ Tech Stack & Tools

**Frontend:**

- React 19 - React Router v7 - Tailwind CSS - DaisyUI - React Hook Form - Zod - Axios - React Toastify - js-cookie

**Backend:**

- JSON Server - JSON Server Auth - CORS - dotenv

**Other Tools:**

- ImgBB API - bcryptjs

## 📦 Project Structure

```
react-project/
├── Backend/
│   ├── db.json
│   ├── package.json
│   └── server.js
├── Frontend/
│   └── blog-project/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
├── README.md
└── ...
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Backend Setup

1. **Install dependencies:**

   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment variables:**

   - Create a `.env` file in `Backend/` (optional, for custom port):
     ```
     PORT=3000
     ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run at `http://localhost:3000` by default.

### Frontend Setup

1. **Install dependencies:**

   ```bash
   cd Frontend/blog-project
   npm install
   ```

2. **Configure environment variables:**

   - Edit `.env` in `Frontend/blog-project/` to set the backend URL and ImgBB API key:
     ```
     VITE_HOST=http://localhost:3000
     VITE_IMGBB_API_KEY=your_imgbb_api_key
     ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173` by default.

## 🌐 Demo

[Live Demo](https://drive.google.com/file/d/1tNLOW1DQa98GY3rh-Td2mM0tjhQ6mJit/view?usp=drive_link) <!-- Replace with your actual demo link -->

## 📝 Usage

- Register a new account or log in with existing credentials.
- Create, edit, or delete your blogs.
- Edit your profile and upload a profile picture.
- Search for blogs or users using the search bar.
- Visit other users' profiles and read their blogs.

---

## Brand

<!-- Brand styling using HTML for color -->
<p align="center" style="font-size:2rem; font-weight:bold;">
  <span style="color:#ec4899;">B</span>
  <span style="color:#6366f1;">l</span>
  <span style="color:#facc15;">o</span>
  <span style="color:#22c55e;">G</span>
  <span style="color:#f97316;">o</span>
  <span style="color:#38bdf8;">O</span>
  <span style="color:#3b82f6;">o</span>
</p>

<p align="center"><b>Happy Blogging!</b></p>
