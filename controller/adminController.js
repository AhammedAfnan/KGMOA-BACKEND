const Admin = require("../models/adminModel");
const User = require("../models/userModel");
// const Payment = require('../models/paymentModel')
const QrCode = require("../models/qrCodeModel");
const bcrypt = require("bcrypt");
const News = require("../models/newsModel");
const MealPlan = require("../models/mealsModel");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const verifyLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();

    res.status(200).json({ count: usersCount });
  } catch (error) {
    console.error("Error fetching user count", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTableData = async (req, res) => {
  try {
    const users = await User.find();

    const tableData = await Promise.all(
      users.map(async (user, index) => {
        const qrCode = await QrCode.findOne({ userName: user.name });

        // Initialize regTarrifAmount as 0
        let regTarrifAmount = user.regTarrif.amount;

        // Check if coDel exists and add 3000 if true
        const additionalAmount = user.coDel ? 3000 : 0;

        // Calculate the total amount
        const totalAmount = regTarrifAmount + additionalAmount;

        const mealPlan = await MealPlan.findOne({ userId: user._id });

        // Fetch attendedAndReceivedKit and checkInTime values
        const attendedAndReceivedKit =
          mealPlan?.formState?.kitReceived || false;
        const checkInTime = user.checkInTime || null;

        return {
          id: index + 1,
          name: user.name,
          place: user.place,
          kmcNo: user.kmc,
          phone: user.mobile,
          regTarrif: user.regTarrif.type,
          amount: totalAmount, // Include the calculated amount
          paymentMode: user.paymentMode || "N/A",
          paymentDate: user.paymentDate || null,
          utrNumberOrCashReceipt: user.utrNumberOrCashReceipt || "N/A",
          attendedAndReceivedKit, // Include attendance information
          checkInTime, // Include check-in time
          qrCode: qrCode ? qrCode.qrCodeUrl : "N/A",
        };
      })
    );

    res.status(200).json(tableData);
  } catch (error) {
    console.error("Error fetching table data", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePass = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({ username: "Admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addNews = async (req, res) => {
  const { title, description } = req.body;

  try {
    let imageUrl = "";

    // Check if an image file was uploaded
    if (req.file) {
      // Get the absolute path to the uploaded file
      const filePath = path.resolve(req.file.path);

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "news_images", // Optional: Specify a folder in Cloudinary
        use_filename: true,   // Optional: Use the original file name
        unique_filename: false, // Optional: Avoid generating unique names
      });

      // Retrieve the secure URL of the uploaded image
      imageUrl = result.secure_url;

      // Clean up the local file after successful upload
      fs.unlinkSync(filePath);
    }

    // Create a new news item
    const news = new News({
      title,
      description,
      image: imageUrl, // Save the Cloudinary image URL in the database
    });

    // Save the news item to the database
    await news.save();

    // Respond with a success message and the saved news item
    res.status(201).json({
      message: "News added successfully",
      news,
    });
  } catch (error) {
    console.error("Error adding news:", error);

    // Handle specific error types if needed
    if (req.file) {
      // Clean up the local file in case of any error during processing
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) console.error("Error cleaning up file:", unlinkError);
      });
    }

    // Respond with an error message
    res.status(500).json({
      message: "Failed to add news",
      error: error.message,
    });
  }
};


const getCheckedInCount = async (req, res) => {
  try {
    const checkedInCount = await MealPlan.countDocuments({
      "formState.checkIn": true, // Filters documents where checkedIn is true
    });

    res.status(200).json({ count: checkedInCount });
  } catch (error) {
    console.error("Error fetching checked-in count", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getReceivedKitCount = async (req, res) => {
  try {
    // Count documents where kitReceived is true
    const receivedKitCount = await MealPlan.countDocuments({
      $and: [
        { formState: { $exists: true } },
        { "formState.kitReceived": true },
      ],
    });

    res.status(200).json({ count: receivedKitCount });
  } catch (error) {
    console.error("Error fetching received kit count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNews = async (req, res) => {
  try {
    const newsList = await News.find(); // Fetch all news articles
    res.status(200).json(newsList);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news" });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    let imageUrl;

    if (req.file) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "news_images", // Optional folder in Cloudinary
      });
      imageUrl = result.secure_url; // Get the public URL of the uploaded image
    }

    const updateData = { title, description };
    if (imageUrl) updateData.image = imageUrl;

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Error updating news" });
  }
};


module.exports = {
  verifyLogin,
  getUsersCount,
  getTableData,
  changePass,
  addNews,
  getCheckedInCount,
  getReceivedKitCount,
  getNews,
  deleteNews,
  updateNews
};
