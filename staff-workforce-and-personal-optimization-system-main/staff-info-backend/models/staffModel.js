 import db from "../db.js";

 export function getAllStaff() {
   return db.query('SELECT * FROM staff WHERE isDeleted =0');
 }

 export function getStaffById(id) {
   return db.query('SELECT * FROM staff WHERE id = ? AND isDeleted =0', [id]);
 }

 export function addStaff(staffData) {
   return db.query('INSERT INTO staff SET ?', staffData);
 }

 export function getStaffByStaffId(staffId) {
   return db.query('SELECT * FROM staff WHERE staffId = ? AND isDeleted =0', [staffId]);
 }

 export function updateStaffByStaffId(staffId, staffData) {
   // Build dynamic query for only provided fields
   const fields = [];
   const values = [];

   Object.keys(staffData).forEach((key) => {
     fields.push(`${key} = ?`);
     values.push(staffData[key]);
   });

   const sql = `UPDATE staff SET ${fields.join(", ")} WHERE staffId = ?`;
   values.push(staffId);

   return db.query(sql, values);
 }

 export function deleteStaffById(staffId) {
   return db.query("UPDATE staff SET isDeleted = 1 WHERE staffId = ?", [staffId]);
 }


 export function getStaffForLogin(username) {
   return db.query(
     "SELECT * FROM staff WHERE username = ? AND isDeleted = 0",
     [username]
   );
 }

 export function getUserByEmail(email) {
   return db.query(
     "SELECT * FROM staff WHERE email = ? AND isDeleted = 0",
     [email]
   );
 }

 export function storeStaffOtp(email, otp) {
   return db.query("UPDATE staff SET otp = ? WHERE email = ?", [otp, email]);
 }

 export function resetStaffPassword(email, password, otp) {
   return db.query(
     "UPDATE staff SET password = ?, otp = NULL WHERE email = ? AND otp = ?",
     [password, email, otp]
   );
 }
export function updateStaffContact(staffId, email, mobile) {
  return db.query(
    "UPDATE staff SET email = ?, mobile = ? WHERE staffId = ? AND isDeleted = 0",
    [email, mobile, staffId]
  );
}



export function addDesignation(data) {
  const sql = `
    INSERT INTO designation
    (staffId, designation, from_date, to_date, resolution_no, order_no, order_copy, remarks, flag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
  `;
  return db.query(sql, data);
}

export function getDesignationByStaffId(staffId) {
  return db.query(
    "SELECT * FROM designation WHERE staffId = ? ORDER BY created_at DESC",
    [staffId]
  );
}

export function getAllDesignationsForAdmin() {
  return db.query(`
    SELECT d.*, s.firstName, s.lastName
    FROM designation d
    LEFT JOIN staff s ON d.staffId = s.staffId
    ORDER BY d.created_at DESC
  `);
}

/* GET designation by ID */
export function getDesignationById(id) {
  return db.query("SELECT * FROM designation WHERE id = ?", [id]);
}

/* INSERT into designation_history */
export function insertDesignationHistory(designation) {
  const sql = `
    INSERT INTO designation_history
    (staffId, designation, from_date, to_date, resolution_no, order_no, order_copy, remarks, flag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    designation.staffId,
    designation.designation,
    designation.from_date,
    designation.to_date,
    designation.resolution_no,
    designation.order_no,
    designation.order_copy,
    designation.remarks,
    designation.flag,
  ];
  return db.query(sql, values);
}

/* UPDATE designation by ID */
export function updateDesignationById(id, data) {
  const fields = [];
  const values = [];

  Object.keys(data).forEach((key) => {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  });

  if (!fields.length) throw new Error("No fields to update");

  const sql = `UPDATE designation SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  return db.query(sql, values);
}



export function updateDesignationStatus(id, flag) {
  return db.query("UPDATE designation SET flag = ? WHERE id = ?", [flag, id]);
}


export function getPendingDesignationCount() {
  return db.query("SELECT COUNT(*) AS count FROM designation WHERE flag = 0");
}

export function getPendingQualificationCount() {
  return db.query("SELECT COUNT(*) AS count FROM qualifications WHERE status = 0");
}

export function getPendingAdditionalPostCount() {
  return db.query("SELECT COUNT(*) AS count FROM additional_posts WHERE status = 0");
}

export function getPendingExperienceCount() {
  return db.query(
    "SELECT COUNT(*) AS count FROM additional_experience WHERE flag = 0"
  );
}
