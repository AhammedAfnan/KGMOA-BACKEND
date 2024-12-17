const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  userName: { type: String, required: true },
  qrCodeImage: {type: String, required:true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
