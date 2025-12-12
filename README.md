# Sweet Shop Management System (MERN, TDD)

Backend for a Sweet Shop Management System built with Node.js, Express, MongoDB, and Mongoose, following Test-Driven Development (TDD) using Jest and Supertest.

This service provides authentication, role-based access control, sweets management, search, and inventory (purchase/restock) operations.

---

## Features

- User registration and login with JWT authentication
- Roles: `customer` and `admin` with middleware-based access control
- Sweets:
  - Create, list, search, update, and delete sweets
  - Admin-only for create/update/delete
- Inventory:
  - Purchase sweets (decrease quantity, validate stock)
  - Restock sweets (admin-only, increase quantity)
- Testing:
  - Jest unit tests and Supertest HTTP integration tests
- Tooling:
  - Seed script for admin + sample sweets
  - Coverage script with Jest coverage report

---

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express
- **Database:** MongoDB (Atlas) with Mongoose
- **Auth:** JWT (`jsonwebtoken`), password hashing with `bcryptjs`
- **Testing:** Jest, Supertest
- **Env Management:** dotenv

---

## Getting Started

### 1. Prerequisites

- Node.js (LTS)
- MongoDB Atlas (or any MongoDB instance)

### 2. Installation

git clone https://github.com/umar7shaikh/Sweet-Shop-Management-System.git
cd sweet-shop-management-system
npm install

text

### 3. Environment variables

Create a `.env` file in the project root:

PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/sweet_shop_db?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb+srv://<user>:<password>@<cluster>/sweet_shop_testdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here

text

- `MONGODB_URI` is used for dev and seeding.
- `MONGODB_TEST_URI` is used in tests so test data is isolated from dev data.

---

## Running the backend

Development:

npm run dev

text

Production-style start:

npm start

text

Health check:

GET /api/health

text

Response:

{ "status": "ok", "service": "sweet-shop-api" }

text

---

## Database seeding

Seed the dev database with:

- One admin user: `admin@sweets.com` / `AdminPass123!`
- Three sample sweets

Run:

npm run seed

text

This uses `MONGODB_URI`, clears `users` and `sweets`, inserts the admin and sample sweets, and closes the connection.

---

## Testing and coverage

Run all tests:

npm test

text

Run with coverage:

npm run test:coverage

text

This generates a coverage report in the console and writes a `coverage/` folder (you can screenshot this for your test report).

---

## API Endpoints

### Auth

Base path: `/api/auth`

- `POST /api/auth/register`  
  - Body: `{ "name": string, "email": string, "password": string }`  
  - Response: `{ "user": { "id", "name", "email", "role" } }`

- `POST /api/auth/login`  
  - Body: `{ "email": string, "password": string }`  
  - Response: `{ "token": string, "user": { "id", "name", "email", "role" } }`

Use the token as:

Authorization: Bearer <jwt-token>

text

### Sweets

Base path: `/api/sweets`

- `POST /api/sweets` (admin only)  
  - Create a new sweet.

- `GET /api/sweets` (authenticated)  
  - List all sweets.

- `GET /api/sweets/search` (authenticated)  
  - Query parameters: `name`, `category`, `minPrice`, `maxPrice`  
  - Example: `/api/sweets/search?name=Barfi&category=Special&minPrice=150`

- `PUT /api/sweets/:id` (admin only)  
  - Update sweet fields.

- `DELETE /api/sweets/:id` (admin only)  
  - Delete a sweet.

### Inventory

- `POST /api/sweets/:id/purchase` (authenticated)
  - Body: `{ "amount": number }`
  - Decreases quantity if stock is sufficient.

- `POST /api/sweets/:id/restock` (admin only)
  - Body: `{ "amount": number }`
  - Increases quantity.

---

## Project Structure
```
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── user.model.js
│   └── sweet.model.js
├── routes/
│   ├── auth.routes.js
│   └── sweet.routes.js
├── services/
│   ├── authService.js
│   ├── sweetService.js
│   └── inventoryService.js
└── validation/
    └── sweetValidation.js

scripts/
└── seed.js

tests/
├── health.test.js
├── authRegister.test.js
├── authLogin.test.js
├── authRoutes.test.js
├── authMiddleware.test.js
├── sweetValidation.test.js
├── sweetService.test.js
├── sweetUpdateDelete.test.js
├── sweetRoutes.test.js
└── inventoryService.test.js

jest.config.mjs
```

## My AI Usage

This project follows the kata’s requirement to use AI tools transparently.

### Tools used

- **ChatGPT/Claude** (via Perplexity)
- **(Optional, if true)** GitHub Copilot inside the editor for inline suggestions

### How AI was used

- **Planning & architecture**
  - Helped outline the backend structure (models, services, routes, middleware, tests).
  - Helped refine the endpoint list to match the Sweet Shop Management System specification.

- **Boilerplate & setup**
  - Assisted with Express app setup (middlewares, `/api/health`), Jest + Supertest configuration, and handling ESM + Jest (`--experimental-vm-modules`, `jest.config.mjs`).
  - Suggested initial shapes for the `User` and `Sweet` Mongoose models, then these were adapted to the project.

- **TDD workflow**
  - Helped brainstorm test cases for:
    - `validateSweetInput`
    - Auth services and routes (register/login)
    - Sweet service + routes (create/list/search/update/delete)
    - Inventory service + routes (purchase/restock)
    - Auth middleware (JWT + roles)
  - Tests were written and then used to drive the implementation.

- **Debugging & refinement**
  - Assisted in resolving ESM/Jest issues like `"Cannot use import statement outside a module"`.

### Reflection on AI impact

- AI sped up setup and reduced time spent on boilerplate and configuration, especially around Jest + ESM and seeding scripts.
- Suggestions were treated as starting points; code was reviewed, edited, and debugged manually to ensure it matched the kata spec and personal style.
- Using AI to think through tests first supported a consistent Red–Green–Refactor workflow and made it easier to keep high coverage.
- For commits where AI helped significantly, a `Co-authored-by: ChatGPT/Claude <AI@users.noreply.github.com>` trailer was added, along with a short explanation of how AI was involved, to stay transparent while keeping clear ownership of design and implementation decisions.