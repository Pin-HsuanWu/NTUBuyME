# NTUBuyME Refactor Plan

## High Priority (Security)

### 1. ~~Move password hashing to backend~~ ✅
- PR: #3 (merged)

### 2. ~~Add JWT authentication~~ ✅
- PR: #4

### 3. Environment variable management
- Confirm `.env` is in `.gitignore`
- Never commit MongoDB connection strings or JWT secrets
- Add `.env.example` with placeholder values for documentation

---

## Medium Priority (Architecture & Maintainability)

### 4. WebSocket reconnection
- Current: raw WebSocket with no reconnect logic
- Problem: network hiccup kills the chat connection permanently
- Solution: add reconnect with exponential backoff, or switch to `socket.io`

### 5. Frontend state management
- Current: single global React Context (`UseApp.js`)
- Problem: all state in one context causes unnecessary re-renders as app grows
- Solution: split into multiple contexts (auth, chat, tasks) or use Zustand

### 6. Unified API error handling
- Backend: add a global error handler middleware
- Frontend: use axios interceptor for consistent error display (partially done with 401 handling in JWT PR)

### 7. Input validation
- Add `express-validator` or `zod` on backend routes
- Validate all user input before it touches the database
- Prevent injection and malformed data

---

## Low Priority (Quality & UX)

### 8. Task status machine
- Define explicit states: `open → accepted → completed / cancelled`
- Backend should enforce valid state transitions
- Reject illegal transitions (e.g. `completed → open`)

### 9. Pagination & search
- Current: frontend loads all tasks at once
- Solution: cursor-based pagination on backend, infinite scroll on frontend
- Add search/filter by restaurant name or task content

### 10. TypeScript migration
- Reduces runtime bugs, especially around model ↔ API type mismatches
- Can migrate incrementally (one file at a time, `allowJs: true`)

### 11. Testing
- Add API integration tests with Jest + Supertest
- Cover: login, register, create task, accept task, change password
- Add frontend component tests for critical flows

---

## Quick Wins (Minimal Effort, High Impact)

| Task | Estimate | Impact |
|------|----------|--------|
| Add `.env` to `.gitignore` + create `.env.example` | 10min | Prevent secret leaks |
| WebSocket reconnect logic | 1hr | Chat stability |
| Global error handler middleware | 30min | Consistent error responses |
| Input validation on register/login | 1hr | Prevent malformed data |
