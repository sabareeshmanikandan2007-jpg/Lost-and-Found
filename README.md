# 🎒 Campus Lost & Found Portal

A full-stack web application where college students can post lost and found items, search, filter, and connect to reclaim their belongings.

---

## ✨ Features

- 📝 **Create Posts** — Report lost or found items with image upload
- 🔍 **Search & Filter** — Search by keyword; filter by category, type, status
- 📋 **Browse** — Responsive grid of all posts with pagination
- 📄 **Post Details** — View full item details with contact info
- ✏️ **Edit Posts** — Update any post details or image
- 🗑️ **Delete Posts** — Remove posts with confirmation dialog
- ✅ **Mark Resolved** — Mark items as claimed/returned
- 📊 **Dashboard Stats** — Live total, lost, found, resolved counts
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🖼️ **Image Upload** — Upload and preview item photos (up to 5MB)
- 🔔 **Toast Notifications** — Instant feedback for all actions

---

## 🛠️ Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Frontend  | React.js + Vite + Tailwind CSS         |
| Routing   | React Router DOM                       |
| HTTP      | Axios                                  |
| Icons     | Lucide React                           |
| Toasts    | React Hot Toast                        |
| Backend   | Node.js + Express.js                   |
| Database  | MongoDB + Mongoose ODM                 |
| Uploads   | Multer                                 |
| Env       | dotenv                                 |

---

## 📁 Project Structure

```
lost-and-found/
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       ├── services/api.js  # Axios API client
│       ├── hooks/usePosts.js
│       ├── App.jsx
│       └── index.css
├── backend/
│   ├── controllers/         # Business logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes + multer
│   ├── middleware/          # Error handler
│   ├── uploads/             # Stored images
│   └── server.js
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or later: https://nodejs.org
- **MongoDB** running locally (or MongoDB Atlas)
- **Git** (optional)

### 1. Start MongoDB

Make sure MongoDB is running locally:
```bash
# Windows (if installed as service, it auto-starts)
# Or start manually:
mongod --dbpath C:\data\db
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/lost_and_found
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
📦 Database: lost_and_found
🚀 Server running on port 5000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

The `.env` is already configured:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

---

## 🌐 URLs

| Service    | URL                                      |
|------------|------------------------------------------|
| Frontend   | http://localhost:5173                    |
| Backend API| http://localhost:5000/api                |
| MongoDB    | mongodb://localhost:27017/lost_and_found |

---

## 📡 API Endpoints

| Method | Endpoint                   | Description           |
|--------|----------------------------|-----------------------|
| GET    | /api/posts                 | Get all posts (with search/filter/pagination) |
| GET    | /api/posts/stats           | Get statistics        |
| GET    | /api/posts/:id             | Get single post       |
| POST   | /api/posts                 | Create new post       |
| PUT    | /api/posts/:id             | Update post           |
| PATCH  | /api/posts/:id/resolve     | Mark as resolved      |
| DELETE | /api/posts/:id             | Delete post           |

### Query Parameters for GET /api/posts

| Param    | Example values              |
|----------|-----------------------------|
| search   | `?search=laptop`            |
| category | `?category=Electronics`     |
| type     | `?type=Lost`                |
| status   | `?status=Active`            |
| sort     | `?sort=newest` or `oldest`  |
| page     | `?page=2`                   |
| limit    | `?limit=12`                 |

---

## 🗄️ MongoDB

- **Database:** `lost_and_found`
- **Collection:** `posts`
- View via **MongoDB Compass**: Connect to `mongodb://localhost:27017`

---

## 📝 License

MIT
