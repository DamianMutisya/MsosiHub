const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Adjust the path if needed
const mongoose = require('mongoose');

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
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Perform the search in your database
    const recipes = await Recipe.find({ 
      $or: [
        { recipe_name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ]
    }).limit(10);

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'An error occurred while searching for recipes' });
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

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const recipes = await Recipe.find(query);
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let recipe;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      recipe = await Recipe.findById(identifier);
    } else {
      recipe = await Recipe.findOne({ recipe_name: identifier });
    }

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

module.exports = router;
