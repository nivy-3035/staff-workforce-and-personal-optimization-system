import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { addExperience, getMyExperiences } from "../api/experienceApi";

const AddExperience = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    experience_type: "Industry",
    industry_worked: "",
    from_date: "",
    to_date: "",
    remarks: "",
  });

  /* ===== Load Experiences ===== */
  useEffect(() => {
    const loadExperience = async () => {
      try {
        const res = await getMyExperiences(staffId);
        setList(Array.isArray(res) ? res : []);
      } catch {
        setList([]);
      }
    };

    loadExperience();
  }, [staffId]);

  /* ===== Submit ===== */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("staffId", staffId);
    fd.append("experience_type", form.experience_type);
    fd.append("industry_worked", form.industry_worked);
    fd.append("from_date", form.from_date);
    fd.append("to_date", form.to_date);
    fd.append("remarks", form.remarks);
    if (file) fd.append("certificate", file);

    try {
      const res = await addExperience(fd);
      alert(res.message || "Experience added successfully");

      setForm({
        experience_type: "Industry",
        industry_worked: "",
        from_date: "",
        to_date: "",
        remarks: "",
      });
      setFile(null);
      setFileName("");

      // Reload experience list
      const updated = await getMyExperiences(staffId);
      setList(Array.isArray(updated) ? updated : []);
    } catch {
      alert("Failed to submit experience");
    } finally {
      setLoading(false);
    }
  };

  const statusText = (f) =>
    f === 0 ? "Pending" : f === 1 ? "Approved" : "Rejected";

  const statusColor = (f) =>
    f === 0 ? "#f59e0b" : f === 1 ? "#10b981" : "#ef4444";

  /* ===== Format date as DD-MM-YYYY ===== */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
              Additional Experience
            </h2>
            
          </div>

          <form onSubmit={submit}>
            {/* Experience Type Section */}
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
                    value="Industry"
                    checked={form.experience_type === "Industry"}
                    onChange={(e) =>
                      setForm({ ...form, experience_type: e.target.value })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span>🏭 Industry</span>
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
                    value="Academic"
                    checked={form.experience_type === "Academic"}
                    onChange={(e) =>
                      setForm({ ...form, experience_type: e.target.value })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span>🎓 Academic</span>
                </label>
              </div>
            </div>

            {/* Experience Details */}
            <div style={{ marginBottom: "32px" }}>
              
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Industry / Institution */}
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
                    🏢 Industry / Institution Worked
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
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    value={form.industry_worked}
                    onChange={(e) =>
                      setForm({ ...form, industry_worked: e.target.value })
                    }
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
                    value={form.from_date}
                    onChange={(e) =>
                      setForm({ ...form, from_date: e.target.value })
                    }
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
                    value={form.to_date}
                    onChange={(e) =>
                      setForm({ ...form, to_date: e.target.value })
                    }
                  />
                </div>



 {/* Certificate Upload */}
            <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📎 Order Copy
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

                {/* Remarks */}
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
                    📝 Remarks
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
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    value={form.remarks}
                    onChange={(e) =>
                      setForm({ ...form, remarks: e.target.value })
                    }
                  />
                </div>
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
              ✓ Submit Experience
            </button>
          </form>
        </div>

        {/* Table Card */}
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
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{
            fontSize: "20px",
            color: "#1e293b",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid #e2e8f0",
            fontWeight: "600"
          }}>
            📊 My Experience
          </h3>
            
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderTopLeftRadius: "12px",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Organization
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Duration
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderTopRightRadius: "12px",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 ? (
                  list.map((e, index) => (
                    <tr
                      key={e.id}
                      style={{
                        background: index % 2 === 0 ? "#f8fafc" : "white",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#f8fafc" : "#fff"}>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#334155",
                          fontWeight: "500",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {e.experience_type === "Industry" ? "🏭" : "🎓"}
                          {e.experience_type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {e.industry_worked}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {`${formatDate(e.from_date)} to ${formatDate(
                          e.to_date
                        )}`}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 16px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                            background:
                              e.flag === 1
                                ? "#d1fae5"
                                : e.flag === 2
                                ? "#fee2e2"
                                : "#fef3c7",
                            color: statusColor(e.flag),
                          }}
                        >
                          {statusText(e.flag)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
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
                      No experience records found
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

export default AddExperience;