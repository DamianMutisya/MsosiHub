const express = require('express');
const router = express.Router();
const MealPlan = require('../models/mealplan'); // You'll need to create this model

router.post('/', async (req, res) => {
  try {
    const { userId, mealPlan } = req.body;
    const newMealPlan = new MealPlan({
      userId,
      mealPlan
    });
    await newMealPlan.save();
    res.status(201).json({ message: 'Meal plan saved successfully' });
  } catch (error) {
    console.error('Error saving meal plan:', error);
    res.status(500).json({ message: 'Failed to save meal plan' });
  }
});

// New GET route to retrieve meal plans
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const mealPlans = await MealPlan.find({ userId }).sort({ createdAt: -1 }).limit(5);
    res.json(mealPlans);
  } catch (error) {
    console.error('Error retrieving meal plans:', error);
    res.status(500).json({ message: 'Failed to retrieve meal plans' });
  }
});

// New PUT route to update existing meal plans
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, mealPlan } = req.body;
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(id, {
      userId,
      mealPlan,
      updatedAt: new Date()
    }, { new: true });
    if (!updatedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(updatedMealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ message: 'Failed to update meal plan' });
  }
});

// New DELETE route to delete a meal plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMealPlan = await MealPlan.findByIdAndDelete(id);
    if (!deletedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ message: 'Failed to delete meal plan' });
  }
});

module.exports = router;
