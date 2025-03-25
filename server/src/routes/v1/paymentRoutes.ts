import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import {  handlePaymentWebhook } from "../../controllers/payment";
import bodyParser from 'body-parser';

const router= express.Router();

// router.route("/createOrder").post(asyncHandler(handleCreateOrder));
// router.route("/verifyPayment").put(asyncHandler(handleVerifyingPayment))

router.post(
    '/verifypaymentWebHook',
    bodyParser.raw({ type: 'application/json' }), // Must be first
    asyncHandler(handlePaymentWebhook)
  );

export default router;