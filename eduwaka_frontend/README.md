**Frontend README (React + TypeScript + Tailwind + Vite)**

This is the **frontend client** for EduWaka – a platform helping Nigerian students with university admissions.
The frontend is built with **React, TypeScript, TailwindCSS and Vite**.

---
**Live Link**: [https://eduwaka-ai-assistant.onrender.com/](https://eduwaka-ai-assistant.onrender.com/)

## 🚀 Tech Stack

- **React + TypeScript**
- **Vite (for bundling)**
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Fetch** for API calls
- **JWT-based auth** (protected routes)

---

## 📂 Project Structure

```

frontend/
│── src/
│ │── assets/ # Images, icons
│ │── components/ # Shared UI components
│ │── pages/ # Page-level views
│ │── hooks/ # Custom hooks
│ │── context/ # Auth & global state
│ │── services/ # API calls
│ │── App.tsx
│── index.html
│── vite.config.ts
│── tsconfig.json

```

---

## ⚙️ Setup Instructions

1. Clone repo:

   ```bash
   git clone https://github.com/your-username/eduwaka-frontend.git
   cd eduwaka-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run dev server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

---

## 🔑 Features

- User authentication (Signup/Login/Logout)
- Protected routes (`/dashboard`, `/profile`)
- Institution & course search
- Eligibility checker
- Chatbot interface
- FAQ page
- Responsive UI with Tailwind

---

## 🔗 API Integration

Frontend consumes the backend APIs hosted at:

```
http://127.0.0.1:8000/api/
```
