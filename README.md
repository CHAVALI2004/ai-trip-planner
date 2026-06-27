# AI Trip Planner 🌍✈️

An intelligent, full-stack travel planning application that automatically generates customized, multi-day itineraries using advanced AI models based on user destination, budget, duration, and personal preferences. The application features integrated live weather forecasts and dynamic destination imagery.

## 🚀 Live Demo
* https://ai-trip-planner-nnpm.vercel.app/

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React.js, React Router
* **Styling:** CSS3 (Mobile-First, Fully Responsive Layout)
* **State Management:** React Component State & Props
* **HTTP Client:** Fetch API

### Backend (Server)
* **Runtime Environment:** Node.js
* **Web Framework:** Express.js
* **Database:** SQLite3 (Persistent local relational storage)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt hashing

### Third-Party APIs & Integrations
* **AI Generation:** OpenRouter API (`google/gemini-2.5-flash`)
* **Images:** Pexels API (Dynamic location-based visuals)

---

## ✨ Features

* **AI-Generated Itineraries:** Custom day-by-day schedules tailored to user parameters via Gemini 2.5 Flash.
* **Secure Authentication:** User signup and login functionality backed by JWT authentication safeguards.
* **Dynamic Media:** Fetches contextually matching high-quality imagery of target destinations automatically.
* **Environment Security:** Total protection of sensitive third-party API credentials utilizing isolated configuration practices.

---
