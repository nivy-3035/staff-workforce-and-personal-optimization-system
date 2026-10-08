import express from "express";
import multer from "multer";
import * as staffController from "../controllers/staffController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// STAFF
router.post("/", upload.single("order_copy"), staffController.createDesignation);
router.get("/staff/:staffId", staffController.getStaffDesignations);

// ADMIN
router.get("/admin", staffController.getAdminDesignations);
router.put("/status/:id", staffController.updateDesignationStatus);
// designation routes
router.put("/:id", staffController.updateDesignation);


export default router;
