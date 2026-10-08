import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { addPublication, getPublicationsByStaff } from "../api/publicationApi";

const AddPublication = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [form, setForm] = useState({
    scope: "International",
    publishedMonth: "",
    publishedYear: "",
    authors: "",
    paperTitle: "",
    journalName: "",
    volumeNumber: "",
    issueNumber: "",
    publicationYearOrDoi: "",
    pageFrom: "",
    pageTo: "",
  });

  const [message, setMessage] = useState("");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ==================== FETCH PUBLICATIONS ====================
  const fetchPublications = useCallback(async () => {
    try {
      const data = await getPublicationsByStaff(staffId);
      setPublications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch publications", err);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && staffId !== "—") {
      fetchPublications();
    }
  }, [staffId, fetchPublications]);

  // ==================== SUBMIT ====================
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPublication({ staffId, ...form });
      setMessage("Publication submitted successfully");
      setForm({
        scope: "International",
        publishedMonth: "",
        publishedYear: "",
        authors: "",
        paperTitle: "",
        journalName: "",
        volumeNumber: "",
        issueNumber: "",
        publicationYearOrDoi: "",
        pageFrom: "",
        pageTo: "",
      });
      fetchPublications();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add publication");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILTER PUBLICATIONS ====================
  const nationalPublications = publications.filter(
    (p) => p.scope === "National"
  );

  const internationalPublications = publications.filter(
    (p) => p.scope === "International"
  );

  const nationalCount = nationalPublications.length;
  const internationalCount = internationalPublications.length;
  
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
              Publication
            </h2>
          </div>

          <form onSubmit={submit}>
            {/* Scope Type Section */}
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
                    name="scope"
                    value="National"
                    checked={form.scope === "National"}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span> National</span>
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
                    name="scope"
                    value="International"
                    checked={form.scope === "International"}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span> International</span>
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
                

                {/* Author(s) Name */}
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
                    ✍️ Author(s) Name
                  </label>
                  <input
                    name="authors"
                    value={form.authors}
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

                {/* Title of Paper */}
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
                    📄 Title of Paper
                  </label>
                  <input
                    name="paperTitle"
                    value={form.paperTitle}
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

                {/* Journal Name */}
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
                    📖 Journal Name
                  </label>
                  <input
                    name="journalName"
                    value={form.journalName}
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
                {/* Published Month */}
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
                    📅 Published Month
                  </label>
                  <select
                    name="publishedMonth"
                    value={form.publishedMonth}
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

                {/* Published Year */}
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
                    📅 Published Year
                  </label>
                  <select
                    name="publishedYear"
                    value={form.publishedYear}
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

                {/* Volume Number */}
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
                    🔢 Volume Number
                  </label>
                  <input
                    name="volumeNumber"
                    value={form.volumeNumber}
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

                {/* Issue Number */}
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
                    🔢 Issue Number
                  </label>
                  <input
                    name="issueNumber"
                    value={form.issueNumber}
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

                {/* Year of Publication / DOI */}
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
                    🔗 Year of Publication / DOI
                  </label>
                  <input
                    name="publicationYearOrDoi"
                    value={form.publicationYearOrDoi}
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
                    name="pageFrom"
                    value={form.pageFrom}
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
                    name="pageTo"
                    value={form.pageTo}
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

            {/* Success/Error Message */}
            {message && (
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  background: message.includes("successfully")
                    ? "#d1fae5"
                    : "#fee2e2",
                  color: message.includes("successfully") ? "#10b981" : "#ef4444",
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}

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
          {/* National Publications Section */}
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
               National Publications – {nationalCount}
            </h3>
            
            {nationalCount > 0 ? (
              <ol
                style={{
                  paddingLeft: "45px",
                  marginTop: "20px",
                  lineHeight: "1.8",
                }}
              >
                {nationalPublications.map((p, index) => (
                  <li
                    key={p.id}
                    style={{
                      marginBottom: "16px",
                      fontSize: "15px",
                      color: "#334155",
                      padding: "12px",
                      background: index % 2 === 0 ? "#f8fafc" : "#fff",
                      borderRadius: "8px",
                    }}
                  >
                    {p.authors}, "{p.paper_title}", <i>{p.journal_name}</i>, 
                    Volume {p.volume_number}, Number {p.issue_number}, {p.published_month} {p.published_year}, 
                    pp. {p.page_from}-{p.page_to}. {p.publicationYearOrDoi}
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
                No national publications found
              </div>
            )}
          </div>

          {/* International Publications Section */}
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
               International Publications – {internationalCount}
            </h3>
            
            {internationalCount > 0 ? (
              <ol
                style={{
                  paddingLeft: "45px",
                  marginTop: "20px",
                  lineHeight: "1.8",
                }}
              >
                {internationalPublications.map((p, index) => (
                  <li
                    key={p.id}
                    style={{
                      marginBottom: "16px",
                      fontSize: "15px",
                      color: "#334155",
                      padding: "12px",
                      background: index % 2 === 0 ? "#f8fafc" : "#fff",
                      borderRadius: "8px",
                    }}
                  >
                    {p.authors}, "{p.paper_title}", <i>{p.journal_name}</i>, 
                    Volume {p.volume_number}, Number {p.issue_number}, {p.published_month} {p.published_year}, 
                    pp. {p.page_from}-{p.page_to}. {p.publicationYearOrDoi}
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
                No international publications found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPublication;