# Personal Link Hub

This is a responsive, minimalistic personal link hub (similar to Linktree) where users can manage and customize the links they share. Built with a modern fullstack stack using React, TailwindCSS, shadcn/ui, react-hook-form, DnD Kit, React Query, and a Fastify + Prisma + Firebase Auth backend.

---

## ✨ Features

- 🔐 User authentication with Firebase Auth
- 🧩 Fully functional link dashboard:
  - Create, edit, delete links
  - Toggle public/private visibility
  - Drag-and-drop reordering (DnD Kit)
- 🖼️ Public profile page with customizable link list
- 💅 Clean and responsive UI (mobile-first)
- ⚡ Optimistic UI with React Query

---

## 📌 Scope Decisions & Trade-offs

- **Firebase Auth** was chosen for rapid and secure user authentication instead of building a custom auth system.
- **Backend built with Fastify** for speed and simplicity over larger frameworks like NestJS.
- **Drag-and-drop** was implemented using `@dnd-kit` for flexibility, though it required careful handling for mobile compatibility.
- **Image upload** and full profile customization were out of scope to prioritize core link management functionality.

---

## 🛠 Setup & Run Instructions

### Frontend

````bash
cd web
cp .env.example .env  # Fill in Firebase credentials
npm install
npm run dev
````

### Backend

```bash
cd server
cp .env.example .env  # Fill in Firebase credentials
npm install
npm run dev
```
