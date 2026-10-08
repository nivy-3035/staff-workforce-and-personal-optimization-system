import express from "express";
import * as leaveController from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", leaveController.applyLeave);
router.get("/staff/:staffId", leaveController.getMyLeave);
router.get("/admin/all", leaveController.getAllLeave);
router.put("/admin/status/:id", leaveController.updateLeaveStatus);
router.get("/admin/pending-count", leaveController.getPendingLeaveCount);
router.get("/admin/pending-count", leaveController.getPendingLeaveCount);
export default router;