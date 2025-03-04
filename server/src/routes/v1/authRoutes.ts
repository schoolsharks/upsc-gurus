import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authHandler } from "../../middlewares/authHandler.middleware";
import {handleLoginUser, handleRegisterUser} from "../../controllers/auth";
const router = express.Router();



router.route("/login").post(asyncHandler(handleLoginUser));
router.route("/register").post(asyncHandler(handleRegisterUser));


export default router;
