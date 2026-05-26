# NTU BuyME

A peer-to-peer delivery task marketplace for NTU students. Post delivery requests for food from off-campus restaurants, accept tasks from other students, chat in real-time, and pay via bank transfer QR codes.

## Features

- **Task Marketplace** — Browse, create, and accept delivery tasks with configurable fees and time windows
- **Real-time Chat** — WebSocket-based messaging between task requester and fulfiller
- **Payment QR Codes** — Generate Taiwan bank transfer QR codes for easy payment
- **Account Management** — Profile settings and bank account configuration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Ant Design, Styled-components |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Real-time | WebSocket |
| Deployment | Docker, Railway |

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB instance (local or cloud)

### Installation

```bash
# Install all dependencies
yarn
cd frontend && yarn
cd ../backend && yarn
```

### Configuration

Create `backend/.env` based on the example:

```bash
cp backend/.env.example backend/.env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `PORT` | API server port (default: 4000) |

Optionally create `frontend/.env` for local development:

```
REACT_APP_WS_URL=ws://localhost:8080
```

### Running Locally

```bash
# Start backend (port 4000 + WebSocket on 8080)
yarn server

# Start frontend (port 3000)
yarn start
```

## Project Structure

```
NTUBuyME/
├── frontend/
│   └── src/
│       ├── pages/          # Login, Register, BuyMe, MyTasks, Chat, Transfer, Account
│       ├── containers/     # NavBar, modals, shared components
│       ├── UseApp.js       # Global context + WebSocket client
│       └── api.js          # Axios instance with auth interceptor
├── backend/
│   └── src/
│       ├── server.js       # Express + MongoDB + WebSocket setup
│       ├── models/         # Mongoose schemas (User, Task, Message, ChatBox)
│       ├── routes/         # API endpoints
│       ├── middleware/     # Auth (JWT) and validation
│       └── utils/          # Helpers (task status machine)
└── Dockerfile
```

## API Overview

### Public
- `POST /api/login` — Authenticate and receive JWT
- `POST /api/register` — Create account and receive JWT

### Protected (requires `Authorization: Bearer <token>`)
- `GET /api/account` — Get user profile
- `POST /api/createTask` — Create a delivery task
- `POST /api/acceptTask` — Accept an open task
- `GET /api/allTasksByDueStart` — Browse tasks sorted by due date
- `GET /api/getChat` — Get chat rooms
- `GET /api/qrcode` — Generate payment QR code

## License

MIT
