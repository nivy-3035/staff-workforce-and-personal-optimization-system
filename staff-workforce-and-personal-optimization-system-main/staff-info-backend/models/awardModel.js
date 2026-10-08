import db from "../db.js";

export function addAward(data) {
  const sql = `
    INSERT INTO awards (staffId, award_name, awarding_agent, award_year)
    VALUES (?, ?, ?, ?)
  `;
  return db.query(sql, data);
}

export function getAwardsByStaffId(staffId) {
  return db.query(
    "SELECT * FROM awards WHERE staffId = ? ORDER BY award_year DESC",
    [staffId]
  );
}

export function updateAward(data) {
  const sql = `
    UPDATE awards
    SET award_name = ?, awarding_agent = ?, award_year = ?
    WHERE id = ?
  `;
  return db.query(sql, data);
}
