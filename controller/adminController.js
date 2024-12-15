const Admin = require('../models/adminModel')
const User = require("../models/userModel")
const Payment = require('../models/paymentModel')
const QrCode = require('../models/qrCodeModel')
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

const getUsersCount = async (req,res) => {
    try {
        const usersCount = await User.countDocuments();

        res.status(200).json({count: usersCount})
    } catch (error) {
        console.error("Error fetching user count",error)
        res.status(500).json({ message: "Server error"})
    }
}

const getTableData = async(req,res) => {
    try {
        const users = await User.find();

        const tableData = await Promise.all(
            users.map(async (user,index) => {
                const payment = await Payment.findOne({kmc:user.kmc});
                const qrCode = await QrCode.findOne({userName:user.name})                

                return {
                    id: index+1,
                    name:user.name,
                    place:user.place,
                    kmcNo:user.kmc,
                    phone:user.mobile,
                    regTarrif:user.regTarrif,
                    amount: payment ? payment.amount : "N/A",
                    paymentId: payment ? payment.paymentId : "N/A",
                    qrCode: qrCode ? qrCode.qrCodeImage : "N/A",
                }
            })
        )
        res.status(200).json(tableData)
    } catch (error) {
        console.error("Error fetching table data",error)
        res.status(500).json({message: "Server error"})
    }
}

const changePass = async(req,res) => {    
    const {currentPassword , newPassword } = req.body;

    try {
        const admin = await Admin.findOne({username:'Admin'})
        if(!admin){
            return res.status(404).json({message:'Admin not found'})
        }
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save()
        
        res.status(200).json({message:'Password updated successfully'})
    } catch (error) {
        res.status(500).json({message:'Server error',error})
    }
}


module.exports = {verifyLogin, getUsersCount,getTableData,changePass}