const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  recipe_name: {
    type: String,
    required: true,
    unique: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    default: 'Uncategorized'
  },
  prep_time: {
    type: Number,
    default: 0
  },
  cook_time: {
    type: Number,
    default: 0
  },
  servings: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  ratings: [{
    userId: String,
    rating: Number
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for total time
RecipeSchema.virtual('total_time').get(function() {
  return this.prep_time + this.cook_time;
});

// Method to calculate average rating
RecipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  return this.averageRating;
};

// Pre-save hook to calculate average rating
RecipeSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
