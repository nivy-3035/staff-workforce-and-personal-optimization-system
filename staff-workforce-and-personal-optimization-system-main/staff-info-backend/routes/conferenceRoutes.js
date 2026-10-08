import express from "express";
import multer from "multer";
import path from "path";
import * as conferenceController from "../controllers/conferenceController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), conferenceController.createConference);
router.get("/staff/:staffId", conferenceController.getMyConferences);
router.put("/:id", upload.single("file"), conferenceController.updateConference);

export default router;
