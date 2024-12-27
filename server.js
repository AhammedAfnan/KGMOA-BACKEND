const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes')
const volunteerRoutes = require('./routes/volunteerRoutes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://kgmoa.netlify.app/api', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  };

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api',volunteerRoutes)

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
