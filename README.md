# 🏛️ Virtualized Indian Law Platform (LawVirtual)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=netlify)](https://law-virtualization.netlify.app/)
[![Database](https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql)](https://render.com/)

**Virtualized Indian Law** is a premium digital gateway designed to democratize legal knowledge. It provides a comprehensive, interactive library of Indian statutes, acts, and constitutional provisions, featuring an elegant Glassmorphism UI and a rich educational interface.

---

## 🚀 Live Host Link
**Access the fully functional platform here:**  
### 👉 [https://law-virtualization.netlify.app/](https://law-virtualization.netlify.app/)

*(Note: Ensure the backend is awake on Render for live data fetching.)*

---

## ✨ Key Features
- **📘 50+ Detailed Statutes**: Comprehensive coverage of Constitutional, Criminal, Civil, Corporate, and Family laws.
- **📄 Rich Legal Documents**: Paper-bound document aesthetic with high-readability serif typography and line-aligned layouts.
- **🎓 Educational Breakdowns**: Complex law broken down into "Easy Explanations" with visual diagrams and structured bullet points.
- **🔍 Advanced Search & Filter**: Instant filtering by category (e.g., "Family Law", "Criminal Law") or specific keywords.
- **🛡️ Admin Dashboard**: Secure management interface for adding, editing, and deleting legal records.
- **📑 My Bookmarks**: Personalized storage to save critical laws for offline reference.
- **🎨 Premium UI/UX**: Modern Glassmorphism effects, smooth animations, and a responsive localized hero section.

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Lucide Icons, Glassmorphism CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (hosted on Render).
- **Authentication**: JWT-based secure sessions.
- **Deployment**: Netlify (Frontend) & Render (Backend).

---

## 🔑 Admin Credentials
For testing and management purposes, use the following administrator account:
- **Email**: `ankitrautsingh@gmail.com`
- **Password**: `Ankit@772888`

---

## 📦 Local Installation

### 1. Clone the repository
```bash
git clone https://github.com/ankit-56/Law-Virtualization.git
cd Law-Virtualization
```

### 2. Setup the Server
```bash
cd server
npm install
# Create a .env file with your MySQL credentials
# Run the database setup script
node setupDb.js
# Seed the legal library with 50 laws
node db/seed.js
npm run dev
```

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```

---

## ⚖️ Disclaimer
This platform is for educational purposes and provides digital accessibility to public legal records. It does not constitute legal advice.

**Developed with ❤️ for the Indian Legal Community.**
