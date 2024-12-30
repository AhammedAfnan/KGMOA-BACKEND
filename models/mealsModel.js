const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("MealPlan", MealPlanSchema);
