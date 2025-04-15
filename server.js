const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rushitha123', // Change if you have a password
  database: 'incident_db',
};

let db;
(async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL Database');
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
  }
})();

// Incident Management APIs
// Get all incidents
app.get('/api/incidents', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM incidents');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add incident
app.post('/api/incidents', async (req, res) => {
  const { title, description, severity } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO incidents (title, description, severity) VALUES (?, ?, ?)',
      [title, description, severity]
    );
    res.json({ message: 'Incident added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update incident
app.put('/api/incidents/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, severity } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE incidents SET title = ?, description = ?, severity = ? WHERE id = ?',
      [title, description, severity, id]
    );
    res.json({ message: 'Incident updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete incident
app.delete('/api/incidents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM incidents WHERE id = ?', [id]);
    res.json({ message: 'Incident deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chatbot API
app.post('/api/chatbot', (req, res) => {
  const userMessage = req.body.message; // The message sent by the user

  // Simple logic for chatbot responses (you can replace this with an AI model or more complex logic)
  let botResponse = 'I didn\'t quite understand that. Could you try again?';
  if (userMessage.toLowerCase().includes('incident')) {
    botResponse = 'I can help with incidents. What would you like to know?';
  } else if (userMessage.toLowerCase().includes('dashboard')) {
    botResponse = 'The dashboard shows the incident statistics, and you can filter incidents by severity.';
  }

  res.json({ message: botResponse });
});

// Start the server
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
