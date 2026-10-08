import express from "express";
import {
  addBookPublication,
  getBooksByStaff,
  updateBookByIdd,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/add", addBookPublication);
router.get("/:staffId", getBooksByStaff);
router.put("/update/:id", updateBookByIdd); 

export default router;
