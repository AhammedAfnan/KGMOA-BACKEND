const Register = require('../models/userModel');

// Controller to handle registration
const registerUser = async (req, res) => {
  try {
    const { name, place, kmc, mobile, fee } = req.body;
    const newRegister = new Register({ name, place, kmc, mobile, fee });
    await newRegister.save();
    res.status(201).json({ message: 'Data saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser };
