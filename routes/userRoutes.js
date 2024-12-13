const express = require('express');
const { registerUser } = require('../controller/userController');
const { createOrder, verifyPayment } = require('../controller/razorpayController');
const { saveQRCode } = require('../controller/qrCodeController')

const router = express.Router();

router.post('/register', registerUser);
router.post('/create-order', createOrder)
router.post('/verify-payment', verifyPayment);
router.post('/save-qr', saveQRCode);

module.exports = router;
