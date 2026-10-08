import db from "../db.js";

/* ================================
   ADD EXPERIENCE (STAFF)
   ================================ */
export function addExperience(data) {
  return db.query(
    `INSERT INTO additional_experience
     (staffId, experience_type, industry_worked, from_date, to_date, certificate, remarks, flag)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      data.staffId,
      data.experience_type,
      data.industry_worked,
      data.from_date,
      data.to_date,
      data.certificate,
      data.remarks,
    ]
  );
}

/* ================================
   STAFF - VIEW MY EXPERIENCE
   ================================ */
export function getMyExperience(staffId) {
  return db.query(
    `SELECT * FROM additional_experience
     WHERE staffId = ?
     ORDER BY created_at DESC`,
    [staffId]
  );
}

/* ================================
   GET EXPERIENCE BY ID
   ================================ */
export async function getExperienceById(id) {
  const [rows] = await db.query(
    "SELECT * FROM additional_experience WHERE id = ?",
    [id]
  );
  return rows[0];
}

/* ================================
   MOVE TO HISTORY
   ================================ */
export function moveExperienceToHistory(id) {
  return db.query(
    `INSERT INTO additional_experience_history
     (experienceId, staffId, experience_type, industry_worked,
      from_date, to_date, certificate, remarks, flag)
     SELECT id, staffId, experience_type, industry_worked,
            from_date, to_date, certificate, remarks, flag
     FROM additional_experience
     WHERE id = ?`,
    [id]
  );
}

/* ================================
   UPDATE EXPERIENCE
   ================================ */
export function updateExperience(id, data) {
  return db.query(
    `UPDATE additional_experience
     SET experience_type = ?, industry_worked = ?,
         from_date = ?, to_date = ?, remarks = ?
     WHERE id = ?`,
    [
      data.experience_type,
      data.industry_worked,
      data.from_date,
      data.to_date,
      data.remarks,
      id,
    ]
  );
}


/* ================================
   ADMIN - VIEW ALL EXPERIENCE
   ================================ */
export function getAllExperience() {
  return db.query(`
    SELECT ae.*, CONCAT(s.firstName,' ',s.lastName) AS staffName
    FROM additional_experience ae
    LEFT JOIN staff s ON ae.staffId = s.staffId
    ORDER BY ae.created_at DESC
  `);
}

/* ================================
   ADMIN - UPDATE STATUS
   ================================ */
export function updateExperienceStatus(id, flag) {
  return db.query(
    `UPDATE additional_experience SET flag = ? WHERE id = ?`,
    [flag, id]
  );
}
