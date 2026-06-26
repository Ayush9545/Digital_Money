# 🛡️ PayGuard

**PayGuard** is a full-stack digital wallet application built with **React, Node.js, Express, and PostgreSQL**. It allows users to register securely, authenticate using JWT, transfer money between users and view transaction history through a clean and responsive interface.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- Secure Login
- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes

### 💰 Wallet
- Automatic wallet creation on registration
- View current wallet balance
- Display Account Number and User ID

### 💸 Money Transfer
- Transfer money between users
- Balance validation
- Prevent invalid transactions
- Atomic database transactions using PostgreSQL

### 📜 Transaction History
- View recent transactions
- Sent & Received transaction indicators
- Transaction timestamp
- Account information

### 🎨 User Interface
- Modern dark theme
- Responsive layout
- Reusable authentication components
- Custom PayGuard branding

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- CSS3

## Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcryptjs

---

# 📂 Project Structure

```
Money_wallet/
│
├── payguard-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   │
│   └── public/
│
├── routes/
├── middleware/
├── db.js
├── server.js
└── package.json
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/Ayush9545/Digital_Money.git
```

```
cd PayGuard
```

---

## Backend Setup

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

JWT_SECRET=your_secret_key

DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payguard
```

Start the backend

```bash
npm start
```

---

## Frontend Setup

```bash
cd payguard-frontend

npm install

npm run dev
```

---

# 🗄️ Database

The project uses **PostgreSQL**.

Main Tables:

- Users
- Wallets
- Transactions

---

# 🔐 Authentication Flow

1. User registers
2. Password is hashed using bcrypt
3. User logs in
4. JWT token is generated
5. Token stored in Local Storage
6. Protected routes verify JWT
7. Authorized users access dashboard

---

# 💸 Transfer Flow

```
Sender

↓

JWT Verification

↓

Balance Check

↓

PostgreSQL Transaction

↓

Deduct Balance

↓

Add Balance

↓

Create Transaction Record

↓

Commit
```

---

# 📸 Screenshots

### Login Page

<img width="1468" height="826" alt="Screenshot 2026-06-26 at 5 42 59 PM" src="https://github.com/user-attachments/assets/3dfa80ef-47fc-4cba-9630-e7df3088417e" />


### Register Page

<img width="1468" height="826" alt="Screenshot 2026-06-26 at 5 43 46 PM" src="https://github.com/user-attachments/assets/8a2a56f9-5a04-4419-ab71-60e38f8ab543" />


### Dashboard

<img width="1468" height="826" alt="Screenshot 2026-06-26 at 5 44 51 PM" src="https://github.com/user-attachments/assets/3df5f23b-fed3-496b-aa05-bee2c485ff3d" />
<img width="1468" height="826" alt="Screenshot 2026-06-26 at 5 45 10 PM" src="https://github.com/user-attachments/assets/8c957517-8a55-4b12-a329-013670fc4f3d" />


---

# 🎯 Future Improvements

- Account Number based transfers
- Profile page
- Password reset
- Admin dashboard

---

# 👨‍💻 Author

**Ayush Gotefode**

GitHub:
https://github.com/Ayush9545

LinkedIn:
https://www.linkedin.com/in/ayushgotefode/

---

## ⭐ If you found this project helpful, consider giving it a star!
