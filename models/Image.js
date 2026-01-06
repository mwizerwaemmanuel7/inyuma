const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: { 
    type: String, 
    required: true,
    default: 'https://huta-nine.vercel.app/Formular.JPG' // Set default image
  },
  description: { type: String, required: true },
  link: { type: String, required: true },
  categories: [{ type: String, required: true }],
  paragraph: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
