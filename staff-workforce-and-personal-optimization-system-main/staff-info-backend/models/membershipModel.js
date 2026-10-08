import db from "../db.js";

export function addMembership(values) {
  return db.query(
    `INSERT INTO membership
     (staffId, membershipType, institution, membershipId)
     VALUES (?, ?, ?, ?)`,
    values
  );
}

export function getMembershipByStaffId(staffId) {
  return db.query(
    "SELECT * FROM membership WHERE staffId = ? ORDER BY id DESC",
    [staffId]
  );
}


/* MOVE OLD DATA TO HISTORY */
export function addMembershipHistory(values) {
  return db.query(
    `INSERT INTO membership_history
     (membership_id, staffId, membershipType, institution, membershipId)
     VALUES (?, ?, ?, ?, ?)`,
    values
  );
}

export function getMembershipById(id) {
  return db.query(
    "SELECT * FROM membership WHERE id=?",
    [id]
  );
}


/* UPDATE MEMBERSHIP BY STAFF ID */
export function updateMembershipById(id, values) {
  return db.query(
    `UPDATE membership
     SET membershipType=?, institution=?, membershipId=?
     WHERE id=?`,
    [...values, id]
  );
}
