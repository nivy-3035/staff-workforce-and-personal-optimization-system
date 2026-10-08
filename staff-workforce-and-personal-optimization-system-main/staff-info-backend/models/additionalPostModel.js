import db from "../db.js";

/* ADD ADDITIONAL POST */
export function addAdditionalPost(data) {
  // Ensure toDate is null if empty or string "null"
  const toDateValue =
    data.toDate && data.toDate !== "null" && data.toDate !== ""
      ? data.toDate
      : null;

  return db.query(
    `INSERT INTO additional_posts
     (staffId, post, fromDate, toDate, resolutionNo, orderNo, orderCopy, remarks, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      data.staffId,
      data.post,
      data.fromDate,
      toDateValue,   // ✅ Pass proper null if empty
      data.resolutionNo,
      data.orderNo,
      data.orderCopy,
      data.remarks,
    ]
  );
}

/* STAFF VIEW – ALL */
export function getPostByStaffId(staffId) {
  return db.query(
    "SELECT * FROM additional_posts WHERE staffId = ? ORDER BY createdAt DESC",
    [staffId]
  );
}

/* ADMIN VIEW */
export function getAllAdditionalPosts() {
  return db.query(
    "SELECT * FROM additional_posts ORDER BY createdAt DESC"
  );
}
/* GET BY ID */
export function getPostById(id) {
  return db.query(
    "SELECT * FROM additional_posts WHERE id = ?",
    [id]
  );
}

/* ADMIN STATUS UPDATE */
export function updateAdditionalPostStatus(id, status) {
  return db.query(
    "UPDATE additional_posts SET status = ? WHERE id = ?",
    [status, id]
  );
}

export function moveToHistory(id) {
  return db.query(
    `INSERT INTO additional_posts_history
     (originalId, staffId, post, fromDate, toDate, resolutionNo, orderNo)
     SELECT 
     id, staffId, post, fromDate, toDate, resolutionNo, orderNo
     FROM additional_posts
     WHERE id = ?`,
    [id]
  );
}





/* UPDATE ADDITIONAL POST (NO STATUS CHANGE) */
export function updateAdditionalPost(id, data) {
  const toDateValue =
    data.toDate === "" || data.toDate === "null"
      ? null
      : data.toDate;

  return db.query(
    `UPDATE additional_posts 
     SET post = ?, 
         fromDate = ?, 
         toDate = ?, 
         resolutionNo = ?, 
         orderNo = ?, 
         orderCopy = ?, 
         remarks = ?
     WHERE id = ?`,
    [
      data.post,
      data.fromDate,
      toDateValue,
      data.resolutionNo,
      data.orderNo,
      data.orderCopy,
      data.remarks,
      id,
    ]
  );
}