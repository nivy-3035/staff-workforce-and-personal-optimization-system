import express from "express";
import {
  addPublication,
  getPublicationsByStaff,
  updatePublication,
} from "../controllers/publicationController.js";

const router = express.Router();

router.post("/add", addPublication);
router.get("/staff/:staffId", getPublicationsByStaff);
router.put("/update/:id", updatePublication); 

export default router;
