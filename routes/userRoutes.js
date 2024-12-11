const express = require('express');
const { registerUser } = require('../controller/userController');

const router = express.Router();

// Route to handle registration
router.post('/register', registerUser);

module.exports = router;
