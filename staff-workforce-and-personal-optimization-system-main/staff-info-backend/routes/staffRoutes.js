 import express from 'express';
 import path from "path";
 import * as staffController from '../controllers/staffController.js';
 import multer from 'multer';

 const router = express.Router();
 const storage = multer.diskStorage({
   destination: "uploads/",
   filename: (req, file, cb) => {
     const ext = path.extname(file.originalname);
     const staffId = req.body.staffId || "unknown";
     cb(null, `${staffId}${ext}`);
   }
 });
 const upload = multer({ storage });

 // Rearranged routes for better organization: CRUD first, then search, auth, and password reset
 router.get('/', staffController.getAllStaff);
 router.post('/',upload.single('photo'), staffController.addStaff);
  router.get('/search/:query', staffController.searchStaff);
  router.put("/contact/:staffId",staffController.updateStaffContact);
 router.get('/:id', staffController.getStaffById);
 router.get("/by-staffid/:staffId", staffController.getStaffByStaffIdOnly);
 router.put('/:staffId',upload.single('photo'), staffController.updateStaffByStaffId);
router.put("/:id", upload.single("order_copy"), staffController.updateDesignation);

 router.post("/change-password", staffController.changePassword);
router.delete('/:id', staffController.deleteStaff); 




 export default router;
