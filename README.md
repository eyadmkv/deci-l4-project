# E-Commerce API Engine

## Features

* **Authentication & Authorization:** Secure user registration and login using JWT.

* **Role-Based Access Control:** Restricting deletion to admin only

* **Advanced Security:** Sanitizing text protect from NoSQL injections

* **Robust Error Handling:** Centralized global error handling middleware catching structural errors, Mongoose CastErrors, and validation failures.

* **RESTful Architecture:** Clean separation of concerns using the MVC pattern.

---

## Prerequisites & Installation

Download and setup [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) and make sure they're installed on your machine.

**1. Clone the repository:**
```bash
git clone https://github.com/eyadmkv/deci-l4-project.git
cd deci-l4-project
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up Environment Variables:**
Create a `.env` file in the root directory and configure the variables (see the table below).
(must match the .env.example)

**4. Start the development server:**
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

---

## Environment Variables

You will need to create a `.env` file in the root directory of the project. Here are the required variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Defines the environment | `development` |
| `PORT` | The port the server runs on | `5000` |
| `DATABASE_URI` | Your MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret key for signing tokens | `JWT-TOKEN` |
| `JWT_EXPIRES_IN` | Token expiration timeframe | `90d` |

---

## API Endpoints

### Authentication
* `POST /api/v1/users/signup` - Register a new user.
* `POST /api/v1/users/login` - Authenticate a user and receive a JWT.

### Products
* `GET /api/v1/products` - Get all products (supports advanced filtering, sorting, pagination).
* `GET /api/v1/products/:id` - Get a single product by ID.
* `POST /api/v1/products` - Create a new product *(Protected: Logged-in users)*.
* `PATCH /api/v1/products/:id` - Update a product *(Protected: Logged-in users)*.
* `DELETE /api/v1/products/:id` - Delete a product *(Protected: **Admin only**)*.

*(Note: Categories, Stats, Users, Carts, and Orders follow similar RESTful structures).*

---

## Project Structure

```text
├── controllers/      # Route logic and database interactions
├── middleware/       # Custom middleware (global error handler)
├── models/           # Mongoose schemas (User, Product, Category)
├── routes/           # Express router definitions
├── utils/            # Helper classes (AppError)
├── app.js            # Express app setup and security configuration
├── server.js         # Server initialization and database connection
└── .env              # Environment variables (Ignored by Git)
```