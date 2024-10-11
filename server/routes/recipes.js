const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Adjust the path if needed

// Add this test route at the top of the file
router.get('/test', (req, res) => {
  res.json({ message: 'Recipe route is working' });
});

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
  console.log('Search route hit with query:', req.query);
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    console.log('Searching for:', q);

    const recipes = await Recipe.find({
      $or: [
        { recipe_name: { $regex: q, $options: 'i' } },
        { ingredients: { $regex: q, $options: 'i' } },
        { instructions: { $regex: q, $options: 'i' } }
      ]
    }).limit(20); // Limit to 20 results for performance

    console.log(`Found ${recipes.length} recipes matching "${q}"`);
    
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: 'No recipes found matching the search term' });
    }
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

// New route for fetching all recipes
router.get('/all', async (req, res) => {
  try {
    const recipes = await Recipe.find().limit(10); // Limit to 10 for safety
    console.log(`Found ${recipes.length} recipes`);
    console.log('Recipes:', JSON.stringify(recipes, null, 2));
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

module.exports = router;
