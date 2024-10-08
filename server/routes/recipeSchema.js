const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  recipe_name: { type: String, unique: true },
  ingredients: [String],
  instructions: [String],
});

module.exports = mongoose.model('Recipe', RecipeSchema);
