const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single image by ID
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new image by URL (old way, still works)
router.post('/', async (req, res) => {
  try {
    const { imageUrl, description, link, categories, paragraph } = req.body;
    const newImage = new Image({
      imageUrl,
      description,
      link,
      categories,
      paragraph
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST upload image file (new way)
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { description, link, categories, paragraph } = req.body;
    // Use your real domain name here!
    const imageUrl = `https://news.movandikafilsm.fun/uploads/${req.file.filename}`;
    const newImage = new Image({
      imageUrl,
      description,
      link,
      categories: categories.split(',').map(cat => cat.trim()),
      paragraph
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE an image by ID
router.delete('/:id', async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (edit) an image by ID
router.put('/:id', async (req, res) => {
  try {
    const { imageUrl, description, link, categories, paragraph } = req.body;
    const updated = await Image.findByIdAndUpdate(
      req.params.id,
      { imageUrl, description, link, categories, paragraph },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;