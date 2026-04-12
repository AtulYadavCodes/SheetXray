# SheetXray Backend

<p>
  <img src="https://img.shields.io/badge/Status-Active%20Development-2ea44f" alt="status" />
  <img src="https://img.shields.io/badge/API-Express%205-0b7285" alt="express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-1b5e20" alt="mongodb" />
  <img src="https://img.shields.io/badge/Cache-Redis-d9480f" alt="redis" />
</p>

## What This Project Is About

**SheetXray** is a backend service for a **RAG-style spreadsheet assistant** that works with uploaded Excel/Sheet-like documents.

The idea is:

- Users upload sheet files.
- Files are organized inside folders.
- The backend stores file metadata and access control per user.
- This foundation supports building a conversational layer where users can ask questions over their sheet data (RAG workflow).

> Current codebase already supports auth, folder management, and sheet upload/storage. Chat/query endpoints are not yet exposed in the current routes.

---

## Current Functionalities

- 👤 User registration with avatar upload (Cloudinary)
- 🔐 JWT-based authentication (access + refresh token)
- 🚪 Login/logout flow with secure cookies
- 🧯 Redis-backed login rate limiting
- 🗂️ Folder creation, listing, deletion
- 📄 Upload sheet files (multer + Cloudinary)
- 🧩 Map uploaded sheets to optional folders
- 🛡️ Protected routes via JWT middleware

---

## Base API Prefix

All routes are mounted under:

`/api/v1`

Example:

`POST /api/v1/users/login`

---

## 🟢 Non-Secured Routes (No JWT Required)

| Emoji | Method | Endpoint                           | Description                                     | Security                                                         |
| ----- | ------ | ---------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| 📝    | POST   | `/api/v1/users/register`           | Register a new user with avatar upload          | ![Public](https://img.shields.io/badge/Public-Non--Secured-blue) |
| 🔓    | POST   | `/api/v1/users/login`              | Login user and issue access/refresh tokens      | ![Public](https://img.shields.io/badge/Public-Non--Secured-blue) |
| ♻️    | POST   | `/api/v1/users/refreshAccessToken` | Refresh access token using refresh token cookie | ![Public](https://img.shields.io/badge/Public-Non--Secured-blue) |

---

## 🔒 Secured Routes (JWT Required)

| Emoji | Method | Endpoint                                         | Description                       | Security                                                         |
| ----- | ------ | ------------------------------------------------ | --------------------------------- | ---------------------------------------------------------------- |
| 🚪    | POST   | `/api/v1/users/logout`                           | Logout current user               | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 🙍    | GET    | `/api/v1/users/profile`                          | Get logged-in user profile        | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 🖼️    | PATCH  | `/api/v1/users/updateprofileavatar`              | Update user avatar                | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 🔑    | POST   | `/api/v1/users/updatepassword`                   | Update user password              | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 📧    | PATCH  | `/api/v1/users/updateemail`                      | Update user email                 | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 📁    | POST   | `/api/v1/folders/createfolder`                   | Create a folder for current user  | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 📚    | GET    | `/api/v1/folders/getalluserfolders`              | List all folders for current user | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 🗑️    | DELETE | `/api/v1/folders/deletefolder/:folderid`         | Delete folder and related sheets  | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| 🧾    | GET    | `/api/v1/folders/getallsheetsinfolder/:folderid` | List all sheets in a folder       | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |
| ⬆️    | POST   | `/api/v1/sheets/uploadsheet/:folderid?`          | Upload a sheet (folder optional)  | ![Protected](https://img.shields.io/badge/Protected-Secured-red) |

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis (ioredis)
- Multer for multipart uploads
- Cloudinary for file/media storage
- JWT + cookie-parser for auth

---

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start Redis (Docker compose file included):

```bash
docker compose up -d
```

3. Create `.env` in project root and configure at least:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_access_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

4. Run server:

```bash
npm start
```

---

## Next Milestone (RAG Layer)

To complete the sheet-chat vision, next backend additions can include:

- Sheet parser + chunking pipeline
- Embedding generation and vector storage
- Retrieval endpoint for semantic context
- Chat/query endpoint with grounded responses from uploaded sheets
