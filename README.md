# 🎭 DECOY — Self-Productivity & Efficiency Analytics Tracker

> **"Busy isn't always productive. Track your hours against real outcomes."**

DECOY is a modern full-stack web application designed to eliminate the illusion of busywork. By evaluating the ratio between hours invested and self-rated outcome quality, DECOY reveals whether your work sessions are genuinely high-impact or just a "decoy."

---

## 🚀 Key Features

- **⚡ Efficiency Calculator:** Calculates real-time efficiency using the formula:
  $$\text{Efficiency} = \frac{\text{Result Rating (1–5)}}{\text{Effort Hours}}$$
- **💎 Dynamic Verdicts:** Classifies sessions into *Real Work 💎*, *Fair Trade ⚖️*, *Mostly Decoy 🎭*, or *Pure Decoy 🚨*.
- **🚨 3-Day Decoy Streak Warning:** Detects 3 or more consecutive low-efficiency sessions ($< 0.8$) and warns you with an alert banner.
- **📊 Performance Insights:** Automatically extracts your all-time **Best Day 💎** and **Most Decoy 🎭** sessions via SQL `ORDER BY`.
- **📜 Recent History:** Displays the last 10 entries with custom badge chips (`⏱️ Hours`, `⭐ Rating`), session notes, and timestamps.
- **💾 Local SQLite Storage:** Lightweight and fast disk-persisted database (`decoy.db`) using `better-sqlite3`.
- **🌙 Sleek Dark Mode UI:** High-contrast, minimal layout built with pure Vanilla CSS and React 19.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast HMR, reactive state management, modern hooks |
| **Styling** | Vanilla CSS (Dark Theme) | High contrast, modern glassmorphism cards, responsive |
| **Backend** | Node.js + Express 5 | RESTful API routes, CORS enabled, JSON parsing |
| **Database** | SQLite (`better-sqlite3`) | Local `decoy.db` with pure SQL aggregations (`AVG`, `ORDER BY`) |

---

## 📂 Project Structure

```text
├── decoy.db           # SQLite database file (auto-generated)
├── LAB_REPORT.md      # Comprehensive academic lab report
├── package.json       # Project dependencies & scripts
├── README.md          # Project documentation
├── server.js          # Express.js REST API & SQLite queries (25 lines)
├── vite.config.js     # Vite bundler configuration
└── src/
    ├── App.jsx        # Main React UI component (83 lines)
    ├── index.css      # Dark theme styling (10 lines)
    └── main.jsx       # React application root
```

---

## 🚦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Installation
Clone or navigate to the project directory and install the dependencies:
```bash
npm install
```

### 2. Running the Application

Open **two separate terminal windows**:

#### **Terminal 1: Start the Backend Server**
```bash
npm start
```
> Express + SQLite server starts at `http://localhost:5000`

#### **Terminal 2: Start the Frontend App**
```bash
npm run dev
```
> Vite React application starts at `http://localhost:5173`

### 3. Open in Browser
Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Reference

### `POST /api/log`
Submit a new work session log.
- **Request Body:**
  ```json
  {
    "effort_hours": 4.5,
    "result_rating": 4,
    "note": "Built authentication module"
  }
  ```
- **Response:**
  ```json
  {
    "efficiency": 0.89,
    "verdict": "Fair Trade ⚖️",
    "avgEfficiency": 0.74,
    "streak": 0
  }
  ```

---

### `GET /api/history`
Fetch the 10 most recent logged sessions (latest first).
- **Response:**
  ```json
  [
    {
      "id": 1,
      "effort_hours": 4.5,
      "result_rating": 4,
      "note": "Built authentication module",
      "created_at": "2026-08-15 00:00:00"
    }
  ]
  ```

---

### `GET /api/insight`
Retrieve the highest-efficiency and lowest-efficiency sessions.
- **Response:**
  ```json
  {
    "best": { "id": 1, "effort_hours": 2, "result_rating": 5, "eff": 2.5, "note": "High focus" },
    "worst": { "id": 2, "effort_hours": 6, "result_rating": 1, "eff": 0.17, "note": "Endless meetings" }
  }
  ```

---

## 📐 Verdict Matrix

| Efficiency Score | Verdict | Interpretation |
| :--- | :--- | :--- |
| $\ge 1.5$ | **Real Work 💎** | Maximum productivity & high outcome per hour |
| $\ge 0.8$ | **Fair Trade ⚖️** | Proportional and solid outcome |
| $\ge 0.4$ | **Mostly Decoy 🎭** | Below average outcome for the effort expended |
| $< 0.4$ | **Pure Decoy 🚨** | Busywork without meaningful output |

---

## 📄 License
This project is open-source and created for educational & personal productivity tracking purposes.
