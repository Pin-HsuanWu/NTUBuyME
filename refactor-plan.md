# NTUBuyME Refactor Plan

## Completed

- [x] Move password hashing to backend (PR #3)
- [x] Add JWT authentication (PR #4)
- [x] WebSocket reconnection with exponential backoff (PR #5)
- [x] Global error handler middleware (PR #6)
- [x] Input validation with express-validator (PR #7)
- [x] Task status machine (PR #8)
- [x] README rewrite (PR #9)
- [x] Secure environment variable management (PR #4)

---

## Critical — Will crash or break in production

### 1. CreateTask missing response
- **File**: `backend/src/routes/task.js:122`
- **Problem**: Handler ends without `res.send()`, frontend hangs
- **Fix**: Add `res.send({ message: 'success' })`

### 2. Remove JWT secret hardcoded fallback
- **File**: `backend/src/middleware/auth.js:3`
- **Problem**: `process.env.JWT_SECRET || 'ntubuyme-secret-key'` — if env var missing in production, tokens become trivially forgeable
- **Fix**: Throw error if `JWT_SECRET` not set (already done on feat branch, verify merged)

### 3. Fix production static file path
- **File**: `backend/src/server.js:44`
- **Problem**: `res.sendFile(...'index.js')` should be `index.html`
- **Fix**: Change to `index.html`

### 4. WebSocket has no authentication
- **File**: `backend/src/server.js:62`
- **Problem**: Any client can connect and join any chat room by name
- **Fix**: Validate JWT on WS connection upgrade, reject unauthorized

### 5. In-memory chat room state
- **File**: `backend/src/wsConnect.js:7` — `const chatBoxes = {}`
- **Problem**: Server restart = all rooms lost; cannot scale to multiple instances
- **Fix**: Move to Redis pub/sub or store active rooms in MongoDB

---

## High Priority — Security & Stability

### 6. CORS unrestricted
- **File**: `backend/src/server.js:19` — `app.use(cors())`
- **Problem**: Allows requests from any origin
- **Fix**: `cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' })`

### 7. Account enumeration via login
- **File**: `backend/src/routes/login.js`
- **Problem**: Different error messages for "user not found" vs "wrong password" allows enumerating valid student IDs
- **Fix**: Return same generic error for both cases

### 8. No rate limiting
- **Problem**: Login, QR code generation, and task creation have no throttling
- **Fix**: Add `express-rate-limit` on sensitive endpoints

### 9. Bank account stored in plaintext
- **Problem**: `User.bankaccount` is unencrypted in MongoDB
- **Fix**: Encrypt at rest or only store last 4 digits for display

### 10. Add MongoDB indexes
- **Problem**: Queries on `status`, `sender`, `receiver`, `due_start` do full collection scans
- **Fix**:
  ```javascript
  TaskSchema.index({ status: 1, due_start: 1 })
  TaskSchema.index({ sender: 1, status: 1 })
  TaskSchema.index({ receiver: 1, status: 1 })
  ```

---

## Medium Priority — Architecture & Maintainability

### 11. Consolidate to single port
- **Problem**: HTTP (4000) and WebSocket (8080) on separate ports; hard to reverse proxy
- **Fix**: Use `ws` on the same HTTP server via upgrade event, or switch to `socket.io`

### 12. Real pagination
- **File**: `backend/src/routes/task.js:11`
- **Problem**: `.limit(maxPageN * nPerPage)` loads too many docs; no `.skip()`
- **Fix**: Cursor-based pagination with `_id > lastSeen` or use `.skip().limit()`

### 13. Frontend state management
- **Problem**: Single global Context + localStorage with no sync mechanism; 401 hard redirect loses React state
- **Fix**: Split contexts (auth, chat, tasks); use React Router navigate instead of `window.location.href`

### 14. Database schema inconsistencies
- `Message.sender` is string, should be ObjectId ref
- `ChatBox.fee` is string, should be Number
- `ChatBox.due_period` is formatted string, should be Date range
- `User.tasks[]` is never used — remove it

### 15. Structured logging
- **Problem**: Only `console.log()` — no log levels, no structured output
- **Fix**: Add Winston or Pino with JSON output

### 16. Dockerfile modernization
- Node 16 is EOL → upgrade to Node 18+
- Add `.dockerignore` (exclude `.git`, `node_modules`)
- Multi-stage build to reduce image size
- Pre-compile backend with `@babel/cli` instead of runtime `babel-node`

### 17. Add refresh token mechanism
- **Problem**: JWT expires in 7 days, no way to renew without re-login
- **Fix**: Issue short-lived access token (15min) + long-lived refresh token (7d) stored in httpOnly cookie

---

## Low Priority — Polish & Scalability

### 18. TypeScript migration
- Reduces runtime bugs, especially model ↔ API type mismatches
- Migrate incrementally (`allowJs: true`)

### 19. Testing
- API integration tests (Jest + Supertest): login, register, create/accept task, change password
- Frontend component tests for critical flows

### 20. Frontend search & filtering
- Add search by restaurant name or task content
- Debounced input with backend query support

### 21. Caching layer
- Redis cache for open tasks list (TTL 30s)
- Reduce MongoDB load on repeated browse requests

### 22. Notification system
- Push notification or email when task is accepted
- Requires async job queue (Bull + Redis)

---

## Quick Reference

| Priority | Items | Key Effort |
|----------|-------|-----------|
| Critical | #1-5 | Fix crashes and data loss |
| High | #6-10 | Security hardening |
| Medium | #11-17 | Architecture improvements |
| Low | #18-22 | Scale and polish |
