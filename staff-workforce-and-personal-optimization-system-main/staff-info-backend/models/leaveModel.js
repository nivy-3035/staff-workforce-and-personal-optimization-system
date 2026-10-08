import db from "../db.js";

/* Create balance if not exists */
export async function createBalanceIfNotExists(staffId) {
  await db.query(
    `INSERT IGNORE INTO leave_balance (staffId) VALUES (?)`,
    [staffId]
  );
}

/* Get balance */
export async function getLeaveBalance(staffId) {
  return db.query(
    `SELECT * FROM leave_balance WHERE staffId = ?`,
    [staffId]
  );
}

/* Apply Leave */
export async function applyLeave(data) {
  return db.query(
    `INSERT INTO leave_application
     (staffId, leave_type, from_date, to_date, reason)
     VALUES (?, ?, ?, ?, ?)`,
    data
  );
}

/* Get staff leave */
export async function getLeaveByStaff(staffId) {
  return db.query(
    `SELECT * FROM leave_application WHERE staffId=? ORDER BY id DESC`,
    [staffId]
  );
}

/* Get all leave */
export async function getAllLeave() {
  return db.query(`SELECT * FROM leave_application ORDER BY id DESC`);
}

/* Update Status */
export async function updateLeaveStatus(id, status) {
  return db.query(
    `UPDATE leave_application SET status=? WHERE id=?`,
    [status, id]
  );
}

/* Deduct Leave */
export async function deductLeave(staffId, type) {
  let column = "";

  if (type === "CASUAL") column = "casual_leave";
  if (type === "RESTRICTED") column = "restricted_holiday";
  if (type === "SPECIAL") column = "special_casual_leave";

  return db.query(
    `UPDATE leave_balance 
     SET ${column} = ${column} - 1
     WHERE staffId = ?`,
    [staffId]
  );
}

/* Get Pending Leave Count */
export async function getPendingLeaveCount() {
  return db.query(
    `SELECT COUNT(*) as count 
     FROM leave_application 
     WHERE status = 0`
  );
}