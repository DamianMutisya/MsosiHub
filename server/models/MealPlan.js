const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  userId: String,
  mealPlan: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
