import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { addConference, getMyConferences } from "../api/conferenceApi";

const AddConference = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [conferenceType, setConferenceType] = useState("National");
  const [activityType, setActivityType] = useState("Paper Published");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    author_name: "",
    publication_year: "",
    paper_title: "",
    conference_title: "",
    conference_from: "",
    conference_to: "",
    location: "",
    page_from: "",
    page_to: "",
    place_of_publication: "",
    publisher: "",
  });

  const isPaper = activityType === "Paper Published";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ==================== FETCH ====================
  const fetchConferences = useCallback(async () => {
    try {
      const data = await getMyConferences(staffId);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch conferences", err);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && staffId !== "—") {
      fetchConferences();
    }
  }, [staffId, fetchConferences]);

  // ==================== SUBMIT ====================
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("staffId", staffId);
      fd.append("conference_type", conferenceType);
      fd.append("activity_type", activityType);

      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (file) fd.append("file", file);

      await addConference(fd);
      setMessage("Conference submitted successfully");

      setForm({
        author_name: "",
        publication_year: "",
        paper_title: "",
        conference_title: "",
        conference_from: "",
        conference_to: "",
        location: "",
        page_from: "",
        page_to: "",
        place_of_publication: "",
        publisher: "",
      });
      setFile(null);
      setFileName("");
      fetchConferences();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add conference");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILTER FOR LIST ====================
  const nationalList = list.filter((c) => c.conference_type === "National");
  const internationalList = list.filter(
    (c) => c.conference_type === "International"
  );

  const nationalCount = nationalList.length;
  const internationalCount = internationalList.length;

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
              Conference
            </h2>
          </div>

          <form onSubmit={submit}>
            {/* Conference Type Section */}
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
                    checked={conferenceType === "National"}
                    onChange={() => setConferenceType("National")}
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
                    checked={conferenceType === "International"}
                    onChange={() => setConferenceType("International")}
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

            {/* Activity Type Section */}
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
                    checked={isPaper}
                    onChange={() => setActivityType("Paper Published")}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span> Paper Published</span>
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
                    checked={!isPaper}
                    onChange={() => setActivityType("Conference Attended")}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span> Conference Attended</span>
                </label>
              </div>
            </div>

            {/* Conference Details */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Conditional Fields for Paper Published */}
                {isPaper && (
                  <>
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

                    {/* Year of Publication */}
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
                        📅 Year of Publication
                      </label>
                      <input
                        name="publication_year"
                        value={form.publication_year}
                        onChange={handleChange}
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

                    {/* Paper Title */}
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
                        📝 Paper Title
                      </label>
                      <input
                        name="paper_title"
                        value={form.paper_title}
                        onChange={handleChange}
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

                    {/* Place of Publication */}
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
                        📍 Place of Publication
                      </label>
                      <input
                        name="place_of_publication"
                        value={form.place_of_publication}
                        onChange={handleChange}
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

                    {/* Publisher */}
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
                        🏢 Publisher
                      </label>
                      <input
                        name="publisher"
                        value={form.publisher}
                        onChange={handleChange}
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
                  </>
                )}

                {/* Conference Title */}
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
                    🎤 Conference Title
                  </label>
                  <input
                    name="conference_title"
                    value={form.conference_title}
                    onChange={handleChange}
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

                {/* From Date */}
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
                    📅 From Date
                  </label>
                  <input
                    type="date"
                    name="conference_from"
                    value={form.conference_from}
                    onChange={handleChange}
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

                {/* To Date */}
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
                    📅 To Date
                  </label>
                  <input
                    type="date"
                    name="conference_to"
                    value={form.conference_to}
                    onChange={handleChange}
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

                {/* Location */}
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
                    📍 Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
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

                {/* File Upload */}
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
                    📎 Upload Certificate / Paper
                  </label>
                  <label
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px dashed #cbd5e1",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      textAlign: "center",
                      color: "#64748b",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                  >
                    {fileName || "📤 Choose file..."}
                    <input
                      type="file"
                      required
                      style={{ display: "none" }}
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setFileName(e.target.files[0]?.name || "");
                      }}
                    />
                  </label>
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
              {loading ? "Saving..." : "✓ Submit Conference"}
            </button>
          </form>
        </div>

        {/* Conferences List Card */}
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
          {/* National Conferences Section */}
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
               National Conferences – {nationalCount}
            </h3>

            {nationalCount > 0 ? (
              <ol
                style={{
                  paddingLeft: "45px",
                  marginTop: "20px",
                  lineHeight: "1.8",
                }}
              >
                {nationalList.map((c, index) => (
                  <li
                    key={c.id}
                    style={{
                      marginBottom: "16px",
                      fontSize: "15px",
                      color: "#334155",
                      padding: "12px",
                      background: index % 2 === 0 ? "#f8fafc" : "#fff",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>{c.conference_title}</strong> ({c.activity_type}) – {c.location}
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
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>📭</div>
                No national conferences found
              </div>
            )}
          </div>

          {/* International Conferences Section */}
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
               International Conferences – {internationalCount}
            </h3>

            {internationalCount > 0 ? (
              <ol
                style={{
                  paddingLeft: "45px",
                  marginTop: "20px",
                  lineHeight: "1.8",
                }}
              >
                {internationalList.map((c, index) => (
                  <li
                    key={c.id}
                    style={{
                      marginBottom: "16px",
                      fontSize: "15px",
                      color: "#334155",
                      padding: "12px",
                      background: index % 2 === 0 ? "#f8fafc" : "#fff",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>{c.conference_title}</strong> ({c.activity_type}) – {c.location}
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
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>📭</div>
                No international conferences found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddConference;