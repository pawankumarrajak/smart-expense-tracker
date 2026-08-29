# Smart Expense Tracker

A full-stack expense management application built with **React, Node.js, Express, and MongoDB**. Smart Expense Tracker helps users record, manage, analyze, and monitor their expenses through a clean and responsive dashboard.

## 🚀 Live Project

**Frontend:** Add your deployed frontend URL here

**Backend API:** Add your deployed backend URL here

## ✨ Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 💰 Add and manage expenses
* ✏️ Edit existing expenses
* 🗑️ Delete expenses
* 🔎 Search expenses
* 🏷️ Filter expenses by category
* ↕️ Sort expenses by date and amount
* 📊 Spending analytics
* 📈 Monthly spending insights
* 💵 INR currency formatting
* 🌍 Currency conversion
* 🛡️ Protected expense APIs
* 🚦 API rate limiting
* 🔒 Security headers with Helmet
* ⚠️ Centralized API error handling
* 📱 Responsive dashboard interface

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Recharts
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Axios
* Helmet
* express-rate-limit
* CORS

### External Service

* ExchangeRate-API for currency conversion

## 📂 Project Structure

```text
smart-expense-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/pawankumarrajak/smart-expense-tracker.git
cd smart-expense-tracker
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Configure frontend environment

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

### 5. Configure backend environment

Create:

```text
server/.env
```

Add the required environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EXCHANGE_API_KEY=your_exchange_api_key
NODE_ENV=development
```

**Never commit `.env` files or secret keys to GitHub.**

### 6. Start the backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 7. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 🔌 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Expenses

Protected routes requiring a valid JWT:

```text
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

### Currency

```text
GET /api/currency/convert
```

### Health Check

```text
GET /api/health
```

## 🔐 Security

The backend includes several production-oriented security measures:

* JWT authentication
* Password hashing with bcrypt
* Protected expense routes
* Helmet security headers
* CORS configuration
* Request body size limitation
* Authentication rate limiting
* Currency API rate limiting
* Centralized error handling
* Input validation
* Environment-based secret management

## 📊 Analytics

The dashboard provides:

* Total spending
* Number of transactions
* Average expense
* Highest expense
* Current-month spending
* Spending by category
* Monthly spending trends
* Top spending categories

## 🧪 Testing

The application has been manually verified for:

* User authentication
* Protected API access
* Expense creation
* Expense retrieval
* Expense editing
* Expense deletion
* Expense validation
* Currency conversion
* Dashboard analytics
* Monthly spending calculations
* Error handling

Frontend production build:

```bash
npm run build
```

## 🚀 Deployment

The application is designed to be deployed as separate frontend and backend services.

### Frontend

The React/Vite application can be deployed using a static hosting platform.

### Backend

The Node.js/Express API can be deployed using a Node-compatible hosting platform.

### Database

MongoDB is used for persistent expense and user data storage.

## 📌 Environment Variables

### Frontend

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

### Backend

| Variable           | Description                    |
| ------------------ | ------------------------------ |
| `PORT`             | Server port                    |
| `MONGODB_URI`      | MongoDB connection string      |
| `JWT_SECRET`       | Secret used to sign JWT tokens |
| `EXCHANGE_API_KEY` | ExchangeRate-API key           |
| `NODE_ENV`         | Application environment        |

## 🎯 Project Goals

Smart Expense Tracker was developed to provide a practical full-stack application demonstrating:

* Frontend development with React
* REST API development with Express
* MongoDB database integration
* Authentication and authorization
* API security
* Data visualization
* Production-oriented application structure
* Full-stack deployment

## 👨‍💻 Author

**Pawan Kumar Rajak**

GitHub:
https://github.com/pawankumarrajak

## 📄 License

This project is currently available for educational and portfolio purposes.
