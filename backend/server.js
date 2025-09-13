const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    // Create tables if they don't exist
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MERN Stack with SQLite API!' });
});

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, email });
  });
});

// Get all posts
app.get('/api/posts', (req, res) => {
  db.all(`
    SELECT p.*, u.name as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new post
app.post('/api/posts', (req, res) => {
  const { title, content, user_id } = req.body;
  
  if (!title || !user_id) {
    res.status(400).json({ error: 'Title and user_id are required' });
    return;
  }
  
  db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', 
    [title, content, user_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, content, user_id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
