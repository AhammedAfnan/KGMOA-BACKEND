const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  kmc: { type: Number, required: true },
  mobile: { type: Number, required: true },
  regTarrif : { type: String, required: true },
  coDel : { type: Boolean , default: false },
});

module.exports = mongoose.model('user', userSchema);
