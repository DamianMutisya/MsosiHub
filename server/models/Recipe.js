const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  recipe_name: String,
  ingredients: [String],
  instructions: [String],
  image_url: String,
  averageRating: Number,
  cook_time: Number,
  difficulty: String,
  category: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);
