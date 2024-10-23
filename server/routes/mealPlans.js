const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, mealPlan } = req.body;
    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const newMealPlan = new MealPlan({
      userId,
      mealPlan
    });
    await newMealPlan.save();
    res.status(201).json({ message: 'Meal plan saved successfully', _id: newMealPlan._id });
  } catch (error) {
    console.error('Error saving meal plan:', error);
    res.status(500).json({ message: 'Failed to save meal plan' });
  }
});

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const mealPlans = await MealPlan.find({ userId }).sort({ createdAt: -1 }).limit(5);
    res.json(mealPlans);
  } catch (error) {
    console.error('Error retrieving meal plans:', error);
    res.status(500).json({ message: 'Failed to retrieve meal plans' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, mealPlan } = req.body;
    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updatedMealPlan = await MealPlan.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      {
        mealPlan,
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!updatedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(updatedMealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ message: 'Failed to update meal plan' });
  }
});

module.exports = router;
