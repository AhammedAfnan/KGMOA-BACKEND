const fs = require('fs');
const cloudinary = require('../config/cloudinaryConfig');

// Utility function to upload images to Cloudinary
const uploadToCloudinary = (filePath, publicId) => {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath); // Read the file as a buffer

    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: publicId, folder: 'qr_codes', overwrite: true },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer); // Stream the buffer to Cloudinary
  });
};

module.exports = { uploadToCloudinary };
