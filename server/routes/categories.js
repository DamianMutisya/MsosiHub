const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

router.get('/', async (req, res) => {
  try {
    const categories = await Recipe.distinct('category');
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

module.exports = router;
