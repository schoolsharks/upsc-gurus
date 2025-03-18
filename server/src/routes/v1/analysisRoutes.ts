import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authHandler } from "../../middlewares/authHandler.middleware";
import { getTestAnalytics, getTestReviewQuestions } from "../../controllers/analysis";
const router = express.Router();



router.route("/getTestAnalytics").get(asyncHandler(getTestAnalytics));
router.route("/review-test").get(asyncHandler(getTestReviewQuestions));


export default router;
