const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  kmc: { type: Number, required: true },
  mobile: { type: Number, required: true },
  regTarrif: { type: String, required: true },
  coDel: { type: Boolean, default: false },
  paymentMode: {
    type: String,
    required: true,
    enum: ["online", "cash"], // Ensure that paymentMode is either 'online' or 'cash'
  },
  paymentDate: { 
    type: Date, // **Ensure paymentDate is stored as a Date** 
    required: true 
  },
  utrNumberOrCashReceipt: { // **New field added**
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
