# Student Timetable & Goals — Single-Table CRUD App

ICT251 Activity 4 · Question 3 (resource: `timetable`, table: `timetable`)

Node.js + Express REST API, SQLite database, and a plain HTML/JavaScript frontend.

## Project structure

```
timetable-crud/
├─ backend/
│  ├─ .env              # PORT, DB_PATH, CORS_ORIGIN
│  ├─ package.json
│  ├─ schema.sql        # CREATE TABLE + 10 sample INSERTs
│  ├─ db.js             # SQLite connection, auto-creates and seeds the DB
│  └─ server.js         # Express API + serves the frontend
├─ frontend/
│  ├─ index.html
│  └─ app.js
└─ postman/
   └─ Timetable_API.postman_collection.json
```

## Table: `timetable`

| Column      | Type                              |
|-------------|-----------------------------------|
| id          | INTEGER PRIMARY KEY AUTOINCREMENT |
| course_code | VARCHAR(20) NOT NULL              |
| course_name | VARCHAR(150)                      |
| lecturer    | VARCHAR(100)                      |
| day_of_week | VARCHAR(10)                       |
| start_time  | VARCHAR(5)                        |
| end_time    | VARCHAR(5)                        |
| venue       | VARCHAR(80)                       |
| goal        | TEXT                              |
| goal_status | VARCHAR(20) (Not Started / In Progress / Achieved) |
| created_at  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP (set on every update)   |

10 sample records are inserted automatically the first time the server starts.

## Run locally (PowerShell)

Requires Node.js 22.13 or newer (Node 24 LTS is fine). SQLite is built into Node, so there is nothing to compile.

```powershell
cd backend
npm install
npm start
```

Then open <http://localhost:3000> — the frontend is served by the same server.

## API endpoints

| Method | URL                    | Description       |
|--------|------------------------|-------------------|
| GET    | /api/timetable         | List all records  |
| GET    | /api/timetable/:id     | Get one record    |
| POST   | /api/timetable         | Create a record   |
| PUT    | /api/timetable/:id     | Update a record   |
| DELETE | /api/timetable/:id     | Delete a record   |

Example POST/PUT body:

```json
{
  "course_code": "CSC3101",
  "course_name": "Artificial Intelligence",
  "lecturer": "Dr. Kunda",
  "day_of_week": "Saturday",
  "start_time": "09:00",
  "end_time": "11:00",
  "venue": "Lecture Hall 2",
  "goal": "Build a simple chatbot",
  "goal_status": "In Progress"
}
```

Errors are JSON too: `400` (validation), `404` (not found).

## Postman evidence

1. Import `postman/Timetable_API.postman_collection.json`.
2. Set the `baseUrl` collection variable (local or deployed URL).
3. Run the five requests in order (POST saves the new `id` for PUT and DELETE) while screen-recording.

## Deploying to the cloud

The assignment asks for a cloud deployment. The simplest route for this project is **Render** (free web service):

1. Push the `timetable-crud` folder to a GitHub repo.
2. On render.com: New → Web Service → connect the repo.
3. Root Directory: `backend` · Build Command: `npm install` · Start Command: `npm start`.
4. Add environment variables: `CORS_ORIGIN=*` and `NODE_VERSION=24` (optionally `DB_PATH=./timetable.db`).
5. Your links will be `https://<your-app>.onrender.com/api/timetable` (plus `/:id`), and the frontend at the root URL.

Note: on free tiers the SQLite file resets when the service restarts or redeploys, but the 10 sample records are re-created automatically. Railway or Fly.io with a persistent volume keep the data permanently.

If you host the frontend separately (e.g. Firebase Hosting), set `DEPLOYED_API` at the top of `frontend/app.js` to your backend URL.
