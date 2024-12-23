const cloudinary = require('../config/cloudinaryConfig');

// Utility function to upload images to Cloudinary
const uploadToCloudinary = async (file, publicId) => {
  try {
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(file.path, {
      public_id: publicId, // Image name in Cloudinary
      folder: 'qr_codes', // Organize into a folder
      overwrite: true, // Replace the image if it exists
    });

    // Return Cloudinary's response object containing image metadata
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error; // Let the caller handle the error
  }
};

module.exports = { uploadToCloudinary };
