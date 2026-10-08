import express from "express";
import multer from "multer";
import {
  addQualification,
  myQualifications,
  allQualifications,
  updateStatus,updateQualification,
} from "../controllers/qualificationController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// STAFF - Add qualification
router.post("/add", upload.single("degreeCopy"), addQualification);

// STAFF - View only approved qualifications
router.get("/staff/:staffId", myQualifications);

router.put("/update/:id", upload.single("degreeCopy"), updateQualification);

// ADMIN - View all qualifications
router.get("/admin/all", allQualifications);

// ADMIN - Approve/Reject
router.put("/admin/status/:id", updateStatus);

export default router;
