const BASE_URL = "http://localhost:5000/api/books";

/* ================================
   ADD BOOK / POPULAR ARTICLE
================================ */
export async function addBook(data) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to add book");
  return result;
}

/* ================================
   GET MY BOOKS / ARTICLES
================================ */
export async function getBooksByStaff(staffId) {
  const res = await fetch(`${BASE_URL}/${staffId}`);

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch books");
  return result;
}


export async function updateBookByStaff(bookId, data) {
  const res = await fetch(`${BASE_URL}/update/${bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
}