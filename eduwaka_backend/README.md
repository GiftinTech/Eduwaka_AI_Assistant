# EduWaka Backend

This is the **backend service** for EduWaka – an AI-powered platform that helps Nigerian students simplify their university admission journey.  
The backend is built with **Python + Django** and provides RESTful APIs for authentication, courses, institutions, eligibility checks, and more.

---

## 🚀 Tech Stack

- **Language:** Python 3.11+
- **Framework:** Django + Django REST Framework
- **Database:** PostgreSQL (recommended) / MySQL / SQLite (for dev)
- **Authentication:** JWT (djangorestframework-simplejwt)

---

## 📂 Project Structure

```

eduwaka_backend/
│── apps/
    │── users/ # Authentication & user management
    │── institutions/ # Institutions & courses
    │── eligibility/ # Eligibility logic
    │── chatbot/ # Chatbot logic
    │── search/ # Search logs
    │── ai_assistant/ # Search logs
│── core
    │── authentication.py
    │── utils.py
│── manage.py
│── .gitignore
│── .env
│── requirements.txt
│── venv/

```

---

## ⚙️ Setup Instructions

1. Clone repo:

   ```bash
   git clone https://github.com/GiftinTech/eduwaka_backend.git
   cd eduwaka-backend
   ```

2. Create virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # (Linux/Mac)
   venv\Scripts\activate      # (Windows)
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure `.env`:

   ```env
   SECRET_KEY=your_django_secret
   DEBUG=True
   DATABASE_URL=postgres://user:password@localhost:5432/eduwaka
   ```

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Start server:

   ```bash
   python manage.py runserver
   ```

---

## 🔑 API Endpoints (Sample)

- `POST /api/auth/signup/` – Register a user
- `POST /api/auth/login/` – Login user (JWT)
- `GET /api/auth/me/` – Get current user profile
- `GET /api/institutions/` – List institutions
- `GET /api/courses/` – List courses
- `POST /api/eligibility/check/` – Check admission
- more added soon

---

## Tests

Run:

```bash
pytest
```

or

```bash
python manage.py test
```
