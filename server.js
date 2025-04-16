const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 5050;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the 'public' folder

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rushitha123',
  database: 'incident_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to the MySQL database');
});

// =================== INCIDENT API ====================

// Get all incidents
app.get('/api/incidents', (req, res) => {
  db.query('SELECT * FROM incidents', (err, results) => {
    if (err) {
      console.error("❌ GET /api/incidents error:", err);
      return res.status(500).json({ error: 'Failed to fetch incidents' });
    }
    res.json(results);
  });
});

// Add an incident
app.post('/api/incidents', (req, res) => {
  const { title, description, severity } = req.body;
  if (!title || !description || !severity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO incidents (title, description, severity) VALUES (?, ?, ?)';
  db.query(query, [title, description, severity], (err, result) => {
    if (err) {
      console.error("❌ POST /api/incidents error:", err);
      return res.status(500).json({ error: 'Failed to add incident' });
    }
    res.json({ message: '✅ Incident added successfully' });
  });
});

// Update an incident
app.put('/api/incidents/:id', (req, res) => {
  const { title, description, severity } = req.body;
  const { id } = req.params;

  const query = 'UPDATE incidents SET title = ?, description = ?, severity = ? WHERE id = ?';
  db.query(query, [title, description, severity, id], (err, result) => {
    if (err) {
      console.error("❌ PUT /api/incidents/:id error:", err);
      return res.status(500).json({ error: 'Failed to update incident' });
    }
    res.json({ message: '✅ Incident updated successfully' });
  });
});

// Delete an incident
app.delete('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM incidents WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ DELETE /api/incidents/:id error:", err);
      return res.status(500).json({ error: 'Failed to delete incident' });
    }
    res.json({ message: '✅ Incident deleted successfully' });
  });
});

// =================== OPENAI CHATBOT ENDPOINT ====================

app.post('/api/openai-chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiAPIKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const chatbotResponse = response.data.choices[0].message.content.trim();
    res.json({ response: chatbotResponse });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error?.response?.data || error?.message, error?.response?.status);
    res.status(500).json({ error: 'Failed to generate response from OpenAI' });
  }
});

// Serve the dashboard.html page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
