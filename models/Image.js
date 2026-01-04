const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  categories: [{ type: String, required: true }],
  paragraph: { type: String, default: '' }, // <-- Added this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);