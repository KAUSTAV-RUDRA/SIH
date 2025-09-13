const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ollama configuration
const OLLAMA_BASE_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'gemma3:4b';

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

      // Tourist places table
      db.run(`CREATE TABLE IF NOT EXISTS tourist_places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        district TEXT NOT NULL,
        category TEXT,
        image_url TEXT,
        rating REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Districts table for GeoJSON data
      db.run(`CREATE TABLE IF NOT EXISTS districts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        geojson_data TEXT NOT NULL,
        population INTEGER,
        area REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Insert sample tourist places data
      db.run(`INSERT OR IGNORE INTO tourist_places (name, description, latitude, longitude, district, category, rating) VALUES 
        ('Jagannath Temple', 'Ancient temple dedicated to Lord Jagannath', 23.3441, 85.3096, 'Ranchi', 'Religious', 4.5),
        ('Betla National Park', 'Famous wildlife sanctuary with tigers and elephants', 23.9167, 84.1167, 'Palamu', 'Wildlife', 4.3),
        ('Hundru Falls', 'Beautiful waterfall in Ranchi district', 23.4167, 85.3333, 'Ranchi', 'Nature', 4.2),
        ('Dassam Falls', 'Picturesque waterfall near Ranchi', 23.3833, 85.3167, 'Ranchi', 'Nature', 4.1),
        ('Netarhat', 'Hill station known as Queen of Chotanagpur', 23.4833, 84.2667, 'Latehar', 'Hill Station', 4.4),
        ('Deoghar', 'Famous pilgrimage site with Baidyanath Temple', 24.4833, 86.7000, 'Deoghar', 'Religious', 4.6),
        ('Hazaribagh National Park', 'Wildlife sanctuary with diverse flora and fauna', 24.0000, 85.3667, 'Hazaribagh', 'Wildlife', 4.0),
        ('Rajrappa', 'Sacred temple complex with waterfall', 23.6333, 85.7167, 'Ramgarh', 'Religious', 4.2),
        ('Patratu Valley', 'Scenic valley with dam and lake', 23.5500, 85.3167, 'Ramgarh', 'Nature', 3.9),
        ('McCluskieganj', 'Colonial hill station with heritage buildings', 23.6333, 85.3167, 'Ranchi', 'Heritage', 3.8)
      `);

      // Insert sample districts data with basic GeoJSON
      db.run(`INSERT OR IGNORE INTO districts (name, geojson_data, population, area) VALUES 
        ('Ranchi', '{"type": "Feature", "properties": {"name": "Ranchi"}, "geometry": {"type": "Polygon", "coordinates": [[[85.2, 23.2], [85.4, 23.2], [85.4, 23.5], [85.2, 23.5], [85.2, 23.2]]]}}', 2914253, 5097),
        ('Palamu', '{"type": "Feature", "properties": {"name": "Palamu"}, "geometry": {"type": "Polygon", "coordinates": [[[83.8, 23.6], [84.4, 23.6], [84.4, 24.2], [83.8, 24.2], [83.8, 23.6]]]}}', 1939869, 5043),
        ('Latehar', '{"type": "Feature", "properties": {"name": "Latehar"}, "geometry": {"type": "Polygon", "coordinates": [[[84.0, 23.2], [84.6, 23.2], [84.6, 23.8], [84.0, 23.8], [84.0, 23.2]]]}}', 726978, 4291),
        ('Deoghar', '{"type": "Feature", "properties": {"name": "Deoghar"}, "geometry": {"type": "Polygon", "coordinates": [[[86.4, 24.2], [87.0, 24.2], [87.0, 24.8], [86.4, 24.8], [86.4, 24.2]]]}}', 1492073, 2479),
        ('Hazaribagh', '{"type": "Feature", "properties": {"name": "Hazaribagh"}, "geometry": {"type": "Polygon", "coordinates": [[[85.0, 23.6], [85.6, 23.6], [85.6, 24.4], [85.0, 24.4], [85.0, 23.6]]]}}', 1734495, 3555),
        ('Ramgarh', '{"type": "Feature", "properties": {"name": "Ramgarh"}, "geometry": {"type": "Polygon", "coordinates": [[[85.2, 23.4], [85.8, 23.4], [85.8, 23.8], [85.2, 23.8], [85.2, 23.4]]]}}', 949443, 1341)
      `);
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

// Get all tourist places
app.get('/api/tourist-places', (req, res) => {
  db.all('SELECT * FROM tourist_places ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all districts with GeoJSON data
app.get('/api/districts', (req, res) => {
  db.all('SELECT * FROM districts ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Parse GeoJSON data for each district
    const districtsWithGeoJSON = rows.map(row => ({
      ...row,
      geojson_data: JSON.parse(row.geojson_data)
    }));
    res.json(districtsWithGeoJSON);
  });
});

// Create a new tourist place
app.post('/api/tourist-places', (req, res) => {
  const { name, description, latitude, longitude, district, category, image_url, rating } = req.body;
  
  if (!name || !latitude || !longitude || !district) {
    res.status(400).json({ error: 'Name, latitude, longitude, and district are required' });
    return;
  }
  
  db.run('INSERT INTO tourist_places (name, description, latitude, longitude, district, category, image_url, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, description, latitude, longitude, district, category, image_url, rating || 0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description, latitude, longitude, district, category, image_url, rating });
  });
});

// Create a new district
app.post('/api/districts', (req, res) => {
  const { name, geojson_data, population, area } = req.body;
  
  if (!name || !geojson_data) {
    res.status(400).json({ error: 'Name and geojson_data are required' });
    return;
  }
  
  const geojsonString = typeof geojson_data === 'string' ? geojson_data : JSON.stringify(geojson_data);
  
  db.run('INSERT INTO districts (name, geojson_data, population, area) VALUES (?, ?, ?, ?)', 
    [name, geojsonString, population, area], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, geojson_data: JSON.parse(geojsonString), population, area });
  });
});

// Chatbot API endpoint using Ollama
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received chat message:', message);

    // Prepare the request for Ollama
    const ollamaRequest = {
      model: OLLAMA_MODEL,
      prompt: message,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024
      }
    };

    console.log('Sending request to Ollama:', ollamaRequest);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.response;

    console.log('Generated response from Ollama:', responseText);

    res.json({ 
      success: true, 
      response: responseText 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Ollama is not running. Please start Ollama service.';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Cannot connect to Ollama. Please check if Ollama is installed and running.';
    } else if (error.message.includes('model')) {
      errorMessage = 'Model not found. Please check if the model is installed in Ollama.';
    }

    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message 
    });
  }
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
