import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { addDesignation, getMyDesignations } from "../api/staffApi";

const AddDesignation = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    designation: "",
    resolution_no: "",
    order_no: "",
    from_date: "",
    to_date: "",
    remarks: "",
  });

  /* ===== Load Designations ===== */
  useEffect(() => {
    const loadDesignations = async () => {
      try {
        const res = await getMyDesignations(staffId);
        setList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        setList([]);
      }
    };

    loadDesignations();
  }, [staffId]);

  /* ===== Submit Designation ===== */
  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("staffId", staffId);
    fd.append("designation", form.designation);
    fd.append("from_date", form.from_date);
    fd.append("resolution_no", form.resolution_no);
    fd.append("order_no", form.order_no);
    fd.append("remarks", form.remarks);

    if (form.to_date) fd.append("to_date", form.to_date);
    if (file) fd.append("order_copy", file);

    try {
      const res = await addDesignation(fd);
      if (res.message) alert(res.message);

      setForm({
        designation: "",
        resolution_no: "",
        order_no: "",
        from_date: "",
        to_date: "",
        remarks: "",
      });
      setFile(null);
      setFileName("");
      
      // Reload list
      const updated = await getMyDesignations(staffId);
      setList(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error submitting designation");
    }
  };

  /* ===== Format Dates as DD-MM-YYYY or Till Date ===== */
  const formatDate = (date) => {
    if (!date) return "Till Date";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
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
              Designation
            </h2>
          </div>
          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {/* Designation */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  💼 Designation
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
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                />
              </div>

              {/* Resolution No */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📄 Resolution No
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
                  value={form.resolution_no}
                  onChange={(e) => setForm({ ...form, resolution_no: e.target.value })}
                />
              </div>

              {/* Order No */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📋 Order No
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
                  value={form.order_no}
                  onChange={(e) => setForm({ ...form, order_no: e.target.value })}
                />
              </div>

              {/* Order Copy */}
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

              {/* From Date */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
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
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.from_date}
                  onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                />
              </div>

              {/* To Date */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📅 To Date
                </label>
                <input
                  type="date"
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
                  value={form.to_date}
                  onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                />
                {!form.to_date && (
                  <small style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
                    💡 Leave empty for "Till Date"
                  </small>
                )}
              </div>

              {/* Remarks */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155"
                }}>
                  📝 Remarks
                </label>
                <textarea
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
                    minHeight: "100px",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
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
              ✓ Submit Designation
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
            📊 My Designations
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
                    Designation
                  </th>
                  <th style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "16px"
                  }}>
                    Duration
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
                  list.map((d, idx) => (
                    <tr key={d.id} style={{
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
                        {d.designation}
                      </td>
                      <td style={{
                        padding: "16px",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "14px",
                        color: "#64748b"
                      }}>
                        {`${formatDate(d.from_date)} to ${formatDate(d.to_date)}`}
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
                          background: d.flag === 1 ? "#d1fae5" : d.flag === 2 ? "#fee2e2" : "#fef3c7",
                          color: d.flag === 1 ? "#065f46" : d.flag === 2 ? "#991b1b" : "#92400e"
                        }}>
                          {d.flag === 0 ? "⏳ Pending" : d.flag === 1 ? "✓ Approved" : "✗ Rejected"}
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
                      No designations found
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

export default AddDesignation;