const mongoose = require('mongoose');
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
    const { file } = req;  // 'file' is provided by multer

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Check for required fields
    if (!userName || !file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if QR code already exists for the user
    const existingQRCode = await QRCodeModel.findOne({ userId });
    if (existingQRCode) {
      return res.status(409).json({ message: 'QR Code already exists' });
    }

    // Upload the QR code image to Cloudinary
    const uploadResponse = await uploadToCloudinary.uploader.upload(file.path, {
      public_id: `${userId}_qr_code`,  // Use userId as the image name in Cloudinary
      folder: 'qr_codes',  // Organize in a folder
      overwrite: true,     // Overwrite if the file exists
    });

    // Save the Cloudinary URL to the database
    const newQRCode = new QRCodeModel({
      userId,
      userName,
      qrCodeUrl: uploadResponse.secure_url,  // URL of the image on Cloudinary
      cloudinaryId: uploadResponse.public_id,  // Cloudinary public ID
    });

    await newQRCode.save();

    // Return success response with QR code data
    res.status(201).json({
      message: 'QR Code saved successfully',
      qrCodeData: newQRCode,
    });
  } catch (error) {
    console.error('Error saving QR Code:', error);
    res.status(500).json({ message: 'Error saving QR Code', error: error.message });
  }
};

module.exports = { registerUser,getNews, saveQRCode };
