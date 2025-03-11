import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authHandler } from "../../middlewares/authHandler.middleware";
import { userTestInfo, handleCreateTest, handleGetTestQuestions, updateQuestionResponse} from '../../controllers/test'
 
const router = express.Router();

router.route("/userTestInfo").get(authHandler, asyncHandler(userTestInfo));
router.route("/launchTest").post(authHandler, asyncHandler(handleCreateTest));
router.route("/getQuestions").get(authHandler, asyncHandler(handleGetTestQuestions));
router.route("/updateQuestionResponse").put(authHandler, asyncHandler(updateQuestionResponse));

export default router;
