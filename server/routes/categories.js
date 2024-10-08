const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Adjust the path as necessary

router.get('/', async (req, res) => {
  try {
    const categories = await Recipe.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
