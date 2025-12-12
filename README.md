Sweet Shop Management System (MERN, TDD)
A full-stack Sweet Shop Management System backend built with Node.js, Express, MongoDB, and Mongoose, following Test-Driven Development (TDD) with Jest and Supertest.​

This backend provides authentication, sweets management, search, and inventory operations (purchase and restock) with role-based access control.

Features
User registration and login with JWT authentication.​

Roles: customer and admin with middleware-based checks.​

Sweets management:

Create, list, search, update, and delete sweets (admin-protected for write operations).​

Inventory:

Purchase sweets (decrease stock, validate availability).

Restock sweets (admin only, increase stock).​

TDD workflow:

Jest for unit tests and Supertest for HTTP integration tests.​

Seed script for creating an initial admin user and sample sweets.

Tech Stack
Backend: Node.js, Express, JavaScript (ESM).​

Database: MongoDB (Atlas) with Mongoose ODM.

Auth: JWT (jsonwebtoken) + bcryptjs for password hashing.​

Testing: Jest, Supertest.​

Getting Started
Prerequisites
Node.js (LTS).

MongoDB instance (MongoDB Atlas or local).

npm or yarn.

Installation
Clone the repository and install dependencies:

bash
git clone <your-repo-url>.git
cd sweet-shop-management-system
npm install
Environment Configuration
Create a .env file in the project root:

text
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/sweet_shop_db?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb+srv://<user>:<password>@<cluster>/sweet_shop_testdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
MONGODB_URI is used for dev and seeding.

MONGODB_TEST_URI is used by Jest tests so test data is isolated.

Running the Backend
Development server:

bash
npm run dev
Production-style start:

bash
npm start
Health check:

GET /api/health → { "status": "ok", "service": "sweet-shop-api" }

Database Seeding
Seed the database with:

One admin user: admin@sweets.com / AdminPass123!

Three sample sweets.

Run:

bash
npm run seed
This connects to MONGODB_URI, clears existing users and sweets collections, inserts the admin and sample sweets, and closes the connection.

Testing and Coverage
Run the full test suite:

bash
npm test
Run tests with coverage:

bash
npm run test:coverage
The coverage report is printed in the console and written to the coverage/ folder, showing high coverage across services, routes, middleware, and validation.

API Endpoints
Auth Routes
Base path: /api/auth​

Method	Endpoint	Auth	Description
POST	/api/auth/register	Public	Register new user
POST	/api/auth/login	Public	Login and get JWT token
POST /api/auth/register

Body: { "name": string, "email": string, "password": string }

Response: { "user": { "id", "name", "email", "role" } }

POST /api/auth/login

Body: { "email": string, "password": string }

Response: { "token": string, "user": { "id", "name", "email", "role" } }

Include Authorization: Bearer <token> for protected routes.​

Sweets Routes
Base path: /api/sweets​

Method	Endpoint	Auth	Description
POST	/api/sweets	Admin only	Create new sweet
GET	/api/sweets	Auth	List all sweets
GET	/api/sweets/search	Auth	Search sweets
PUT	/api/sweets/:id	Admin only	Update sweet
DELETE	/api/sweets/:id	Admin only	Delete sweet
POST	/api/sweets/:id/purchase	Auth	Purchase sweet (decrease quantity)
POST	/api/sweets/:id/restock	Admin only	Restock sweet (increase quantity)
Example search:

GET /api/sweets/search?name=Barfi&category=Special&minPrice=150&maxPrice=250

Example purchase:

POST /api/sweets/:id/purchase

Body: { "amount": 2 }

Response: { "sweet": { ... "quantity": newQuantity } }

Example restock:

POST /api/sweets/:id/restock

Body: { "amount": 5 }

Response: { "sweet": { ... "quantity": newQuantity } }​

Project Structure
text
.
├── src
│   ├── app.js
│   ├── server.js
│   ├── config
│   │   └── db.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── user.model.js
│   │   └── sweet.model.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   └── sweet.routes.js
│   ├── services
│   │   ├── authService.js
│   │   ├── sweetService.js
│   │   └── inventoryService.js
│   └── validation
│       └── sweetValidation.js
├── scripts
│   └── seed.js
├── tests
│   ├── health.test.js
│   ├── authRegister.test.js
│   ├── authLogin.test.js
│   ├── authRoutes.test.js
│   ├── authMiddleware.test.js
│   ├── sweetValidation.test.js
│   ├── sweetService.test.js
│   ├── sweetUpdateDelete.test.js
│   ├── sweetRoutes.test.js
│   └── inventoryService.test.js
└── jest.config.mjs
This structure follows common MERN testing and separation-of-concerns practices.​

My AI Usage
This project explicitly follows the kata’s requirement to use AI tools transparently and responsibly.​

Tools used
ChatGPT (OpenAI / Perplexity interface)
Used as a conversational assistant during backend design and implementation.​

(Optional, if true) GitHub Copilot inside the editor for inline suggestions and small code completions.

How AI was used
Architecture & planning

Brainstormed the high-level backend design: separating models, services, routes, middleware, and tests in a TDD-friendly structure.​

Helped refine the list of API endpoints and their responsibilities to match the Sweet Shop Management System kata spec.​

Boilerplate & scaffolding

Assisted in drafting initial Express app setup (middlewares, /api/health endpoint) and Jest/Supertest configuration for ESM (test runner commands and config).​

Suggested example Mongoose schemas for User and Sweet, which were then adapted to the project’s needs.

TDD support (tests first)

Helped outline test cases for:

validateSweetInput helper.

Auth service (registerUser, loginUser) and HTTP routes.

Sweet service (create/list/search/update/delete) and corresponding routes.

Inventory operations (purchase/restock) and their HTTP endpoints.​

Used AI for ideas on structuring integration tests with Jest + Supertest and Mongoose test databases, then adjusted to fit the actual codebase.

Debugging and configuration

Helped diagnose Jest ESM issues (Cannot use import statement outside a module) and refine the combination of "type": "module", jest.config.mjs, and --experimental-vm-modules.

Assisted in resolving path issues between tests/ and src/ (e.g., ensuring imports like ../src/models/user.model.js and ../validation/... were correct).

Refinements and error handling

Suggested patterns for centralized error handling and more explicit inventory logic in the routes (purchase/restock) to make debugging and tests more predictable.​

Provided guidance on shaping commit messages that document AI assistance and follow the kata’s co-authorship format.​

Reflection on AI impact
Productivity boost, especially for setup and edge cases
AI significantly reduced time spent on boilerplate and environment setup (Jest + ESM, test scripts, seeding script, etc.), letting more effort go into business logic and tests.​

Still required careful review and debugging
AI suggestions were treated as drafts, not as final code. Many snippets were adapted, simplified, or corrected (for example, tuning the inventory logic and test imports, and making sure error messages and status codes matched the tests and kata spec).​

Better TDD discipline
Using AI to brainstorm test cases first helped maintain a consistent Red–Green–Refactor cycle, especially for services and routes. This made it easier to avoid regressions as new features (inventory, update/delete) were added.​

Transparency and ownership
For each commit where AI-assisted code or ideas were used, a Co-authored-by: ChatGPT <AI@users.noreply.github.com> line was added together with a short description of how the assistant contributed, while clearly indicating which parts were implemented, verified, and refactored manually. This respects the kata’s AI usage policy while making it clear the final design and code choices were intentional.​