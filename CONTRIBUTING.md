# 📄 Contributing to EduWaka

Thanks for considering contributing to **EduWaka**! 🚀 EduWaka is a web app and API built with **Django (backend)** and **React + TypeScript + Tailwind + Vite (frontend)**. Contributions of all kinds—code, documentation, bug reports and feature ideas—are welcome.

---

## ⚖ Code of Conduct

Before proceeding please read the [code of conduct](CODE_OF_CONDUCT.md)

---

## 🐛 Reporting Bugs

- Check the [Issues](../../issues) tab to avoid duplicates.
- Use a clear and descriptive title.
- Include steps to reproduce, your environment (browser, OS, Django/React versions), and screenshots if helpful.

---

## 💡 Requesting Features

- Open a new [Issue](../../issues) with the label `enhancement`.
- Explain the feature’s purpose, expected behavior, and benefits.

---

## 🔧 Development Setup

### Backend (Django)

1. **Clone the repo**:

   ```bash
   git clone https://github.com/your-username/eduwaka.git
   cd eduwaka
   ```

2. **Create a virtual environment & install dependencies**:

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run database migrations & start the server**:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend (React + Vite)

1. Navigate to the frontend folder:

   ```bash
   cd eduwaka_frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

---

## 🧪 Testing

### Backend

Run tests with:

```bash
python manage.py test
```

### Frontend

Run tests (if available) or linting:

```bash
npm run lint
```

---

## 📝 Code Style

- **Frontend:** Use Prettier and ESLint for formatting (`npm run format` to fix formatting issues).
- **Backend:** Follow [PEP 8](https://peps.python.org/pep-0008/).
- Keep commits small and focused; use clear commit messages.

---

## 🔀 Submitting Pull Requests

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit:

   ```bash
   git commit -m "Add: short description of changes"
   ```

4. Push to your fork and open a Pull Request to `main`.
5. Link any related issues in your PR description.

---

## 🙌 Community

- Be respectful and collaborative.
- For behavior guidelines, see our [Code of Conduct](CODE_OF_CONDUCT.md).

Thank you for helping improve EduWaka! 💡
