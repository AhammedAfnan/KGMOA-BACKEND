const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  kmc: { type: Number, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  amount : { type: Number, required: true},
  signature: { type: String, required: true },
  status: { type: String, required: true, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
