# NTU BuyME

A peer-to-peer delivery marketplace built for NTU students.

UberEats and FoodPanda can't deliver inside campus — so we built BuyME. Busy students who don't have time to leave campus can post delivery requests for off-campus restaurants. Meanwhile, students with free time between classes can pick up tasks and earn extra money during gaps in their schedule. Chat in real-time to coordinate, then pay instantly via bank transfer QR code.

## Demo

https://youtu.be/WKg2YewF5cQ

## Features

- **Task Marketplace** — Post or browse delivery tasks with restaurant, fee, and delivery time window
- **Real-time Chat** — Instant messaging between requester and deliverer once a task is accepted
- **Payment QR Codes** — Generate Taiwan bank transfer QR codes for seamless payment
- **Account Management** — Manage profile and bank account settings

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
yarn
cd frontend && yarn
cd ../backend && yarn
```

### Configuration

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

## License

MIT
