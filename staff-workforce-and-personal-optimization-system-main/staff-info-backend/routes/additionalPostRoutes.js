import express from "express";
import multer from "multer";
import {
  addAdditionalPost,
  myAdditionalPost,
  allAdditionalPosts,
  updateStatus,updateAdditionalPost,
} from "../controllers/additionalPostController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/add", upload.single("orderCopy"), addAdditionalPost);
router.get("/staff/:staffId", myAdditionalPost);
router.put(
  "/update/:id",
  upload.single("orderCopy"),
  updateAdditionalPost
);

router.get("/admin/all", allAdditionalPosts);
router.put("/admin/status/:id", updateStatus);

export default router;
