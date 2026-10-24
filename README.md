# Tasky

A full-stack task manager built with React, Express, and PostgreSQL. Tasky lets you create an account, organize your tasks into categories, and keep track of what needs to get done.

## Features

- User registration and login with JWT-based authentication
- Create, view, update, and delete tasks
- Built-in task categories, created automatically on first run
- Responsive React interface powered by Vite
- REST API backed by a PostgreSQL database

## Tech stack

| Layer    | Technology            |
| -------- | --------------------- |
| Frontend | React, Vite           |
| Backend  | Node.js, Express      |
| Database | PostgreSQL            |
| Auth     | JSON Web Tokens (JWT) |

## Project structure

```
tasky/
├── task-manager-backend/    # Express API
│   ├── .env.example
│   └── ...
├── task-manager-frontend/   # React + Vite app
│   ├── .env.example
│   └── ...
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A running PostgreSQL instance

## Getting started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd tasky
   ```

2. **Configure the backend**

   ```bash
   cd task-manager-backend
   cp .env.example .env
   ```

   Open `.env` and fill in your PostgreSQL connection details and a `JWT_SECRET`.

3. **Configure the frontend**

   ```bash
   cd ../task-manager-frontend
   cp .env.example .env
   ```

4. **Install dependencies** in both folders:

   ```bash
   npm ci
   ```

5. **Start the API** from `task-manager-backend`:

   ```bash
   npm run dev
   ```

6. **Start the frontend** from `task-manager-frontend`:

   ```bash
   npm run dev
   ```

Then open the URL Vite prints in your terminal (usually `http://localhost:5173`).

## How it works

- On startup, the API creates the required database tables and the built-in categories before it begins listening for requests.
- During development, Vite proxies every `/api` request to the backend at `http://localhost:5000`, so the frontend needs no extra CORS setup.
- You can check that the API can reach the database by visiting `http://localhost:5000/api/test-db`.

## Scripts

Run these from either project folder:

| Command       | Description                                  |
| ------------- | -------------------------------------------- |
| `npm run dev` | Start the development server                 |
| `npm ci`      | Install exact dependencies from the lockfile |
