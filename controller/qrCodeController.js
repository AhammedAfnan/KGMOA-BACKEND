const QRCodeModel = require('../models/qrCodeModel'); // Replace with the correct path to your model

// Controller to save QR code details
const saveQRCode = async (req, res) => {
  try {
    const { userName, qrCodeImage } = req.body;

    // Validation (optional)
    if (!userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save QR code details to the database
    const newQRCode = new QRCodeModel({
      userName,
      qrCodeImage,
    });

    await newQRCode.save();

    res.status(201).json({ message: 'QR Code saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving QR Code', error: error.message });
  }
};

module.exports = { saveQRCode }