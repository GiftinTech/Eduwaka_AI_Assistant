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

```plaintext
eduwaka_backend/
│── apps/
   │── users/            # Authentication & user management
   │── institutions/     # Institutions & courses
   │── eligibility/      # Eligibility logic
   │── chatbot/          # Chatbot logic
   │── search/           # Search logs
   │── ai_assistant/     # AI assistant features
│── core/
   │── authentication.py
   │── utils.py
│── media
   │── profile_photos
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

## API Endpoints (Sample)

- `POST /api/auth/signup/` – Register a user
- `POST /api/auth/login/` – Login user (JWT)
- `GET /api/auth/me/` – Get current user profile
- `GET /api/institutions/` – List institutions
- `GET /api/courses/` – List courses
- `POST /api/ai/eligibility-check/` – Check admission
- `POST /api/ai/chatbot/` – Check admission
- `POST /api/ai/institution-overview/` – Check admission

---

## API Documentation

**Live API**: [https://eduwaka-ai-assistant-server.onrender.com/api/](https://eduwaka-ai-assistant-server.onrender.com/api/) <br>
**local**: [http://127.0.0.1:8000/api/]

### Authentication Endpoints

#### 1. Login

**POST** `/api/auth/login/`

**Description:** Obtain JWT access and refresh tokens upon user login.

**Request Body:**

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "refresh": "your_access_token",
  "access": "your_refresh_token"
}
```

---

#### 2. Refresh Token

**POST** `/api/auth/token/refresh/`

**Description:** Refresh the access token using a valid refresh token.

**Request Body:**

```json
{
  "refresh": "your_refresh_token"
}
```

**Response:**

```json
{
  "access": "new_access_token"
}
```

---

#### 3. Change Password

**POST** `/api/auth/change-password/`

**Description:** Change the current user's password.

**Request Body:**

```json
{
  "old_password": "old_password",
  "new_password": "new_password",
  "confirm_new_password": "confirm_new_password"
}
```

**Response:** 200 OK with success message or error details.

```json
{
  "detail": "detail"
}
```

---

#### 4. Forgot Password

**POST** `/api/auth/forgot-password/`

**Description:** Initiate password reset process (e.g., send reset email).

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** 200 OK

```json
{
  "detail": "Password reset link sent!",
  "uidb64": "uidb64",
  "token": "token"
}
```

---

#### 5. Reset Password

**POST** `/auth/reset-password/`

**Description:** Reset password using token.

**Request Body:**

```json
{
  "token": "password_reset_token",
  "new_password": "new_password",
  "confirm_new_password": "confirm_new_password"
}
```

---

**Response:** 200 OK with success message or error details.

```json
{
  "detail": "detail"
}
```

---

### User Management

#### 1. Register User

**POST** `/api/register/`

**Description:** Register a new user.

**Request Body:**

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Response Body:**

```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@gmail.com",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

---

#### 2. Get User Profile

**GET** `/api/profile/me`

**Description:** Get a user profile.

**Response:**

```json
{
  "id": 9,
  "username": "Jane Doe",
  "email": "janedoe@gmail.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "photo": "http://127.0.0.1:8000/media/default.png",
  "photo_url": "http://127.0.0.1:8000/media/default.png"
}
```

---

#### 2. Update User Profile

**PATCH** `/api/profile/me`

**Description:** Updates a user profile.

**Response:**

```json
{
  "email": "janedoe@gmail.com",
  "photo": "http://127.0.0.1:8000/media/default.png"
}
```

---

#### 2. Delete User Profile

**DELETE** `/api/profile/me`

**Description:** Soft deletes a user account.

---

#### 2. List Users (Admin)

**GET** `/users/`

**Description:** Retrieve list of all users (admin only).

**Response:**

```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@gmail.com",
    "first_name": "user1",
    "last_name": "user1",
    "photo": "http://127.0.0.1:8000/media/images/default.png",
    "photo_url": "http://127.0.0.1:8000/media/images/default.png"
  },
  {
    "id": 3,
    "username": "admin",
    "email": "admin@eduwaka.io",
    "first_name": "admin",
    "last_name": "admin",
    "photo": "http://127.0.0.1:8000/media/images/default.png",
    "photo_url": "http://127.0.0.1:8000/media/images/default.png"
  }
]
```

---

#### 3. Update User (Admin)

**PUT** `/users/<user_id>/`

**Description:** Update user details.

**Request Body:**

```json
{
  "username": "updated_username",
  "email": "new_email@example.com"
}
```

---

#### 4. Delete User (Admin)

**DELETE** `/users/<user_id>/`

**Description:** Delete a user permanently (admin only).

---

### AI Assistant Endpoints

#### 1. Eligibility Check

**POST** `/api/ai/eligibility-check/`

**Description:** Check if a user is eligible to study a particular course in a given institution.

**Request:**

```json
{
  "institution_name": "Obafemi Awolowo University",
  "desired_course": "Law",
  "o_level_sittings": "2",
  "o_level_sitting_1": "English C6, Maths D7, Literature B2, CRS C5, Government B3",
  "o_level_sitting_2": "English B3, Maths C4, History B2",
  "jamb_score": 250,
  "jamb_subjects": "English, Literature, Government, CRS"
}
```

**Response:**

```json
{
  "is_eligible": false,
  "missing_requirements": [
    "Higher JAMB score to meet Obafemi Awolowo University's cut-off for Law."
  ],
  "o_level_credits_required": 5,
  "o_level_sittings_accepted": 2,
  "reasons": [
    "Candidate met the O'Level subject and grade requirements for Law, including English Language and Mathematics, with 6 credits (English B3, Maths C4, Literature B2, CRS C5, Government B3, History B2).",
    "The O'Level requirements were met within the accepted 2 sittings.",
    "The JAMB subject combination (English, Literature, Government, CRS) is appropriate for Law.",
    "The JAMB score of 250 is likely below the competitive cut-off mark for Law at Obafemi Awolowo University."
  ],
  "suggested_courses": [
    "English Language",
    "Literature in English",
    "History",
    "Religious Studies",
    "Philosophy"
  ]
}
```

---

#### 2. Chatbot Interaction

**POST** `/api/v1/chatbot/`

**Description:** Send a message to the chatbot.

**Request:**

```json
{
  "chat_history": [
    {
      "role": "user",
      "parts": [
        {
          "text": "What are the admission requirements for medicine and surgery at the University of Ibadan?"
        }
      ]
    }
  ]
}
```

**Response:**

```json
{
  "bot_reply": "Here are the general admission requirements for Medicine and Surgery (MBBS) at the University of Ibadan (UI):\n\n### UTME (JAMB) Requirements\n\n1. ...."
}
```

---

#### 3. Chat History

**GET** `/api/v1/chat_history/`

**Description:** Retrieve chat history for the current user.

**Response:**

```json
[
  {
    "role": "user",
    "parts": [
      {
        "text": "What are the admission requirements for medicine and surgery at the University of Ibadan?"
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": "Here are the general admission requirements for Medicine and Surgery (MBBS) at the University of Ibadan (UI)..."
      }
    ]
  },
  {
    "role": "user",
    "parts": [
      {
        "text": "What are the admission requirements for medicine and surgery at the University of Ibadan?"
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": " **'A' Level Passes:** Good passes (usually 'B's or 'C's) in Physics, Chemistry, and Biology (or Zoology)..."
      }
    ]
  }
]
```

---

### Courses and Institutions

#### 1. List Courses

**GET** `/api/courses/`

**Response:**

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "institution_name": "Babcock University, Ilishan-Remo",
      "name": "Computer Engineering",
      "faculty": "Engineering",
      "department": "Computer Engineering",
      "duration_years": 5,
      "olevel_requirements": "5 credits in English, Maths, Physics, Chemistry, and Further Maths",
      "jamb_requirements": "Use of English, Maths, Physics, and Chemistry",
      "post_utme_details": "Screening exercise to be announced.",
      "institution": 1
    },
    {
      "id": 2,
      "institution_name": "Madonna University, Okija",
      "name": "Computer Engineering",
      "faculty": "Engineering",
      "department": "Computer Engineering",
      "duration_years": 5,
      "olevel_requirements": "5 credits in English, Maths, Physics, Chemistry, and Further Maths",
      "jamb_requirements": "Use of English, Maths, Physics, and Chemistry",
      "post_utme_details": "Screening exercise to be announced.",
      "institution": 3
    }
  ]
}
```

#### 2. Course Details

**GET** `/courses/<id>/`

**Response:**

```json
{
  "id": 1,
  "institution_name": "Babcock University, Ilishan-Remo",
  "name": "Computer Engineering",
  "faculty": "Engineering",
  "department": "Computer Engineering",
  "duration_years": 5,
  "olevel_requirements": "5 credits in English, Maths, Physics, Chemistry, and Further Maths",
  "jamb_requirements": "Use of English, Maths, Physics, and Chemistry",
  "post_utme_details": "Screening exercise to be announced.",
  "institution": 1
}
```

#### 3. List Institutions

**GET** `/institutions/`

**Response:**

```json
{
  "count": 661,
  "next": "http://127.0.0.1:8000/api/institutions/?page=2",
  "previous": null,
  "results": [
    {
      "id": 340,
      "courses": [],
      "name": "Abdu Gusau Polytechnic",
      "state": "Zamfara",
      "city": "Talata Mafara",
      "abbreviation": null,
      "website": null,
      "institution_type": "Polytechnic",
      "ownership_type": "State",
      "year_of_establishment": null,
      "description": "A state-owned polytechnic in Zamfara State."
    },
    {
      "id": 292,
      "courses": [],
      "name": "AbdulKadir Kure University, Minna Niger State",
      "state": "Niger",
      "city": "Minna",
      "abbreviation": null,
      "website": null,
      "institution_type": "University",
      "ownership_type": "State",
      "year_of_establishment": "2023",
      "description": null
    },
    {
      "id": 644,
      "courses": [],
      "name": "Abdullahi Maikano College of Education",
      "state": "Plateau",
      "city": "Wase",
      "abbreviation": null,
      "website": null,
      "institution_type": "College of Education",
      "ownership_type": "Private",
      "year_of_establishment": null,
      "description": "A private college of education in Plateau State."
    }
  ]
}
```

#### 4. Institution Details

**GET** `/institutions/<id>/`

**Response:**

```json
{
  "id": 1,
  "courses": [
    {
      "id": 1,
      "institution_name": "Babcock University, Ilishan-Remo",
      "name": "Computer Engineering",
      "faculty": "Engineering",
      "department": "Computer Engineering",
      "duration_years": 5,
      "olevel_requirements": "5 credits in English, Maths, Physics, Chemistry, and Further Maths",
      "jamb_requirements": "Use of English, Maths, Physics, and Chemistry",
      "post_utme_details": "Screening exercise to be announced.",
      "institution": 1
    }
  ],
  "name": "Babcock University, Ilishan-Remo",
  "state": "Ogun",
  "city": "Ilishan-Remo",
  "abbreviation": null,
  "website": "https://www.babcock.edu.ng",
  "institution_type": "University",
  "ownership_type": "Private",
  "year_of_establishment": "1999",
  "description": null
}
```

---

## Notes:

- All endpoints requiring authentication need an `Authorization` header with the token, e.g., `Authorization: Bearer <token>`.
- Endpoints like user list and delete are restricted to admin users.
- Use appropriate HTTP methods for each operation.
- Adjust request/response schemas based on your actual data models and validation.
