import express from "express";
import multer from "multer";
import {
  addExperience,
  myExperience,
  allExperience,
  updateStatus,updateExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

/* FILE UPLOAD CONFIG */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ================================
   STAFF
   ================================ */
router.post("/add", upload.single("certificate"), addExperience);
router.get("/staff/:staffId", myExperience);
router.put("/update/:id", updateExperience);


/* ================================
   ADMIN
   ================================ */
router.get("/admin/all", allExperience);
router.put("/admin/status/:id", updateStatus);

export default router;
