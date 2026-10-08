import express from "express";
import {
  addMembership,
  getMembershipByStaff,
  updateMembershipById
  
} from "../controllers/membershipController.js";

const router = express.Router();

// STAFF
router.post("/add", addMembership);
router.get("/staff/:staffId", getMembershipByStaff);
router.put("/update/:id", updateMembershipById);
export default router;
