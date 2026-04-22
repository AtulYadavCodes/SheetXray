import { asyncHandler } from "../utils/asyncHandler.js";

import { instance } from "../utils/razorpay.js";
import crypto from "crypto";

import responseHandler from "../utils/responseHandler.js";

import Payment from "../models/payment.model.js";
import { User } from "../models/user.model.js";

const createorder = asyncHandler(async (req, res) => {
  const type = req.body.type;
  const amount = type === "premiumlifetime" ? 1000 : 99;

  const order = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
      userId: req.user._id.toString(),
      type: type,
    },
  });
  return res
    .status(200)
    .json(new responseHandler(200, "Order created successfully", order));
});

const verifypayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  if (generated_signature !== razorpay_signature) {
    return res
      .status(400)
      .json(new responseHandler(400, "Payment verification failed"));
  }

  const order = await instance.orders.fetch(razorpay_order_id);
  const subscriptionType = order.notes.type;

  const expectedamount = subscriptionType === "premiumlifetime" ? 1000 : 99;
  if (expectedamount * 100 !== order.amount) {
    return res
      .status(400)
      .json(new responseHandler(400, "Payment verification failed"));
  }

  const existingPayment = await Payment.findOne({
    paymentId: razorpay_payment_id,
  });
  if (existingPayment) {
    return res
      .status(200)
      .json(new responseHandler(200, "Payment already processed"));
  }
   await Payment.create({
    user: order.notes.userId,
    expectedamount,
    paymentId: razorpay_payment_id,
    subscriptionType,
    status: "success",
    subscriptionstartdate: new Date(),
    subscriptionenddate:
      subscriptionType === "premiumlifetime"
        ? null
        : new Date(new Date().setMonth(new Date().getMonth() + 1)),
  });
  await User.findByIdAndUpdate(
    order.notes.userId,
    {
      usertype: subscriptionType,
      waspremium: true,
      subscriptionExpiryDate:
        subscriptionType === "premiumlifetime"
          ? null
          : new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    { new: true },
  );
  return res
    .status(200)
    .json(new responseHandler(200, "Payment verified successfully"));
});

const verifypaymentwebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");
  if (generated_signature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }
  const event = JSON.parse(req.body);
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const razorpay_payment_id = payment.id;
    const razorpay_order_id = payment.order_id;
    const existingPayment = await Payment.findOne({
      paymentId: razorpay_payment_id,
    });
    if (existingPayment) {
      return res
        .status(200)
        .json(new responseHandler(200, "Payment already processed"));
    }
    const order = await instance.orders.fetch(razorpay_order_id);
    const subscriptionType = order.notes.type;
    const expectedamount = subscriptionType === "premiumlifetime" ? 1000 : 99;
    if (expectedamount * 100 !== order.amount) {
      return res
        .status(400)
        .json(new responseHandler(400, "Payment verification failed"));
    }
    await Payment.create({
      user: order.notes.userId,
      expectedamount,
      paymentId: razorpay_payment_id,
      subscriptionType,
      status: "success",
      subscriptionstartdate: new Date(),
      subscriptionenddate:
        subscriptionType === "premiumlifetime"
          ? null
          : new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });
    await User.findByIdAndUpdate(
      order.notes.userId,
      {
        usertype: subscriptionType,
        waspremium: true,
        subscriptionExpiryDate:
          subscriptionType === "premiumlifetime"
            ? null
            : new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      { new: true },
    );
  }
  return res.status(200).json({ message: "Webhook received successfully" });
});

export { createorder, verifypayment, verifypaymentwebhook };
