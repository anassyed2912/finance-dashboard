# Flo — Personal Finance Dashboard

A personal finance dashboard built with React that lets you log income and expenses, visualise spending patterns, and track savings goals. Data is stored in **MongoDB Atlas** via an Express REST API.

## Tech Stack

- **Frontend** — React 18, Recharts, Vite
- **Backend** — Node.js, Express 4, Mongoose
- **Database** — MongoDB Atlas (cloud-hosted)

---

## Setup

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Set up MongoDB Atlas

1. Create a free **M0 cluster** at cloud.mongodb.com
2. Go to **Database Access** → add a user with Read/Write permissions
3. Go to **Network Access** → add `0.0.0.0/0` (allow all, fine for dev)
4. Click **Connect** → **Drivers** → copy your connection string

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and paste your connection string:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/flo-finance?retryWrites=true&w=majority
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Then install dependencies:

```bash
npm install
```

### 3. Configure the frontend

In the project root, the `.env` file is already set for local development:

```
VITE_API_URL=http://localhost:3001
```

Install frontend dependencies:

```bash
# from project root
npm install
```

---

## Running locally

You need two terminals:

```bash
# Terminal 1 — backend API
cd backend
npm run dev

# Terminal 2 — frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

On first load, sample transactions are automatically seeded into your MongoDB database.

---

## Project structure

```
flo-finance/
├── backend/
│   ├── models/
│   │   ├── Transaction.js     # Mongoose schema
│   │   └── Settings.js        # Mongoose schema
│   ├── routes/
│   │   ├── transactions.js    # CRUD + seed/reset endpoints
│   │   └── settings.js        # GET + PUT settings
│   ├── server.js              # Express app entry point
│   ├── .env.example           # Copy to .env and fill in
│   └── package.json
├── src/
│   ├── api/
│   │   └── api.js             # Fetch wrapper for all API calls
│   ├── context/
│   │   └── FinanceContext.jsx # Global state — now uses API instead of localStorage
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── StatCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── AddEntry.jsx
│   │   ├── History.jsx
│   │   ├── Goals.jsx
│   │   ├── Visualisations.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                       # Frontend env (VITE_API_URL)
├── vite.config.js
└── package.json
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/transactions | Fetch all transactions |
| POST | /api/transactions | Create a transaction |
| DELETE | /api/transactions/:id | Delete a transaction |
| POST | /api/transactions/seed | Seed sample data (no-op if data exists) |
| DELETE | /api/transactions | Wipe all transactions (used by Reset) |
| GET | /api/settings | Fetch user settings |
| PUT | /api/settings | Update user settings |
| GET | /api/health | Health check |
