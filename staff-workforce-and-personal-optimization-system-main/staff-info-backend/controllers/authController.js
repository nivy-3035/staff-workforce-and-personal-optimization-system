import * as adminModel from "../models/adminModel.js";
import * as staffModel from "../models/staffModel.js";
import nodemailer from "nodemailer";
/* ===== LOGIN ===== */
export async function signin(req, res) {
  const { username, password } = req.body;

  try {
    // ================= ADMIN LOGIN =================
    const [adminRows] = await adminModel.getAdminByUsername(username);
    if (adminRows.length) {
      if (adminRows[0].password !== password) {
        return res.status(400).json({ message: "Wrong password" });
      }

      return res.json({
        role: "admin",
        message: "Login successful",
        user: {
          username: adminRows[0].username,
        },
      });
    }

    // ================= STAFF LOGIN =================
    const [staffRows] = await staffModel.getStaffForLogin(username);

    if (!staffRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (staffRows[0].password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // ✅ THIS IS THE FIX
    return res.json({
      role: "staff",
      message: "Login successful",
      user: {
        staffId: staffRows[0].staffId,   // ⭐ REQUIRED
        username: staffRows[0].username,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ===== SEND OTP ===== */
export async function sendOtp(req, res) {
  const { email } = req.body;

  try {
    const [adminRows] = await adminModel.getAdminByEmail(email);
    const [staffRows] = await staffModel.getUserByEmail(email);

    if (!adminRows.length && !staffRows.length)
      return res.status(404).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (adminRows.length) await adminModel.storeAdminOtp(email, otp);
    else await staffModel.storeStaffOtp(email, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ===== RESET PASSWORD ===== */
export async function resetPasswordOtp(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    // Reset staff password
    const [staffResult] = await staffModel.resetStaffPassword(email, newPassword, otp);
    if (staffResult.affectedRows)
      return res.json({ message: "Password reset successfully" });

    // Reset admin password
    const [adminResult] = await adminModel.resetAdminPassword(email, newPassword, otp);
    if (!adminResult.affectedRows)
      return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
