const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import modules
const connectDB = require('./config/db');
const registerRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api', registerRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
