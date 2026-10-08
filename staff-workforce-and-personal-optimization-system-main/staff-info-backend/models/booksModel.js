import db from "../db.js";

export const addBook = async (data) => {
  const sql = `
    INSERT INTO books_publications
    (staffId, type, author_name, title, publisher_name, publisher_address,
     isbn_issn, page_from, page_to, month, year, url)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const [result] = await db.query(sql, [
    data.staffId,
    data.type,
    data.author_name,
    data.title,
    data.publisher_name,
    data.publisher_address,
    data.isbn_issn,
    data.page_from,
    data.page_to,
    data.month,
    data.year,
    data.url,
  ]);

  // ✅ return inserted row
  return {
    id: result.insertId,
    ...data,
  };
};

// models/booksModel.js
export const getMyBooks = async (staffId) => {
  const sql = "SELECT * FROM books_publications WHERE staffId = ?";
  const [rows] = await db.query(sql, [staffId]);
  return rows;
};

export const getBookById = async (id) => {
  const sql = "SELECT * FROM books_publications WHERE id = ?";
  const [rows] = await db.query(sql, [id]);
  return rows;
};


// Move old book to history table
export const addBookHistory = async (book) => {
  const sql = `
    INSERT INTO books_publications_history
    (book_id, staffId, type, author_name, title, publisher_name, publisher_address,
     isbn_issn, page_from, page_to, month, year, url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    book.id,           // book_id
    book.staffId,
    book.type,
    book.author_name,
    book.title,
    book.publisher_name,
    book.publisher_address,
    book.isbn_issn,
    book.page_from,
    book.page_to,
    book.month,
    book.year,
    book.url,
  ]);

  return result;
};

// UPDATE LATEST BOOK BY STAFF ID
export const updateBookById = async (id, data) => {
  const sql = `
    UPDATE books_publications
    SET
      type = ?,
      author_name = ?,
      title = ?,
      publisher_name = ?,
      publisher_address = ?,
      isbn_issn = ?,
      page_from = ?,
      page_to = ?,
      month = ?,
      year = ?,
      url = ?
    WHERE id = ?
    
  `;

  const [result] = await db.query(sql, [
    data.type,
    data.author_name,
    data.title,
    data.publisher_name,
    data.publisher_address,
    data.isbn_issn,
    data.page_from,
    data.page_to,
    data.month,
    data.year,
    data.url,
    id,
  ]);

  return result; // gives affectedRows
};
