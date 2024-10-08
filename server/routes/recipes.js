const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Adjust the path if needed

// Existing routes (if any)...

// New route for fetching ingredients
router.get('/ingredients', async (req, res) => {
  try {
    const { recipeName } = req.query;
    const recipe = await Recipe.findOne({ recipe_name: recipeName });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ ingredients: recipe.ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ message: 'Failed to fetch ingredients' });
  }
});

// Search route
router.get('/search', async (req, res) => {
  console.log('Search route hit');
  try {
    const { q } = req.query;
    console.log('Search query:', q);

    if (!q) {
      console.log('No search query provided');
      return res.status(400).json({ message: 'Search query is required' });
    }

    const recipes = await Recipe.find({ 
      $or: [
        { recipe_name: { $regex: new RegExp(q, 'i') } },
        { ingredients: { $regex: new RegExp(q, 'i') } },
        { instructions: { $regex: new RegExp(q, 'i') } }
      ]
    });

    console.log(`Found ${recipes.length} recipes matching "${q}"`);
    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
});

// New route for testing recipes
router.get('/test', async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const sample = await Recipe.findOne();
    console.log('Total recipes:', count);
    console.log('Sample recipe:', sample);
    res.json({ count, sample });
  } catch (error) {
    console.error('Error in test route:', error);
    res.status(500).json({ message: 'Error in test route', error: error.message });
  }
});

module.exports = router;
