const mongoose = require('mongoose');
const fs = require('fs')
const User = require('../models/userModel')
const News = require('../models/newsModel')
const QRCodeModel = require('../models/qrCodeModel');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary')


const registerUser = async (req, res) => {
  try {    
    const { name, place, kmc, mobile, regTarrif, coDel } = req.body;

    const existingKmc = await User.findOne({ kmc });
    if (existingKmc) {
      return res.status(400).json({ error: 'KMC number already exists' });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }

    const newRegister = new User({ name, place, kmc, mobile, regTarrif, coDel });
    await newRegister.save();

    res.status(201).json({ message: 'Data saved successfully!',userId:newRegister._id});
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getNews = async (req,res) => {
  try {
      const news = await News.find();
      res.status(200).json({ news });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
}

const saveQRCode = async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const { file } = req;

    // Log the file's mimetype to check its format
    console.log('File mimetype:', file?.mimetype);

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Uploaded file is not an image' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    if (!userName) {
      return res.status(400).json({ message: 'Missing userName' });
    }

    // Check if QR code already exists for the user
    const existingQRCode = await QRCodeModel.findOne({ userId });
    if (existingQRCode) {
      return res.status(409).json({ message: 'QR Code already exists for this user' });
    }

    // Upload to Cloudinary
    const uploadResponse = await uploadToCloudinary(file.path, `${userId}_qr_code`);
    console.log('Upload response:', uploadResponse);

    if (!uploadResponse || !uploadResponse.secure_url || !uploadResponse.public_id) {
      return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
    }

    const newQRCode = new QRCodeModel({
      userId,
      userName,
      qrCodeUrl: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id,
    });

    await newQRCode.save();
    fs.unlinkSync(file.path); // Clean up the file
    res.status(201).json({
      message: 'QR Code saved successfully',
      qrCodeData: newQRCode.qrCodeUrl,
    });
  } catch (error) {
    console.error('Error saving QR Code:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'QR Code already exists for this user',
        error: error.message
      });
    }

    res.status(500).json({ message: 'Error saving QR Code', error: error.message });
  }
};






module.exports = { registerUser,getNews, saveQRCode };
