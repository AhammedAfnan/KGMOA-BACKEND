const Volunteer = require('../models/volunteerModel')
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

module.exports = { verifyVolunteerLogin }