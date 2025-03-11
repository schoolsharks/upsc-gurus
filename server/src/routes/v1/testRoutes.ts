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
} from "../../controllers/test";
import { RouterTwoTone } from "@mui/icons-material";
import { testScore } from "../../controllers/analysis";

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
router.route("/getTestScore").get(authHandler, asyncHandler(testScore));

export default router;
