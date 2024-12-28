const express = require('express');
const { registerUser, getNews,saveQRCode } = require('../controller/userController');
// const { createOrder, verifyPayment } = require('../controller/razorpayController');
const multer = require('multer');
const upload = require('../config/multerConfig');


const router = express.Router();

router.post('/register', registerUser);
// router.post('/create-order', createOrder)
// router.post('/verify-payment', verifyPayment);
router.get('/get-news',getNews)
router.post('/upload-cloudinary', upload.single('file'), saveQRCode);


module.exports = router;
