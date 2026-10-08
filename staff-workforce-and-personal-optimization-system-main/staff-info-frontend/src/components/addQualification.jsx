import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { addQualification, getMyQualifications } from "../api/qualificationApi";

const QualificationAdd = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    degree: "",
    major: "",
    completedYear: "",
    college: "",
    university: "",
  });

  /* ===== Load Qualifications ===== */
  const loadQualifications = async () => {
    try {
      const res = await getMyQualifications(staffId);
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  };

  useEffect(() => {
    loadQualifications();
  }, [staffId]);

  /* ===== Submit Qualification ===== */
  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("staffId", staffId);
    fd.append("degree", form.degree);
    fd.append("major", form.major);
    fd.append("completedYear", form.completedYear);
    fd.append("college", form.college);
    fd.append("university", form.university);
    if (file) fd.append("degreeCopy", file);

    try {
      const res = await addQualification(fd);
      if (res.message) alert(res.message);

      setForm({
        degree: "",
        major: "",
        completedYear: "",
        college: "",
        university: "",
      });
      setFile(null);
      setFileName("");
      loadQualifications();
    } catch (err) {
      console.error(err);
      alert("Error submitting qualification");
    }
  };

  
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <div style={{ flex: 1, marginLeft: "260px", background: "#f3f4f6", padding: "40px", overflowY: "auto" }}>
        
        {/* Form Card */}
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto 40px auto",
          background: "#fff",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}>
          
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
              Qualification
            </h2>
          </div>
          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {/* Degree */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  🎓 Degree
                </label>
                <input
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
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                />
              </div>

              {/* Major */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📚 Major
                </label>
                <input
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
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                />
              </div>

              {/* Completed Year */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📅 Completed Year
                </label>
                <input
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
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.completedYear}
                  onChange={(e) => setForm({ ...form, completedYear: e.target.value })}
                />
              </div>

              {/* Degree Copy */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📎 Degree Copy
                </label>
                <label style={{
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
                  color: "#64748b"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background = "#f8fafc";
                }}>
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

              {/* College */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  🏫 College
                </label>
                <input
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
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                />
              </div>

              {/* University */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  🏛️ University
                </label>
                <input
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
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                marginTop: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: "14px 40px",
                borderRadius: "25px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.4)";
              }}
            >
              ✓ Submit Qualification
            </button>
          </form>
        </div>

        {/* Table Card */}
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}>
          <h3 style={{
            fontSize: "20px",
            color: "#1e293b",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid #e2e8f0",
            fontWeight: "600"
          }}>
            📊 My Qualifications
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "16px",
                    borderTopLeftRadius: "12px"
                  }}>
                    Degree
                  </th>
                  <th style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "16px"
                  }}>
                    Major
                  </th>
                  <th style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "14px",
                    borderTopRightRadius: "12px"
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 ? (
                  list.map((q, idx) => (
                    <tr key={q.id} style={{
                      background: idx % 2 === 0 ? "#f8fafc" : "#fff",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "#f8fafc" : "#fff"}>
                      <td style={{
                        padding: "16px",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "14px",
                        color: "#1e293b",
                        fontWeight: "500"
                      }}>
                        {q.degree}
                      </td>
                      <td style={{
                        padding: "16px",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "14px",
                        color: "#64748b"
                      }}>
                        {q.major}
                      </td>
                      <td style={{
                        padding: "16px",
                        borderBottom: "1px solid #e2e8f0"
                      }}>
                        <span style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: q.status === 1 ? "#d1fae5" : q.status === 2 ? "#fee2e2" : "#fef3c7",
                          color: q.status === 1 ? "#065f46" : q.status === 2 ? "#991b1b" : "#92400e"
                        }}>
                          {q.status === 0 ? "⏳ Pending" : q.status === 1 ? "✓ Approved" : "✗ Rejected"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                      fontSize: "14px"
                    }}>
                      No qualifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationAdd;