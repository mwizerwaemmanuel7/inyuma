const express = require('express');
const router = express.Router();
const Image = require('../models/Image');

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

// POST a new image - Always uses the fixed image URL
router.post('/', async (req, res) => {
  try {
    const { description, link, categories, paragraph } = req.body;
    
    // Process categories from comma-separated string to array
    const categoriesArray = categories ? 
      categories.split(',').map(cat => cat.trim()) : 
      [];
    
    // Always use the fixed image URL
    const newImage = new Image({
      imageUrl: 'https://huta-nine.vercel.app/Formular.JPG',
      description,
      link,
      categories: categoriesArray,
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

// UPDATE (edit) an image by ID - Always maintains the fixed image URL
router.put('/:id', async (req, res) => {
  try {
    const { description, link, categories, paragraph } = req.body;
    
    // Process categories if provided
    const categoriesArray = categories ? 
      categories.split(',').map(cat => cat.trim()) : 
      undefined;
    
    // Build update object
    const updateData = {
      // Always keep the fixed image URL
      imageUrl: 'https://huta-nine.vercel.app/Formular.JPG',
      description,
      link,
      paragraph
    };
    
    // Only update categories if provided
    if (categoriesArray !== undefined) {
      updateData.categories = categoriesArray;
    }
    
    const updated = await Image.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return the updated document
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
