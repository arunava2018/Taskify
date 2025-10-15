<div align="center">

# 🧩 Taskify

**Organize smart. Collaborate better. Build faster.**

</div>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/Frontend-React-61DBFB?style=for-the-badge&logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript">
  <img alt="Node.js" src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb">
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?style=for-the-badge&logo=tailwindcss">
  <img alt="Clerk" src="https://img.shields.io/badge/Clerk-Authentication-3D3D3D?style=for-the-badge&logo=clerk">
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io">
</p>


<p align="center">
  <a href="#-about-the-project"><strong>About</strong></a> ·
  <a href="#-features-showcase"><strong>Features</strong></a> ·
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#-screenshots"><strong>Screenshots</strong></a> ·
  <a href="#-getting-started"><strong>Getting Started</strong></a> ·
  <a href="#-folder-structure"><strong>Folder Structure</strong></a> ·
  <a href="#-contributing"><strong>Contributing</strong></a>
</p>

---

### 🚀 Live Demo  
👉 [**Try Taskify Live**](https://taskify-mu-indol.vercel.app/)

---

<div align="center">

**A modern, real time collaborative task management app designed for individuals and teams.**

</div>

---

## 🧠 About The Project

**Taskify** is a **full-stack real time collaborative task management platform** designed to help users and teams stay productive, organized, and efficient.  
It allows you to create, manage, and track tasks — either individually or collaboratively across users.

From simple personal to-do lists to complex project workflows, **Taskify** provides a smooth, powerful, and intuitive SaaS experience.

---

## ✨ Features Showcase

| Feature | Description |
| :--- | :--- |
| 🔐 **Secure Authentication** | Powered by **Clerk**, ensuring hassle-free sign-up, sign-in, and session management. |
| 📝 **Task Management** | Create, edit, and delete tasks effortlessly with a clean and intuitive UI. |
| 🗂️ **Nested Todos** | Break large tasks into smaller subtasks for better organization and tracking. |
| 🤝 **Collaborative Workspaces** | Share tasks with teammates using invite codes. Everyone stays in sync, in real time. |
| 🔄 **Real-Time Updates** | Any update made by a collaborator reflects instantly for all users. |
| 🎨 **Beautiful, Modern UI** | Built using **Tailwind CSS**, **Shadcn/UI**, and **Framer Motion** for smooth animations. |
| 🛡️ **Type-Safe Architecture** | Full **TypeScript** support on both frontend and backend ensures safer and more scalable code. |
| ⚡ **Optimized Performance** | Built using **Vite**, ensuring blazing-fast development and build times. |
| 📱 **Fully Responsive** | Works seamlessly on desktops, tablets, and mobile devices. |

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose |
| **Authentication** | Clerk |
| **API Layer** | REST API |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) |

---

## 🖼️ Screenshots

### 🧭 Dashboard
![Dashboard Screenshot](https://github.com/arunava2018/Taskify/blob/master/frontend/src/assets/Dashboard.png)

---

### 📝 Task View
![Task Screenshot](https://github.com/arunava2018/Taskify/blob/master/frontend/src/assets/TaskView.png)

---

### 🤝 Invite Collaboration
![Collaboration Screenshot](https://github.com/arunava2018/Taskify/blob/master/frontend/src/assets/Collaboration.png)


## ⚙️ Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/) (v18.x or higher)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)

### Installation & Setup

1.  **Fork and Clone the Repository**
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/Taskify.git
    cd Taskify
    ```

2.  **Install Dependencies**
    Install dependencies for both the frontend and backend.
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in both the `frontend/` and `backend/` directories. Use the `.env.example` files as a template.

    **Backend (`backend/.env`):**
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    CLERK_SECRET_KEY=your_clerk_secret_key
    FRONTEND_URL=http://localhost:5173
    ```

    **Frontend (`frontend/.env`):**
    ```env
    VITE_BACKEND_URL=http://localhost:8000
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    ```
    > **Note:** You can get your Clerk keys from the [Clerk Dashboard](https://dashboard.clerk.dev/).

4.  **Start the Development Servers**
    ```bash
    # Run the backend server (from the 'backend' directory)
    cd backend
    npm run dev

    # In a new terminal, run the frontend server (from the 'frontend' directory)
    cd frontend
    npm run dev
    ```
    Your application should now be running locally at `http://localhost:5173`.

---
## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

To contribute:
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
