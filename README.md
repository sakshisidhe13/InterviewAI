# 🤖 InterviewAI

> An AI-powered interview preparation platform that analyzes resumes, conducts mock interviews, and provides AI-generated feedback using Google Gemini.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📌 Overview

InterviewAI is a full-stack AI-powered interview preparation platform designed to help job seekers enhance their resumes and interview skills.

The platform enables users to upload resumes for AI-based analysis, participate in interactive mock interviews, and receive comprehensive performance reports with actionable recommendations.

## ✨ Features

📄 AI Resume Analysis

* Upload resumes in PDF format
* AI-powered resume evaluation using Google Gemini
* ATS compatibility score
* Resume quality score
* Personalized strengths and improvement suggestions
* Missing and overused keyword detection
* Resume score breakdown
* AI-generated interview questions based on resume

🎤 AI Mock Interview

* Interactive AI-driven interview sessions
* Dynamic question generation
* Real-time conversation interface
* Interview transcript generation
* AI evaluation after interview completion
* Communication, Technical, and Confidence scoring
* Overall interview score
* Personalized interview feedback
* Hiring recommendation

📊 Analytics Dashboard

* Resume analysis history
* Interview history
* Detailed performance reports
* Historical scores and evaluations

🔐 Authentication

* Secure JWT Authentication
* HTTP-only cookies
* Protected routes
* User account management

## 🛠 Tech Stack

Frontend

* React.js
* Tailwind CSS
* React Router
* Redux Toolkit
* RTK Query
* Vite

Backend

* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* REST APIs

Database

* PostgreSQL

AI

* Google Gemini AI

Deployment

* Vercel (Frontend)
* Render (Backend)
* Neon PostgreSQL

## 🏗️ Architecture
The backend follows a layered architecture:
- Controllers handle HTTP requests.
- Services contain business logic.
- Prisma manages database access.
- Google Gemini provides AI-powered analysis.
  
```text
React (Frontend)
        │
        ▼
Express REST API
        │
        ▼
Service Layer
        │
   ┌────┴────┐
   ▼         ▼
Gemini AI  Prisma ORM
               │
               ▼
          PostgreSQL
```

 ## 📂 Project Structure

```text
InterviewAI/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── prisma/
│   ├── lib/
│   └── utils/
│
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sakshisidhe13/InterviewAI.git
cd InterviewAI
```

---

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
DATABASE_URL=

JWT_SECRET=

GEMINI_API_KEY=

CLIENT_URL=

PORT=5000
```

Create a `.env` file inside the **frontend** folder.

```env
VITE_API_URL=
```

---

### 4. Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

---

### 5. Start the Application

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

## ✨ Highlights

- RESTful API architecture
- Service Layer pattern
- JWT Authentication
- Prisma ORM
- PostgreSQL
- AI integration using Google Gemini
- Responsive React UI

## 🚀 Future Improvements

- Voice-based mock interviews
- AI follow-up questions
- Company-specific interview preparation
- Resume version comparison
- Interview analytics dashboard
- PDF report generation

## 📄 License

This project is licensed under the MIT License.

## 👩‍💻 Author
GitHub: https://github.com/sakshisidhe13
