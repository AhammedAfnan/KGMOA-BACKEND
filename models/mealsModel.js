const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Ensures one meal plan per user
  },
  formState: {
    type: Object,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("MealPlan", MealPlanSchema);
