import { addBook, getMyBooks,getBookById,updateBookById,addBookHistory } from "../models/booksModel.js";
 export const addBookPublication = async (req, res) => {
  try {
    const book = await addBook(req.body);
    res.status(201).json(book); // ✅ return inserted book
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ message: "Failed to add publication" });
  }
};
export const getBooksByStaff = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const rows = await getMyBooks(staffId);

    res.json(rows); // ✅ RESPONSE SENT
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

/* UPDATE + HISTORY ✅ */
export const updateBookByIdd = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ get existing book
    const rows = await getBookById(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const oldBook = rows[0];

    // 2️⃣ move to history
    await addBookHistory(oldBook);

    // 3️⃣ update book
    await updateBookById(id, req.body);

    res.json({ message: "Book updated & history saved" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
