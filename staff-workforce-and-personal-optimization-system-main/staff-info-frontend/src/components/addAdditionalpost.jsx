import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  addAdditionalPost,
  getMyAdditionalPosts,
} from "../api/additionalPostApi";

const AdditionalPostAdd = () => {
  const staffId = Number(localStorage.getItem("staffId"));

  const [form, setForm] = useState({
    post: "",
    fromDate: "",
    toDate: "",
    resolutionNo: "",
    orderNo: "",
    remarks: "",
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===== LOAD POSTS ===== */
  const loadPosts = async () => {
    if (!staffId) {
      setList([]);
      return;
    }

    try {
      const res = await getMyAdditionalPosts(staffId);
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch failed", err);
      setList([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [staffId]);

  /* ===== SUBMIT ===== */
  const submit = async (e) => {
    e.preventDefault();

    if (!staffId) {
      alert("Staff ID missing. Please login again.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("staffId", staffId);
    fd.append("post", form.post);
    fd.append("fromDate", form.fromDate);
    fd.append("toDate", form.toDate || "");
    fd.append("resolutionNo", form.resolutionNo);
    fd.append("orderNo", form.orderNo);
    fd.append("remarks", form.remarks);
    if (file) fd.append("orderCopy", file);

    try {
      const res = await addAdditionalPost(fd);

      if (res?.success === false) {
        alert(res.message || "Submission failed");
        return;
      }

      alert("Additional Post submitted successfully");

      // reset
      setForm({
        post: "",
        fromDate: "",
        toDate: "",
        resolutionNo: "",
        orderNo: "",
        remarks: "",
      });
      setFile(null);
      setFileName("");

      loadPosts();
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== HELPERS ===== */
  const formatDate = (date) => {
    if (!date) return "Till Date";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const statusText = (s) =>
    s === 1 ? "Approved" : s === 2 ? "Rejected" : "Pending";

  const statusColor = (s) =>
    s === 1 ? "#10b981" : s === 2 ? "#ef4444" : "#f59e0b";

  /* ===== FIELD CONFIG ===== */
  const fieldConfig = {
    post: { label: "Post Title", icon: "💼" },
    resolutionNo: { label: "Resolution No", icon: "📋" },
    orderNo: { label: "Order No", icon: "📄" },
    fromDate: { label: "From Date", icon: "📅" },
    toDate: { label: "To Date", icon: "📅" },
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
              Additional Post
            </h2>
            
          </div>

          <form onSubmit={submit}>
            {/* Post Information */}
            <div style={{ marginBottom: "32px" }}>
              
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Post */}
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
                    {fieldConfig.post.icon} {fieldConfig.post.label}
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
                    value={form.post}
                    onChange={(e) => setForm({ ...form, post: e.target.value })}
                  />
                </div>

                {/* Resolution No */}
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
                    {fieldConfig.resolutionNo.icon}{" "}
                    {fieldConfig.resolutionNo.label}
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
                    value={form.resolutionNo}
                    onChange={(e) =>
                      setForm({ ...form, resolutionNo: e.target.value })
                    }
                  />
                </div>

                {/* Order No */}
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
                    {fieldConfig.orderNo.icon} {fieldConfig.orderNo.label}
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
                    value={form.orderNo}
                    onChange={(e) =>
                      setForm({ ...form, orderNo: e.target.value })
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
                    {fieldConfig.fromDate.icon} {fieldConfig.fromDate.label}
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
                    value={form.fromDate}
                    onChange={(e) =>
                      setForm({ ...form, fromDate: e.target.value })
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
                    {fieldConfig.toDate.icon} {fieldConfig.toDate.label}
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
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    value={form.toDate}
                    onChange={(e) =>
                      setForm({ ...form, toDate: e.target.value })
                    }
                  />
                  {!form.toDate && (
                    <small style={{ fontSize: "13px", color: "#64748b" }}>
                      Leave empty for "Till Date"
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload */}
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
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                    📤
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    {fileName || "Click to upload Order Copy"}
                  </div>
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setFileName(e.target.files[0]?.name || "");
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

            {/* Remarks */}
            <div style={{ marginBottom: "32px" }}>
              
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
                    minHeight: "120px",
                    resize: "vertical",
                    fontFamily: "inherit",
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
              ✓ Submit Post
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
            📊 My Posts
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
                    Post
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
                {list.length ? (
                  list.map((p, index) => (
                    <tr
                      key={p.id}
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
                        {p.post}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {`${formatDate(p.fromDate)} to ${formatDate(
                          p.toDate
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
                              p.status === 1
                                ? "#d1fae5"
                                : p.status === 2
                                ? "#fee2e2"
                                : "#fef3c7",
                            color: statusColor(p.status),
                          }}
                        >
                          {statusText(p.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
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
                      No records found
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

export default AdditionalPostAdd;