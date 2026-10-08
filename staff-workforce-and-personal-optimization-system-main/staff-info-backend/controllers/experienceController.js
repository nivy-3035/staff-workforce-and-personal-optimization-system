import * as experienceModel from "../models/experienceModel.js";

/* ================================
   ADD EXPERIENCE
   ================================ */
export async function addExperience(req, res) {
  try {
    const certificate = req.file ? req.file.filename : null;

    await experienceModel.addExperience({
      staffId: req.body.staffId,
      experience_type: req.body.experience_type, // Industry / Academic
      industry_worked: req.body.industry_worked,
      from_date: req.body.from_date,
      to_date: req.body.to_date,
      certificate,
      remarks: req.body.remarks,
    });

    res.json({ message: "Experience submitted for admin approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ================================
   STAFF - MY EXPERIENCE
   ================================ */
export async function myExperience(req, res) {
  try {
    const [rows] = await experienceModel.getMyExperience(
      req.params.staffId
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


/* ================================
   UPDATE EXPERIENCE (STAFF)
   ================================ */
export async function updateExperience(req, res) {
  try {
    const id = req.params.id;

    const experience = await experienceModel.getExperienceById(id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // ✅ Allow update only if approved
    if (experience.flag !== 1) {
      return res.status(403).json({
        message: "Only approved experience can be updated",
      });
    }

    // ✅ 1. Move old data to history
    await experienceModel.moveExperienceToHistory(id);

    // ✅ 2. Update main table
    await experienceModel.updateExperience(id, {
      experience_type: req.body.experience_type,
      industry_worked: req.body.industry_worked,
      from_date: req.body.from_date,
      to_date: req.body.to_date,
      remarks: req.body.remarks,
    });

    res.json({
      message: "Experience updated and history saved",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


/* ================================
   ADMIN - ALL EXPERIENCE
   ================================ */
export async function allExperience(req, res) {
  try {
    const [rows] = await experienceModel.getAllExperience();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/* ================================
   ADMIN - UPDATE STATUS
   ================================ */
export async function updateStatus(req, res) {
  try {
    await experienceModel.updateExperienceStatus(
      req.params.id,
      req.body.flag
    );
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
