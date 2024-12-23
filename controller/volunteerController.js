const Volunteer = require('../models/volunteerModel')
const MealPlan = require('../models/mealsModel')
const bcrypt = require("bcrypt")


const verifyVolunteerLogin = async(req,res) => {
    try {      
        const { username, password } = req.body;

        if(!username || !password ) {
            return res.status(400).json({message:"Username and password are required"})
        }
        
        const volunteer = await Volunteer.findOne({username})
        
        if(!volunteer) {
            return res.status(404).json({message:"Volunteer not found"})
        }

        const isMatch = await bcrypt.compare(password, volunteer.password)
        if(!isMatch) {
            return res.status(401).json({message: "Incorrect Password"})
        }

        return res.status(200).json({message: "Login successful"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
}


const saveMealPlan = async (req,res) => {
    
    const { userId, formState } = req.body;

    try {
      await MealPlan.updateOne(
        { userId },
        { $set: { formState, isSubmitted: true } },
        { upsert: true }
      );
      res.status(200).send({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
      console.error("Error saving meal plan:", error);
      res.status(500).send({ success: false, error: "Error saving data to database." });
    }
}

const getMealPlan = async (req,res) => {
    const { userId } = req.query;

    try {
      const mealPlan = await MealPlan.findOne({ userId });
      res.status(200).send({
        success: true,
        formState: mealPlan?.formState || {},
        isSubmitted: mealPlan?.isSubmitted || false,
      });
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      res.status(500).send({ success: false, error: "Error fetching data from database." });
    }
}

module.exports = { verifyVolunteerLogin,saveMealPlan,getMealPlan }