const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const Payment = require("../models/paymentModel")
const User = require("../models/userModel")

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const options = {
    amount: req.body.amount,
    currency: "INR",
    // receipt: req.body.receipt,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { kmc, paymentId, razorpay_order_id, razorpay_signature, amount } =
    req.body;

  const body = razorpay_order_id + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      // Save payment details to the database using the Payment model
      const payment = new Payment({
        kmc, // Unique identifier for the user
        orderId: razorpay_order_id,
        paymentId: paymentId,
        amount:amount,
        signature: razorpay_signature,
        status: "Success", // You can also save additional status info
      });

      await payment.save();

      // Optionally, update the user record to store payment details
      const user = await User.findOne({ kmc });
      if (user) {
        user.paymentId = paymentId; // Save the paymentId to the user record
        await user.save();
      }

      res
        .status(200)
        .json({ success: true, message: "Payment verified and saved" });
    } catch (error) {
      console.error("Error saving payment:", error);
      res.status(500).json({ success: false, error: "Error saving payment" });
    }
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
};

module.exports = { createOrder, verifyPayment };
