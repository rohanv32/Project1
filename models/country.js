const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Add more fields as needed
});

module.exports = mongoose.model('Country', countrySchema);