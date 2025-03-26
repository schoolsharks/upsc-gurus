import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authHandler } from "../../middlewares/authHandler.middleware";
import {handleLoginUser, handleRegisterUser, handleResetPassword, handleResetPasswordToken} from "../../controllers/auth";
const router = express.Router();



router.route("/login").post(asyncHandler(handleLoginUser));
router.route("/register").post(asyncHandler(handleRegisterUser));
router.route('/forgetPassword').put(asyncHandler(handleResetPasswordToken));
router.route('/resetPassword').put(asyncHandler(handleResetPassword));




export default router;
