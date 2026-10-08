import * as model from "../models/additionalPostModel.js";
import path from "path";
import fs from "fs";
/* ADD */
export async function addAdditionalPost(req, res) {
  try {
    let orderCopyFilename = null;

    if (req.file) {
      const staffId = req.body.staffId;
      const ext = path.extname(req.file.originalname);
      
      // Count existing additional post files for this staff
      const [existing] = await model.getPostByStaffId(staffId);
      const count = existing.length + 1;
      
      // New filename: staffId-additionalpost-count.ext
      orderCopyFilename = `${staffId}-additionalpost-${count}${ext}`;
      
      // Move file from uploads to copies
      const oldPath = req.file.path;
      const newPath = path.join("copies", orderCopyFilename);
      
      fs.renameSync(oldPath, newPath);
    }

    await model.addAdditionalPost({
      staffId: req.body.staffId,
      post: req.body.post,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate || null,
      resolutionNo: req.body.resolutionNo,
      orderNo: req.body.orderNo,
      orderCopy: orderCopyFilename,
      remarks: req.body.remarks,
    });

    res.json({ message: "Submitted for admin approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
/* STAFF VIEW */
export async function myAdditionalPost(req, res) {
  const [rows] = await model.getPostByStaffId(req.params.staffId);
  res.json(rows);
}

/* ADMIN VIEW */
export async function allAdditionalPosts(req, res) {
  const [rows] = await model.getAllAdditionalPosts();
  res.json(rows);
}

/* ADMIN APPROVE */
export async function updateStatus(req, res) {
  await model.updateAdditionalPostStatus(
    req.params.id,
    req.body.status
  );
  res.json({ message: "Status updated" });
}

/* UPDATE ADDITIONAL POST */
export async function updateAdditionalPost(req, res) {
  try {
    const id = req.params.id;

    // 1️⃣ Get existing record
    const [rows] = await model.getPostById(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const oldData = rows[0];

    // 2️⃣ Handle file upload
    let orderCopyFilename = oldData.orderCopy;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      orderCopyFilename = Date.now() + ext;

      const oldPath = req.file.path;
      const newPath = path.join("copies", orderCopyFilename);

      fs.renameSync(oldPath, newPath);
    }

    // 3️⃣ Move old record to history
    await model.moveToHistory(id);

    // 4️⃣ Update with new values
    await model.updateAdditionalPost(id, {
      post: req.body.post ?? oldData.post,
      fromDate: req.body.fromDate ?? oldData.fromDate,
      toDate: req.body.toDate ?? oldData.toDate,
      resolutionNo: req.body.resolutionNo ?? oldData.resolutionNo,
      orderNo: req.body.orderNo ?? oldData.orderNo,
      orderCopy: orderCopyFilename,
      remarks: req.body.remarks ?? oldData.remarks,
    });

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
}