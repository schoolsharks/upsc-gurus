import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authHandler } from "../../middlewares/authHandler.middleware";
import {
  userTestInfo,
  handleCreateTest,
  handleGetTestQuestions,
  updateQuestionResponse,
  lockTest,
  handleMark,
  startQuestionTime,
  endQuestionTime,
  startTestTime,
  endTestTime,
} from "../../controllers/test";
import { getTestAnalytics } from "../../controllers/analysis";

const router = express.Router();

router.route("/userTestInfo").get(authHandler, asyncHandler(userTestInfo));
router.route("/launchTest").post(authHandler, asyncHandler(handleCreateTest));
router
  .route("/getQuestions")
  .get(authHandler, asyncHandler(handleGetTestQuestions));
router
  .route("/updateQuestionResponse")
  .put(authHandler, asyncHandler(updateQuestionResponse));
router.route("/lockTest").put(authHandler, asyncHandler(lockTest));
router.route("/markForReview").put(authHandler, asyncHandler(handleMark));
router.route("/startQuestionTime").put(authHandler, asyncHandler(startQuestionTime));
router.route("/endQuestionTime").put(authHandler, asyncHandler(endQuestionTime));

// router.route("/getTestScore").get(authHandler, asyncHandler(testScore));
router.route("/getTestScore").get(authHandler, asyncHandler(getTestAnalytics));


router.route("/startTestTime").put(authHandler, asyncHandler(startTestTime));
router.route("/endTestTime").put(authHandler, asyncHandler(endTestTime));

export default router;
