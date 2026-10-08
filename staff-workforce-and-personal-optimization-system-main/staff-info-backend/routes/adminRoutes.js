// routes/adminRoutes.js
import express from "express";
import * as staffController from "../controllers/staffController.js";

const router = express.Router();

// GET pending approvals counts
router.get("/pending-counts", staffController.getPendingCounts);


export default router;
