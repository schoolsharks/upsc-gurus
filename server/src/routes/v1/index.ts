import express from "express";
import authRoutes from "./authRoutes";
import testRoutes from "./testRoutes";
import AnalysisRoutes from "./analysisRoutes";
import { calulateAccuracyOfUserAnswer } from "../../controllers/test";
import paymentRoutes from "./paymentRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/analysis", AnalysisRoutes);
router.use("/payment", paymentRoutes);

export default router;