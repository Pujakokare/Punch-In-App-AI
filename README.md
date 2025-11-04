A simple web app to record punch in times.

Frontend: React- User interface hosted as a Static Site on Render
Backend: Node.js (Express)- API that saves and retrieves punch data from Couchbase
Database: Couchbase Capella
Hosting: Render.com

Folder Structure:
punch-app/
├── backend/       # Node.js + Express API (connects to Couchbase)
│   ├── index.js
│   ├── couchbase.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/      # React app (UI)
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   └── index.js
│   ├── public/index.html
│   └── package.json
│
└── README.md      # You are reading this file
