
# PowerFolio 🚀


PowerFolio is a dynamic, AI-powered platform designed for students to build professional portfolios, showcase their innovative projects, and connect with recruiters.

---

## 🎥 Project Overview

PowerFolio bridges the gap between student creativity and professional visibility. It allows users to submit detailed project documentation, enhance their descriptions using AI, and manage their portfolio through a sleek dashboard.

---

## 🔑 Key Features

### 🤖 AI-Powered Enhancements
- Integrated with **Google Gemini AI** to automatically rewrite project descriptions and generate impactful outcome statements.

### 🖼️ File Uploads
- Upload up to **4 project screenshots** and **20MB demo videos** directly to **ImageKit** for optimized delivery.

### 📊 Dynamic Analytics
#### User Dashboard:
- Track project views, likes, and approval status.

#### Admin Dashboard:
- View submission trends (Last 10 Days)
- Project type breakdown
- Manage users

### 🔐 Secure Authentication
- Full **JWT-based authentication**
- Role-based access control (**Student vs Admin**)

### 📱 Fully Responsive UI
- Modern **glassmorphism-inspired** design using Tailwind CSS.

### ⚡ Optimistic UI
- Instant “Like”, “Delete”, and other actions for a smooth UX.

---

## 🛠️ Tech Stack

| Category     | Technology |
|--------------|------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide React, React Toastify, React Router DOM |
| **Backend**  | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **AI**       | Google Gemini API (`@google/generative-ai`) |
| **Storage**  | ImageKit.io |
| **Auth**     | JWT, bcryptjs |

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16+)
- MongoDB Atlas
- ImageKit Account
- Google AI Studio API Key (Gemini)

---

## 1. Clone the Repository

```bash
git clone https://github.com/ajith-kumar99/PowerFolio-v2.git
cd powerfolio
````

---

## 2. Backend Setup (server)

Navigate to backend:

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_key"
CLIENT_URL="http://localhost:5173"

# ImageKit Credentials
IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"
```

Run backend:

```bash
npm run dev
```

---

## 3. Frontend Setup (client)

Navigate to client:

```bash
cd client
npm install
```

Create `.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

## 🛡️ Admin Access

The system includes a hidden **Admin Dashboard**.

**Login URL:**

```
http://localhost:5173/admin-login
```

**Default Credentials:**

```
Email: admin@gmail.com
Password: admin@123
```

> The backend auto-creates the admin on first login if it doesn't exist.

---

## 📁 Project Structure

```
powerfolio/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Navbar, ProjectCard, Stats
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Home, Dashboard, SubmitProject
│   │   └── App.jsx         
│   └── ...
│
├── server/                 # Node.js Backend
│   ├── config/             # Database connection
│   ├── controllers/        # Auth, Projects, Admin, AI
│   ├── middleware/         # Auth & file uploads
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API routes
│   └── server.js           
│
└── README.md
```

---

## ✨ Future Improvements

* Comment system for peer feedback
*  Social sharing (LinkedIn, Twitter)
*  Dark/Light mode toggle

