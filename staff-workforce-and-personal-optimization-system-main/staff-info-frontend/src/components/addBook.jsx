import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { addBook, getBooksByStaff } from "../api/bookApi";

const BookPublicationAdd = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [form, setForm] = useState({
    type: "Book",
    author_name: "",
    title: "",
    publisher_name: "",
    publisher_address: "",
    isbn_issn: "",
    page_from: "",
    page_to: "",
    month: "",
    year: "",
    url: "",
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ==================== FETCH BOOKS ==================== */
  const fetchBooks = useCallback(async () => {
    try {
      const data = await getBooksByStaff(staffId);
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && staffId !== "—") {
      fetchBooks();
    }
  }, [staffId, fetchBooks]);

  /* ==================== SUBMIT ==================== */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        staffId: Number(staffId),
        ...form,
        year: form.year === "" ? null : form.year,
      };

      const savedBook = await addBook(payload);
      setBooks((prev) => sortBooks([savedBook, ...prev]));

      alert("Books / Popular Article added successfully");

      setForm({
        type: "Book",
        author_name: "",
        title: "",
        publisher_name: "",
        publisher_address: "",
        isbn_issn: "",
        page_from: "",
        page_to: "",
        month: "",
        year: "",
        url: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit Book / Article");
    } finally {
      setLoading(false);
    }
  };

  /* ==================== SORT LOGIC ==================== */
  const monthOrder = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
  };

  const sortBooks = (data) =>
    [...data].sort((a, b) => {
      if (Number(b.year) !== Number(a.year)) {
        return Number(b.year) - Number(a.year);
      }
      return (monthOrder[b.month] || 0) - (monthOrder[a.month] || 0);
    });

  const sortedBooks = sortBooks(books);

  /* ==================== COUNTS ==================== */
  const totalBooks = sortedBooks.filter(
    (b) => b.type?.toLowerCase() === "book"
  ).length;

  const totalPapers = sortedBooks.filter(
    (b) => b.type?.toLowerCase() === "popular article"
  ).length;

  /* ==================== DISPLAY FORMAT ==================== */
  const renderText = (b) => (
    <>
      {b.author_name}, <i>{b.title}</i>, {b.publisher_address}
      {b.publisher_address && b.publisher_name ? ": " : ""}
      {b.publisher_name}
      {b.isbn_issn && `, ${b.isbn_issn}`}
      {", pp. "}
      {b.page_from}-{b.page_to}. {b.month} {b.year}
      {b.url && (
        <>
          <br />
          <a 
            href={b.url} 
            target="_blank" 
            rel="noreferrer" 
            style={{ 
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            {b.url}
          </a>
        </>
      )}
      .
    </>
  );

  const years = Array.from({ length: 40 }, (_, i) => 1990 + i);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "260px",
          background: "#f3f4f6",
          padding: "40px",
          overflowY: "auto",
        }}
      >
        {/* Form Card */}
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            background: "#fff",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            marginBottom: "30px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
              }}
            >
              Books / Popular Articles
            </h2>
          </div>

          <form onSubmit={submit}>
            {/* Publication Type Section */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#334155",
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Book"
                    checked={form.type === "Book"}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span>📚 Book</span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#334155",
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Popular Article"
                    checked={form.type === "Popular Article"}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span>📰 Popular Article</span>
                </label>
              </div>
            </div>

            {/* Publication Details */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Author Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    ✍️ Author Name
                  </label>
                  <input
                    name="author_name"
                    value={form.author_name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Title */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    📖 Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Publisher Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    🏢 Publisher Name
                  </label>
                  <input
                    name="publisher_name"
                    value={form.publisher_name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Publisher Address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    📍 Publisher Address
                  </label>
                  <input
                    name="publisher_address"
                    value={form.publisher_address}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* ISBN / ISSN */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    🔢 ISBN / ISSN
                  </label>
                  <input
                    name="isbn_issn"
                    value={form.isbn_issn}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Page From */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    📄 Page From
                  </label>
                  <input
                    name="page_from"
                    value={form.page_from}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Page To */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    📄 Page To
                  </label>
                  <input
                    name="page_to"
                    value={form.page_to}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Month */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    📅 Month
                  </label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    <option value="">Select Month</option>
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    📅 Year
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* URL */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    🔗 URL
                  </label>
                  <input
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: "14px 40px",
                borderRadius: "25px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "15px",
                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(102, 126, 234, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(102, 126, 234, 0.4)";
                }
              }}
            >
              {loading ? "Saving..." : "✓ Submit Publication"}
            </button>
          </form>
        </div>

        {/* Publications List Card */}
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            background: "#fff",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          {/* Books Section */}
          <div style={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontSize: "20px",
                color: "#1e293b",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
                fontWeight: "600",
              }}
            >
              📚 List of Books Published – {totalBooks}
            </h3>
            
            {totalBooks > 0 ? (
              <ol
                style={{
                  paddingLeft: "45px",
                  marginTop: "20px",
                  lineHeight: "1.8",
                }}
              >
                {sortedBooks
                  .filter((b) => b.type?.toLowerCase() === "book")
                  .map((b, index) => (
                    <li
                      key={b.id}
                      style={{
                        marginBottom: "16px",
                        fontSize: "15px",
                        color: "#334155",
                        padding: "12px",
                        background: index % 2 === 0 ? "#f8fafc" : "#fff",
                        borderRadius: "8px",
                      }}
                    >
                      {renderText(b)}
                    </li>
                  ))}
              </ol>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                  📭
                </div>
                No books found
              </div>
            )}
          </div>

          {/* Popular Articles Section */}
          <div>
            <h3
              style={{
                fontSize: "20px",
                color: "#1e293b",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
                fontWeight: "600",
              }}
            >
              📰 List of Popular Articles Published – {totalPapers}
            </h3>
            
            {totalPapers > 0 ? (
              <ol
                style={{
                  paddingLeft: "45px",
                  marginTop: "20px",
                  lineHeight: "1.8",
                }}
              >
                {sortedBooks
                  .filter((b) => b.type?.toLowerCase() === "popular article")
                  .map((b, index) => (
                    <li
                      key={b.id}
                      style={{
                        marginBottom: "16px",
                        fontSize: "15px",
                        color: "#334155",
                        padding: "12px",
                        background: index % 2 === 0 ? "#f8fafc" : "#fff",
                        borderRadius: "8px",
                      }}
                    >
                      {renderText(b)}
                    </li>
                  ))}
              </ol>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                  📭
                </div>
                No popular articles found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPublicationAdd;