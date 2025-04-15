const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 5050;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files (optional, if you need to serve any static assets like HTML, CSS, etc.)
app.use(express.static('public'));

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Use API key from .env file
});
const openai = new OpenAIApi(configuration);

// Serve the chatbot response endpoint
app.post('/api/chatbot', async (req, res) => {
  const userMessage = req.body.message; // The message sent by the user

  try {
    // Call OpenAI API with userMessage
    const response = await openai.createCompletion({
      model: 'text-davinci-003',  // You can also use other models like 'gpt-3.5-turbo'
      prompt: `The user asked: "${userMessage}". Provide a helpful response for incidents and system management. Respond with relevant information based on the message.`,
      max_tokens: 150
    });

    // Send the response from OpenAI back to the frontend
    res.json({ message: response.data.choices[0].text.trim() });

  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ message: 'Error processing your request.' });
  }
});

// Route to get all incidents (sample API)
app.get('/api/incidents', (req, res) => {
  const incidents = [
    { id: 1, title: 'Incident 1', description: 'Description 1', severity: 'High' },
    { id: 2, title: 'Incident 2', description: 'Description 2', severity: 'Medium' },
    { id: 3, title: 'Incident 3', description: 'Description 3', severity: 'Low' }
  ];
  res.json(incidents);
});

// Route to add a new incident
app.post('/api/incidents', async (req, res) => {
  const { title, description, severity } = req.body;
  try {
    // Your database insertion logic here
    // Example: Save the incident to your database
    res.json({ message: 'Incident added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding incident' });
  }
});

// Route to update an incident
app.put('/api/incidents/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, severity } = req.body;
  try {
    // Your database update logic here
    // Example: Update the incident in your database
    res.json({ message: 'Incident updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating incident' });
  }
});

// Route to delete an incident
app.delete('/api/incidents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Your database deletion logic here
    // Example: Delete the incident from your database
    res.json({ message: 'Incident deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting incident' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
