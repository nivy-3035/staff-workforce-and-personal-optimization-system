import db from "../db.js";
import * as staffModel from "../models/staffModel.js";
import nodemailer from "nodemailer";



// // =========================
// // ADD STAFF
// // =========================
export async function addStaff(req, res) {
  try {
    const photoFile = req.file ? req.file.filename : null;

    const staffData = {
      ...req.body,
      photo: photoFile,
      state: req.body.state || "Tamil Nadu",
    };

    const [result] = await staffModel.addStaff(staffData);
    res.status(201).json({ id: result.insertId, ...staffData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// // =========================
// // GET ALL STAFF
// // =========================
export async function getAllStaff(req, res) {
  try {
    const [rows] = await staffModel.getAllStaff();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export async function getStaffByStaffIdOnly(req, res) {
  try {
    const { staffId } = req.params;
    const [rows] = await staffModel.getStaffByStaffId(staffId);

    if (rows.length === 0) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      staff: rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// // =========================
// // GET STAFF BY STAFF ID
// // =========================
export async function getStaffById(req, res) {
  try {
    const staffId = req.params.id;
    const [rows] = await staffModel.getStaffByStaffId(staffId);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// // =========================
// // UPDATE STAFF + SAVE OLD DATA
// // =========================
export async function updateStaffByStaffId(req, res) {
  const staffId = req.params.staffId;

  try {
    // 1️⃣ Get existing staff data
    const [existing] = await staffModel.getStaffByStaffId(staffId);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const oldData = existing[0];

    // 2️⃣ Save old data in history table (including new address fields)
    await db.query(
      `INSERT INTO history_table (
        staffId, old_email, old_firstName, old_lastName, old_mobile,
        old_dob, old_joiningDate,
        old_specialization, old_photo,
        old_street, old_city, old_district, old_state, old_pinCode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        oldData.staffId,
        oldData.email,
        oldData.firstName,
        oldData.lastName,
        oldData.mobile,
        oldData.dob,
        oldData.joiningDate,
        oldData.specialization,
        oldData.photo,
        oldData.street,
        oldData.city,
        oldData.district,
        oldData.state,
        oldData.pinCode
      ]
    );

    // 3️⃣ Prepare updated staff data
    const staffData = { ...req.body };
    if (req.file) staffData.photo = req.file.filename;

    // Ensure state has a default
    if (!staffData.state) staffData.state = "Tamil Nadu";

    // 4️⃣ Update staff table
    await staffModel.updateStaffByStaffId(staffId, staffData);

    res.json({ message: "Staff updated successfully" });
  } catch (err) {
    console.error("Error updating staff:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// // =========================
// // SEARCH STAFF
// // =========================
export async function searchStaff(req, res) {
  try {
    const query = req.params.query.trim();

    const sql = `
      SELECT * FROM staff 
      WHERE isDeleted = 0 AND (
        firstName LIKE ? OR lastName LIKE ? OR staffId LIKE ?
      )
    `;

    const values = [`%${query}%`, `%${query}%`, `%${query}%`];
    const [rows] = await db.query(sql, values);

    res.json(rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
}

// // =========================
// // DELETE STAFF
// // =========================
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await staffModel.deleteStaffById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// // =========================
// // CHANGE PASSWORD
// // =========================
export async function changePassword(req, res) {
  const { username, oldPassword, newPassword } = req.body;

  try {
    const [rows] = await staffModel.getByUsername(username);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    if (admin.password !== oldPassword) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    await staffModel.updatePassword(username, newPassword);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* =========================
   UPDATE STAFF CONTACT
========================= */
export async function updateStaffContact(req, res) {
  try {
    const { staffId } = req.params;
    const { email, mobile } = req.body;

    // Get existing staff
    const [rows] = await staffModel.getStaffByStaffId(staffId);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update contact details
    await staffModel.updateStaffContact(staffId, email, mobile);

    /* ===== SEND EMAIL ===== */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Contact Details Updated",
      text: "Your contact details have been updated by admin",
    });

    res.json({
      message: "Contact details updated and email sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

import path from "path";
import fs from "fs";

export async function createDesignation(req, res) {
  try {
    const { staffId, designation, from_date, to_date, resolution_no, order_no, remarks } = req.body;
    let orderCopyFilename = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      
      // Count existing designations for this staff
      const [existing] = await staffModel.getDesignationByStaffId(staffId);
      const count = existing.length + 1;
      
      // New filename: staffId-designation-count.ext
      orderCopyFilename = `${staffId}-designation-${count}${ext}`;
      
      // Move file from uploads to copies
      const oldPath = req.file.path;
      const newPath = path.join("copies", orderCopyFilename);
      
      fs.renameSync(oldPath, newPath);
    }

    const data = [
      staffId,
      designation,
      from_date,
      to_date && to_date !== "" ? to_date : null,
      resolution_no,
      order_no,
      orderCopyFilename,
      remarks || "",
      0, // pending
    ];

    await staffModel.addDesignation(data);

    res.json({ message: "Designation submitted for admin approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

/* STAFF VIEW */
export async function getStaffDesignations(req, res) {
  try {
    const [rows] = await staffModel.getDesignationByStaffId(req.params.staffId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ADMIN VIEW */
export async function getAdminDesignations(req, res) {
  try {
    const [rows] = await staffModel.getAllDesignationsForAdmin();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ADMIN APPROVE / REJECT */
export async function updateDesignationStatus(req, res) {
  try {
    const { flag } = req.body;
    await staffModel.updateDesignationStatus(req.params.id, flag);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPendingCounts(req, res) {
  try {
    // Count pending items
    const [designationRows] = await staffModel.getPendingDesignationCount();
    const [qualificationRows] = await staffModel.getPendingQualificationCount();
    const [additionalPostRows] = await staffModel.getPendingAdditionalPostCount();
    const [experienceRows] = await staffModel.getPendingExperienceCount(); 

    res.json({
      designation: designationRows[0].count || 0,
      qualification: qualificationRows[0].count || 0,
      additionalPost: additionalPostRows[0].count || 0,
      experience: experienceRows[0].count || 0, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}


/* UPDATE DESIGNATION BY ID */
export async function updateDesignation(req, res) {
  const { id } = req.params;

  try {
    // 1️⃣ Fetch old designation
    const [rows] = await designationModel.getDesignationById(id);

    if (!rows.length) {
      return res.status(404).json({ message: "Designation not found" });
    }

    const oldDesignation = rows[0];

    // 2️⃣ Insert old data into history
    await staffModel.insertDesignationHistory(oldDesignation);

    // 3️⃣ Prepare new data from request body
    const newData = { ...req.body };

    // Optional: handle file if uploaded
    if (req.file) {
      newData.order_copy = req.file.filename;
    }

    // 4️⃣ Update designation
    await staffModel.updateDesignationById(id, newData);

    res.json({ success: true, message: "Designation updated and old data saved in history" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

