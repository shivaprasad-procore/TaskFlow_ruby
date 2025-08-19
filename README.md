# Task Management App

## What This Project Is

A simple task management application supporting task tracking and  comments.

### Purpose
Build a basic, full-stack task manager with:

- Tasks and its descriptions
- Threaded comments per task

---

## Architecture Overview

- **Frontend:** React app (served via NGINX container)
- **Backend:** Ruby on Rails API (`rails_backend`) + PostgreSQL

---

##  Tech Stack

### Frontend
- React 19
- Axios
- React Router

### Backend (Rails)
- Ruby on Rails
- PostgreSQL
- Discard (for soft deletes)
- CORS

### Database
- PostgreSQL

---

## 🗃️ Data Model

### Tasks (`task_items`)
- `id`, `number`, `title`, `status`, `priority`, `assignee`
- `description`, `due_date`
- `created_at`, `updated_at`, `deleted_at` 

### Comments (`task_comments`)
- `id`, `task_item_id`, `user_name`, `comment`
- `created_at`, `updated_at`

> ⚠️ Ensure migrations are run to correctly generate comment IDs before running the project 

---

## API Endpoints (Rails)

- `GET /api/tasks` – list all tasks (excluding soft-deleted)
- `GET /api/tasks/:id` – retrieve a task by ID
- `POST /api/tasks` – create a new task
- `PUT /api/tasks/:id` – update a task
- `DELETE /api/tasks/:id` – soft delete a task
- `GET /api/tasks/:task_id/comments` – list comments for a task
- `POST /api/tasks/:task_id/comments` – add a comment to a task

- **Rails API URL:** [http://localhost:3000](http://localhost:3000)
- **Postgres Port:** host `5433` → container `5432`  
  - DB: `taskdb`, User: `postgres`, Password: `postgres`

---

## How to Run

### Frontend (React)

```bash
cd Frontend
npm install
npm start

```
### Backend (Rails)

```bash
cd rails_backend
bundle install
rails s
```


**Project  URL:** [http://localhost:3001](http://localhost:3001)
