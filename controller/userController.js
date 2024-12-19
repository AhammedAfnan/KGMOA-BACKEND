const User = require('../models/userModel')

const registerUser = async (req, res) => {
  try {
    const { name, place, kmc, mobile, regTarrif, coDel } = req.body;

    const existingKmc = await User.findOne({ kmc });
    if (existingKmc) {
      return res.status(400).json({ error: 'KMC number already exists' });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }

    const newRegister = new User({ name, place, kmc, mobile, regTarrif, coDel });
    await newRegister.save();

    res.status(201).json({ message: 'Data saved successfully!',userId:newRegister._id});
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { registerUser };
