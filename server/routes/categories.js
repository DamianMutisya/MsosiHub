const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching categories...');
    
    const categories = await Recipe.distinct('category').exec();
    console.log('Found categories:', categories);

    if (!categories) {
      return res.json([]);
    }

    res.json(categories || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.json([]);
  }
});

module.exports = router;
