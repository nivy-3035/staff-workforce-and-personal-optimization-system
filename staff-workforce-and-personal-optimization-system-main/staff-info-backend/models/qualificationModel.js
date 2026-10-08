import db from "../db.js";

// ADD QUALIFICATION (NO RESTRICTION)
export function addQualification(data) {
  return db.query(
    `INSERT INTO qualifications
     (staffId, degree, major, completedYear, college, university, degreeCopy, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      data.staffId,
      data.degree,
      data.major,
      data.completedYear,
      data.college,
      data.university,
      data.degreeCopy,
    ]
  );
}

// GET ALL STAFF QUALIFICATIONS (ALL STATUS)
export function getMyQualifications(staffId) {
  return db.query(
    "SELECT * FROM qualifications WHERE staffId = ? ORDER BY id DESC",
    [staffId]
  );
}


/* ================= HISTORY ================= */
export function moveQualificationToHistory(id) {
  return db.query(
    `INSERT INTO qualification_history
     (qualificationId, staffId, degree, major, completedYear, college, university, degreeCopy, status)
     SELECT id, staffId, degree, major, completedYear, college, university, degreeCopy, status
     FROM qualifications
     WHERE id = ?`,
    [id]
  );
}

export async function getQualificationById(id) {
  const [rows] = await db.query(
    "SELECT * FROM qualifications WHERE id = ?",
    [id]
  );
  return rows[0];
}

/* ================= UPDATE ================= */
export function updateQualification(id, data) {
  return db.query(
    `UPDATE qualifications
     SET degree = ?, major = ?, completedYear = ?, college = ?, university = ?
     WHERE id = ?`,
    [
      data.degree,
      data.major,
      data.completedYear,
      data.college,
      data.university,
      id,
    ]
  );
}




// ADMIN
export function getAllQualifications() {
  return db.query(`
    SELECT q.*, CONCAT(s.firstName,' ',s.lastName) AS name
    FROM qualifications q
    LEFT JOIN staff s ON q.staffId = s.staffId
    ORDER BY q.id DESC
  `);
}

export function updateQualificationStatus(id, status) {
  return db.query(
    "UPDATE qualifications SET status = ? WHERE id = ?",
    [status, id]
  );
}

