const mongoose = require('mongoose');

// Define the QRCode Schema
const qrCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId for user
    required: true,
    ref: 'User', // Assuming there's a User model to reference
    unique:true,
  },
  userName: {
    type: String,
    required: true,
  },
  qrCodeUrl: {  // This will store the URL returned by Cloudinary
    type: String,
    required: true,
  },
  cloudinaryId: {  // This will store the public ID from Cloudinary (used to delete or manage images)
    type: String,
    required: true,
  },
}, { timestamps: true });  // Adding timestamps for createdAt and updatedAt

// Create the QRCode model
const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
