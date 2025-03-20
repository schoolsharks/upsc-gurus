import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import {  handlePaymentWebhook } from "../../controllers/payment";

const router= express.Router();

// router.route("/createOrder").post(asyncHandler(handleCreateOrder));
// router.route("/verifyPayment").put(asyncHandler(handleVerifyingPayment))
router.route("/verifypaymentWebHook").post(asyncHandler(handlePaymentWebhook));

export default router;