const Admin = require('../models/adminModel')
const bcrypt = require("bcrypt")

const verifyLogin = async(req,res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password ) {
            return res.status(400).json({message:"Username and password are required"})
        }
        
        const admin = await Admin.findOne({username})
        if(!admin) {
            return res.status(404).json({message:"Admin not found"})
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) {
            return res.status(401).json({message: "Incorrect Password"})
        }

        return res.status(200).json({message: "Login successful"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {verifyLogin}