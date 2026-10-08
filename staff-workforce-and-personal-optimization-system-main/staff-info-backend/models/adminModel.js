import db from "../db.js";

export function getAdminByUsername(username) {
  return db.query("SELECT * FROM admin WHERE username = ?", [username]);
}

export function getAdminByEmail(email) {
  return db.query("SELECT * FROM admin WHERE email = ?", [email]);
}

export function storeAdminOtp(email, otp) {
  return db.query("UPDATE admin SET otp = ? WHERE email = ?", [otp, email]);
}

export function resetAdminPassword(email, password, otp) {
  return db.query(
    "UPDATE admin SET password = ?, otp = NULL WHERE email = ? AND otp = ?",
    [password, email, otp]
  );
}
