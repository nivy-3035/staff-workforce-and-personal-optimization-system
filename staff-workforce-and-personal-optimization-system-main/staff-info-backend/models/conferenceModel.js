import db from "../db.js";

export function addConference(data) {
  const sql = `
    INSERT INTO conferences (
      staffId, conference_type, activity_type,
      author_name, publication_year, paper_title,
      conference_title, conference_from, conference_to,
      location, page_from, page_to,
      place_of_publication, publisher, file_path
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  return db.query(sql, data);
}

export function getConferenceByStaffId(staffId) {
  return db.query(
    "SELECT * FROM conferences WHERE staffId = ? ORDER BY created_at DESC",
    [staffId]
  );
}

export function getConferenceCountByStaff(staffId) {
  return db.query(
    "SELECT COUNT(*) AS count FROM conferences WHERE staffId = ?",
    [staffId]
  );
}
export function getConferenceById(id) {
  return db.query(
    "SELECT * FROM conferences WHERE id = ?",
    [id]
  );
}

/* ===== MOVE TO HISTORY ===== */
export function moveConferenceToHistory(id) {
  const sql = `
    INSERT INTO conference_history (
      id, staffId, conference_type, activity_type,
      author_name, publication_year, paper_title,
      conference_title, conference_from, conference_to,
      location, page_from, page_to,
      place_of_publication, publisher, file_path, created_at
    )
    SELECT
      id, staffId, conference_type, activity_type,
      author_name, publication_year, paper_title,
      conference_title, conference_from, conference_to,
      location, page_from, page_to,
      place_of_publication, publisher, file_path, created_at
    FROM conferences
    WHERE id = ?
  `;
  return db.query(sql, [id]);
}

/* ================= UPDATE ================= */
export function updateConference(id, data) {
  const sql = `
    UPDATE conferences SET
      conference_type = ?,
      activity_type = ?,
      author_name = ?,
      publication_year = ?,
      paper_title = ?,
      conference_title = ?,
      conference_from = ?,
      conference_to = ?,
      location = ?,
      page_from = ?,
      page_to = ?,
      place_of_publication = ?,
      publisher = ?,
      file_path = ?
    WHERE id = ?
  `;
  return db.query(sql, [...data, id]);
}

