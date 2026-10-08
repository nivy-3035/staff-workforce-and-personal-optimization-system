import * as qualificationModel from "../models/qualificationModel.js";
import path from "path";
import fs from "fs";

export async function addQualification(req, res) {
  try {
    let degreeCopyFilename = null;

    if (req.file) {
      const staffId = req.body.staffId;
      const ext = path.extname(req.file.originalname);
      
      // Count existing qualifications for this staff
      const [existing] = await qualificationModel.getMyQualifications(staffId);
      const count = existing.length + 1;
      
      // New filename: staffId-qualification-count.ext
      degreeCopyFilename = `${staffId}-qualification-${count}${ext}`;
      
      // Move file from uploads to copies
      const oldPath = req.file.path;
      const newPath = path.join("copies", degreeCopyFilename);
      
      fs.renameSync(oldPath, newPath);
    }

    await qualificationModel.addQualification({
      staffId: req.body.staffId,
      degree: req.body.degree,
      major: req.body.major,
      completedYear: req.body.completedYear,
      college: req.body.college,
      university: req.body.university,
      degreeCopy: degreeCopyFilename,
    });

    res.json({ message: "Submitted for admin approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function myQualifications(req, res) {
  try {
    const [rows] = await qualificationModel.getMyQualifications(req.params.staffId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/* ================= UPDATE ================= */
export async function updateQualification(req, res) {
  try {
    const id = req.params.id;

    const qualification =
      await qualificationModel.getQualificationById(id);

    if (!qualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }

    // allow update only if status == 1
    if (qualification.status !== 1) {
      return res.status(403).json({
        message: "Only approved qualifications can be updated",
      });
    }

    // ✅ STEP 1: MOVE OLD DATA TO HISTORY
    await qualificationModel.moveQualificationToHistory(id);

    // ✅ STEP 2: UPDATE MAIN TABLE
    await qualificationModel.updateQualification(id, {
      degree: req.body.degree,
      major: req.body.major,
      completedYear: req.body.completedYear,
      college: req.body.college,
      university: req.body.university,
    });

    res.json({
      message: "Qualification updated & history saved",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}




export async function allQualifications(req, res) {
  try {
    const [rows] = await qualificationModel.getAllQualifications();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateStatus(req, res) {
  try {
    await qualificationModel.updateQualificationStatus(req.params.id, req.body.status);
    res.json({ message: "Status updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

