import express from "express";
import authRoutes from "./authRoutes";
import testRoutes from "./testRoutes";
import AnalysisRoutes from "./analysisRoutes";
import { calulateAccuracyOfUserAnswer } from "../../controllers/test";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/analysis", AnalysisRoutes);

export default router;