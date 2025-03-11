import express from "express";
import authRoutes from "./authRoutes";
import testRoutes from "./testRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);

export default router;