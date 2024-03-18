// Import required modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware to enable CORS


const mongodbUrl = process.env.MONGODB_URL;
console.log("work"+mongodbUrl)
// Connect to MongoDB database
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define a mongoose schema for storing text input
const InputTextSchema = new mongoose.Schema({
  text: String
});

// Define a mongoose model based on the schema
const InputText = mongoose.model('InputText', InputTextSchema);

// Define a route to handle POST requests to store input text
app.post('/api/inputtext', async (req, res) => {
  try {
    const { text } = req.body;

    // Create a new instance of InputText model
    const inputText = new InputText({ text });

    // Save the input text to MongoDB
    await inputText.save();

    res.status(201).json({ message: 'Input text stored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
