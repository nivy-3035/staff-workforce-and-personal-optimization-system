import express from "express";
import * as awardController from "../controllers/awardController.js";

const router = express.Router();

router.post("/add", awardController.addAward);
router.get("/staff/:staffId", awardController.getAwardsByStaff);
router.put("/update/:id", awardController.updateAward);

export default router;
