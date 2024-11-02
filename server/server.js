const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');
require('./config/passport'); 
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
});

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://msosi-hub.vercel.app']
    : ['http://localhost:3000', 'https://msosi-hub.vercel.app', 'https://msosihub-fhr2vq3xb-damian-mutisya.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 600 // 10 minutes
};

app.use(cors(corsOptions));

// Add a pre-flight route handler
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/api/categories', require('./routes/categories'));
app.use('/api/recipes', require('./routes/recipes'));


// Update the MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('MongoDB Atlas connection error:', err.message);
  process.exit(1);
});

// Import Recipe model
const Recipe = require('./models/Recipe');

// Function to fetch YouTube video
async function fetchYouTubeVideo(recipeName) {
  console.log('Fetching YouTube video for:', recipeName);
  console.log('YouTube API response:', response.data);
  console.log('YouTube API Key:', process.env.YOUTUBE_API_KEY);
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${recipeName} recipe`,
        key: process.env.YOUTUBE_API_KEY,
        type: 'video',
        maxResults: 1
      }
    });

    if (response.data && response.data.items && response.data.items.length > 0) {
      return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
    } else {
      console.log('No YouTube videos found for:', recipeName);
      return null;
    }
  } catch (error) {
    console.error('Error fetching YouTube video:', error.response ? error.response.data : error.message);
    return null;
  }
}

app.get('/api/test-recipe', async (req, res) => {
  try {
    const recipe = await Recipe.findOne();
    if (recipe) {
      console.log('Test recipe found:', recipe);
      res.json(recipe);
    } else {
      console.log('No recipes found in the database');
      res.status(404).json({ message: 'No recipes found' });
    }
  } catch (error) {
    console.error('Error fetching test recipe:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

app.get('/api/recipes/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    console.log('Searching for:', searchTerm);
    const recipes = await Recipe.find({ 
      $or: [
        { recipe_name: { $regex: new RegExp(searchTerm, 'i') } },
        { ingredients: { $regex: new RegExp(searchTerm, 'i') } },
        { instructions: { $regex: new RegExp(searchTerm, 'i') } }
      ]
    });
    console.log('Found recipes:', recipes.length);
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: 'No recipes found matching the search term' });
    }
  } catch (error) {
    console.error('Error searching for recipes:', error);
    res.status(500).json({ message: 'Error searching for recipes', error: error.message });
  }
});

app.post('/api/recipes/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = 'user123'; // Replace with actual user authentication
    
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const existingRatingIndex = recipe.ratings.findIndex(r => r.userId === userId);
    if (existingRatingIndex > -1) {
      recipe.ratings[existingRatingIndex].rating = rating;
    } else {
      recipe.ratings.push({ userId, rating });
    }

    await recipe.save();
    res.json({ message: 'Rating submitted successfully', averageRating: recipe.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating', error: error.message });
  }
});

// New route for saving meal plans
const mealPlanRoutes = require('./routes/mealPlans');
app.use('/api/meal-plans', mealPlanRoutes);

// New route for fetching ingredients
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

// New route for adding recipes
app.post('/api/recipes', async (req, res) => {
  try {
    const { recipe_name, ingredients, instructions, category } = req.body;
    const newRecipe = new Recipe({
      recipe_name,
      ingredients,
      instructions,
      category
    });
    await newRecipe.save();
    console.log('Recipe added successfully:', newRecipe);
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ message: 'Error adding recipe', error: error.message });
  }
});

// New route for Edamam API requests
app.get('/api/edamam-recipes', async (req, res) => {
  const { searchTerm, from, to } = req.query;
  const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
  const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

  try {
    const response = await axios.get(`https://api.edamam.com/search`, {
      params: {
        q: searchTerm,
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        from,
        to
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipes from Edamam:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// New route for categories
const categoriesRouter = require('./routes/categories');
app.use('/api/categories', categoriesRouter);

// New route for users
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use(authRoutes);

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Add a test route directly in server.js
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {
  fetchYouTubeVideo
};

// Add this near your other route definitions
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
