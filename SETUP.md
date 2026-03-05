# Setup Guide for Task Manager REST API

## Prerequisites

Before running this project, you need to set up MongoDB for your database.

### Option 1: MongoDB Community Server (Local Installation)

1. **Download and Install MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Select your operating system (Windows, macOS, Linux)
   - Download and run the installer

2. **Start MongoDB**
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: Run `brew services start mongodb-community` (if installed via Homebrew)
   - **Linux**: Run `sudo systemctl start mongod`

3. **Verify Installation**
   ```bash
   mongosh
   ```
   This should open the MongoDB shell.

### Option 2: MongoDB Atlas (Cloud Database) - Recommended

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new project and cluster

2. **Get Connection String**
   - After creating a cluster, click "Connect"
   - Select "Drivers" and copy your connection string
   - It will look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

## Environment Configuration

1. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your MongoDB connection**

   For local MongoDB:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_secret_key_here
   ```

   For MongoDB Atlas:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   ```

3. **Important**: Replace `your_secret_key_here` with a strong secret key

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm run dev
   ```
   The server should start on http://localhost:5000

## Running Tests

Ensure MongoDB is running, then:

```bash
npm test
```

All tests should pass.

## Testing the API Manually

You can test the API using tools like:

- **Postman**: https://www.postman.com/downloads/
- **Thunder Client** (VS Code extension)
- **curl** (command line)

### Example: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

This returns a token.

### Example: Create a Task (requires token)

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

## Troubleshooting

### Tests fail with "MongoDB connection failed"

- Ensure MongoDB is running on your system
- Check that `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted in network settings

### `npm install` fails

- Try deleting `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Server won't start

- Ensure port 5000 is not in use: `netstat -ano | findstr :5000` (Windows)
- Change PORT in `.env` if needed

### JWT token errors

- Ensure `JWT_SECRET` is set in `.env`
- Token expires after 7 days

## Project Structure

```
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   └── routes/
│       ├── authRoutes.js      # Auth endpoints
│       └── taskRoutes.js      # Task endpoints
├── tests/
│   ├── setup.js               # Test setup
│   ├── auth.test.js           # Auth tests
│   └── tasks.test.js          # Task tests
├── .env.example               # Environment variables template
├── jest.config.js             # Jest configuration
├── package.json               # Dependencies
└── README.md                  # Project overview

```

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Returns: User object (without password)

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token }`

### Task Routes (Authenticated)

All task routes require `Authorization: Bearer <token>` header

- `POST /api/tasks` - Create task
  - Body: `{ title, description? }`
  - Returns: Task object

- `GET /api/tasks` - Get all user's tasks
  - Returns: Array of tasks

- `DELETE /api/tasks/:id` - Delete task
  - Returns: `{ message: "Task deleted" }`

## Support

For issues or questions, consult the assignment requirements or contact your instructor.
