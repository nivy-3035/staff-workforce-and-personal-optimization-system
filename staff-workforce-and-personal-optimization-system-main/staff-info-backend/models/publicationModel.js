import db from "../db.js";

/* ADD */
export function addPublication(data) {
  return db.query(
    `INSERT INTO publications
    (staffId, scope, published_month, published_year, authors,
     paper_title, journal_name, volume_number, issue_number,
     publication_year_or_doi, page_from, page_to)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.staffId,
      data.scope,
      data.publishedMonth,
      data.publishedYear,
      data.authors,
      data.paperTitle,
      data.journalName,
      data.volumeNumber || null,
      data.issueNumber || null,
      data.publicationYearOrDoi || null,
      data.pageFrom || null,
      data.pageTo || null,
    ]
  );
}

/* FETCH BY STAFF */
export function getByStaffId(staffId) {
  return db.query(
    "SELECT * FROM publications WHERE staffId = ? ORDER BY id DESC",
    [staffId]
  );
}


/* GET SINGLE PUBLICATION */
export function getById(id) {
  return db.query("SELECT * FROM publications WHERE id = ?", [id]);
}

/* MOVE OLD DATA TO HISTORY */
export function moveToHistory(id) {
  return db.query(
    `INSERT INTO publication_history
    (publicationId, staffId, scope, published_month, published_year, authors,
     paper_title, journal_name, volume_number, issue_number,
     publication_year_or_doi, page_from, page_to)
    SELECT id, staffId, scope, published_month, published_year, authors,
           paper_title, journal_name, volume_number, issue_number,
           publication_year_or_doi, page_from, page_to
    FROM publications
    WHERE id = ?`,
    [id]
  );
}

/* UPDATE PUBLICATION */
export function updatePublication(id, data) {
  return db.query(
    `UPDATE publications SET
      scope = ?, 
      published_month = ?,
      published_year = ?,
      authors = ?,
      paper_title = ?,
      journal_name = ?,
      volume_number = ?,
      issue_number = ?,
      publication_year_or_doi = ?,
      page_from = ?,
      page_to = ?
    WHERE id = ?`,
    [
      data.scope,
      data.publishedMonth,
      data.publishedYear,
      data.authors,
      data.paperTitle,
      data.journalName,
      data.volumeNumber || null,
      data.issueNumber || null,
      data.publicationYearOrDoi || null,
      data.pageFrom || null,
      data.pageTo || null,
      id,
    ]
  );
}