const Razorpay = require('razorpay')
const crypto = require("crypto");
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: req.body.receipt,
    };

    try {
        const order = await razorpayInstance.orders.create(options)
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: error.message });
    }
}

const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Replace with your Razorpay Key Secret
      .update(body.toString())
      .digest("hex");
  
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  };

module.exports = { createOrder, verifyPayment }