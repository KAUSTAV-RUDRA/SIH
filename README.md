# MERN Stack Application with SQLite

This is a basic MERN stack application with SQLite as the database instead of MongoDB.

## Project Structure

```
SIH/
├── backend/          # Node.js/Express backend
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── database.sqlite # SQLite database (created automatically)
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx    # Home page with navigation cards
    │   │   ├── PageA.jsx   # Page A (displays "A")
    │   │   ├── PageB.jsx   # Page B (displays "B")
    │   │   └── PageC.jsx   # Page C (displays "C")
    │   ├── App.jsx         # Main App component with routing
    │   └── main.jsx        # React entry point
    ├── index.html          # HTML template
    ├── vite.config.js      # Vite configuration
    └── package.json        # Frontend dependencies
```

## Features

- **Home Page**: Welcome page with 3 navigation cards
- **Page A**: Displays the letter "A"
- **Page B**: Displays the letter "B" 
- **Page C**: Displays the letter "C"
- **Backend API**: RESTful API with SQLite database
- **Responsive Design**: Modern, clean UI with hover effects

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /` - Welcome message
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post

## Technologies Used

### Backend
- Node.js
- Express.js
- SQLite3
- CORS
- dotenv

### Frontend
- React 18
- React Router DOM
- Vite
- CSS3

## Database Schema

The SQLite database includes two tables:

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `email` (TEXT UNIQUE NOT NULL)
- `created_at` (DATETIME)

### Posts Table
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `content` (TEXT)
- `user_id` (INTEGER, FOREIGN KEY)
- `created_at` (DATETIME)

## Usage

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. You'll see the home page with 3 navigation cards
4. Click on any card to navigate to the corresponding page (A, B, or C)
5. Each page displays just the letter as requested
6. Use the "Back to Home" link or navigation menu to return to the home page
