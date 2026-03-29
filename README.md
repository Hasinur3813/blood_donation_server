# Blood Donation App Backend

A complete Node.js + Express + MongoDB/Mongoose backend boilerplate for a Blood Donation application.

## Features

- **Authentication**: JWT-based auth (Register, Login, Logout, Current User).
- **Users**: Profile management, availability toggle, search nearby donors.
- **Donation Requests**: Create, Read (with filters), Update status, Delete.
- **Donations**: Log donations, donor history, admin view of all donations.
- **Notifications**: User notifications for requests and matches.
- **Security**: Helmet for headers, CORS enabled, Bcrypt for password hashing.
- **Error Handling**: Global error middleware and async error handling.

## Project Structure

```text
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Route controllers
├── middleware/            # Custom middlewares (auth, error, role)
├── models/                # Mongoose models
├── routes/                # API routes
├── utils/                 # Utility functions & Seed script
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── server.js              # Entry point
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Update the `.env` file with your MongoDB URI and JWT Secret.

3. **Seed Sample Data**:
   ```bash
   npm run seed
   ```

4. **Start the Server**:
   - For development: `npm run dev`
   - For production: `npm start`

## API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Private)
- `POST /api/auth/logout` - Logout (Private)

### Users
- `GET /api/users/profile/:id` - Get user profile (Private)
- `PUT /api/users/profile` - Update profile (Private)
- `PATCH /api/users/toggle-availability` - Toggle availability (Donor/Admin)
- `GET /api/users/nearby-donors` - Search donors by bloodType/location (Private)

### Donation Requests
- `POST /api/requests` - Create request (Private)
- `GET /api/requests` - Get all requests (Private, supports query filters)
- `GET /api/requests/:id` - Get request details (Private)
- `PATCH /api/requests/:id/status` - Update request status (Owner/Admin)
- `DELETE /api/requests/:id` - Delete request (Owner/Admin)

### Donations
- `POST /api/donations` - Log a donation (Donor/Admin)
- `GET /api/donations/my-history` - Get donor history (Donor)
- `GET /api/donations` - Get all donations (Admin)

### Notifications
- `GET /api/notifications` - Get all notifications (Private)
- `PATCH /api/notifications/:id/read` - Mark as read (Private)
- `DELETE /api/notifications/:id` - Delete notification (Private)

## Tech Stack
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js
- Express Validator
- Morgan (Logging)
- Helmet (Security)
- CORS
