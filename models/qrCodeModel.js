const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  qrCodeImage: {type: String, required:true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
