# 📄 Contributing to EduWaka

Thanks for considering contributing to **EduWaka**! 🚀 EduWaka is an open-source, AI-powered web platform helping Nigerian students simplify their university admission journey. It is built with **Django (backend)** and **React + TypeScript + Tailwind + Vite (frontend)**. Contributions of all kinds — code, documentation, bug reports, and feature ideas — are welcome.

---

## ⚖️ Code of Conduct

Before proceeding, please read our [Code of Conduct](CODE_OF_CONDUCT.md). All contributors are expected to uphold it.

---

## 🐛 Reporting Bugs

- Check the [Issues](../../issues) tab first to avoid duplicates.
- Use a clear and descriptive title.
- Include steps to reproduce, your environment (browser, OS, Django/React versions), and screenshots if helpful.
- Use the `bug` label when opening the issue.

---

## 💡 Requesting Features

- Open a new [Issue](../../issues) with the label `enhancement`.
- Explain the feature's purpose, expected behaviour, and the problem it solves for Nigerian students using Eduwaka.
- Check existing issues and discussions before submitting to avoid duplicates.

---

## 🔧 Development Setup

> **Prerequisites:** Python 3.10+, Node.js 18+, and Git installed on your machine.

### Backend (Django)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/eduwaka.git
   cd eduwaka
   ```

2. **Create a virtual environment & install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**

   Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env
   ```
   > Ask a maintainer or check the project wiki if you are unsure what values to use.

4. **Run database migrations & start the server:**
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

Please ensure all tests pass before opening a Pull Request.

### Backend
```bash
python manage.py test
```

### Frontend
```bash
npm run lint
```

> If you are adding a new feature, write or update tests where applicable.

---

## 📝 Code Style

- **Frontend:** Use Prettier and ESLint. Run `npm run format` to auto-fix formatting issues before committing.
- **Backend:** Follow [PEP 8](https://peps.python.org/pep-0008/). Use clear, descriptive variable and function names.
- Keep commits small and focused.
- Use clear commit messages following this convention:
  ```
  Add: short description      # new feature or file
  Fix: short description      # bug fix
  Update: short description   # modification to existing feature
  Docs: short description     # documentation only
  Refactor: short description # code restructure, no behaviour change
  ```

---

## 🔀 Submitting Pull Requests

1. Fork the repository.
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes, ensure tests pass, then commit:
   ```bash
   git commit -m "Add: short description of changes"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request to the `main` branch of this repository.
6. In your PR description:
   - Summarise what you changed and why.
   - Link any related issues (e.g. `Closes #12`).
   - Include screenshots for UI changes where possible.

> A maintainer will review your PR and may request changes before merging. Please be patient — this is a volunteer-driven project.

---

## 🌍 Scope & Mission

EduWaka is built **specifically for Nigerian students** navigating the university admission process. When contributing, please keep this context in mind. Features or content should be relevant to the Nigerian education system (JAMB, WAEC, FUTO, UNILAG, etc.) unless they serve the platform's general infrastructure.

---

## 🙌 Community

- Be respectful, patient, and collaborative.
- This is a mission-driven, free and open-source project — every contribution, no matter how small, matters.
- For behaviour guidelines, see our [Code of Conduct](CODE_OF_CONDUCT.md).

Thank you for helping improve EduWaka and making university admission simpler for Nigerian students! 💡

---
 Added the **Scope & Mission section** — crucial for an open-source project with a specific audience, so contributors don't add irrelevant features.
- Replaced "your-username" in the clone URL — you should update this to your actual GitHub username before publishing.
