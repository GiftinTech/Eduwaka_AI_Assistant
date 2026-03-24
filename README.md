# **Fullstack README (Backend + Frontend)**

EduWaka is an **AI-powered web platform** that helps Nigerian students simplify their university admission journey.
It provides tools to search institutions, explore courses, check eligibility, estimate fees, and AI chatbot, all in one place.

---

### **Frontend link**: [https://eduwaka.onrender.com/](https://eduwaka.onrender.com/)

[Frontend README](https://github.com/GiftinTech/Eduwaka_AI_Assistant/blob/main/eduwaka_frontend/README.md)

### **API Server**: [https://eduwaka-ai-assistant-server.onrender.com/api/](https://eduwaka-ai-assistant-server.onrender.com/api/)

[Server README](https://github.com/GiftinTech/Eduwaka_AI_Assistant/blob/main/eduwaka_frontend/README.md)

---

## 🚀 Tech Stack

### Frontend

- React + TypeScript
- Tailwind CSS
- Vite
- React Router

### Backend

- Python + Django REST Framework
- PostgreSQL (preferred)
- JWT Authentication
- Django Apps for modularity

---

## 📂 Project Structure

```

eduwaka/
│── eduwaka_backend/ # Django backend
│── eduwaka_frontend/ # React frontend

```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/GiftinTech/eduwaka.git
cd eduwaka
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000/`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173/`

---

## 🔑 Features

- Authentication (Signup/Login/Logout + Protected Routes)
- Institution & Course Management
- Eligibility Checker
- Tuition/Fee Estimates
- Chatbot for guidance
- FAQ Section
- Search history tracking

---

## 📌 API Endpoints (Sample)

- `POST /api/auth/signup/` – Register new user
- `POST /api/auth/login/` – Login & get JWT
- `GET /api/auth/me/` – Current logged-in user
- `GET /api/institutions/` – List all institutions
- `GET /api/courses/` – List all courses
- `POST /api/eligibility/check/` – Check admission eligibility
- `POST /api/ai/chatbot/` – Check admission
- `POST /api/ai/institution-overview/` – Check admission

---

## ✅ Tests

- Backend: `pytest` or `python manage.py test`
- Frontend: `npm run test`

---

## 👨‍💻 Contributing

See the [Contributing guidelines](CONTRIBUTING.md)

## 📜 License

This project is licensed under the [GNU AGPLv3 License](LICENSE) – see the [LICENSE](LICENSE) file for details.
