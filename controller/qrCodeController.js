const QRCodeModel = require('../models/qrCodeModel'); // Replace with the correct path to your model
const mongoose = require('mongoose');


// Controller to save QR code details
const saveQRCode = async (req, res) => {
  try {
    const { userId, userName, qrCodeImage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    if (!userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for existing QR code
    const existingQRCode = await QRCodeModel.findOne({ userId });
    if (existingQRCode) {
      return res.status(409).json({ message: 'QR Code already exists' }); // Conflict response
    }

    const newQRCode = new QRCodeModel({ userId, userName, qrCodeImage });
    await newQRCode.save();

    res.status(201).json({ message: 'QR Code saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving QR Code', error: error.message });
  }
};

module.exports = { saveQRCode }