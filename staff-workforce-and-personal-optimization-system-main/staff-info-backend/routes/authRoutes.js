import express from "express";
import { signin, sendOtp, resetPasswordOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPasswordOtp);

export default router;
