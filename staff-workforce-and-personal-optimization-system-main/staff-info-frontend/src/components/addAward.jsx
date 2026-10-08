import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { addAward, getAwardsByStaff } from "../api/awardApi";

const AddAward = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [form, setForm] = useState({
    awardName: "",
    awardingAgent: "",
    awardYear: "",
  });

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const years = Array.from(
    { length: 40 },
    (_, i) => new Date().getFullYear() - i
  );

  /* ===== Load Awards ===== */
  const loadAwards = useCallback(async () => {
    try {
      const res = await getAwardsByStaff(staffId);
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && staffId !== "—") {
      loadAwards();
    }
  }, [staffId, loadAwards]);

  /* ===== SUBMIT ===== */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addAward({
        staffId,
        awardName: form.awardName,
        awardingAgent: form.awardingAgent,
        awardYear: form.awardYear,
      });

      alert("Award added successfully");

      setForm({
        awardName: "",
        awardingAgent: "",
        awardYear: "",
      });

      loadAwards();
    } catch (err) {
      console.error(err);
      alert("Failed to add award");
    } finally {
      setLoading(false);
    }
  };

  /* ===== SORT BY YEAR (DESCENDING) ===== */
  const sortedAwards = [...list].sort(
    (a, b) => Number(b.award_year) - Number(a.award_year)
  );

  /* ===== JSX ===== */
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
              Award
            </h2>
          </div>

          <form onSubmit={submit}>
            {/* Award Details */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Award Name */}
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
                    🏆 Award Name
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
                    value={form.awardName}
                    onChange={(e) =>
                      setForm({ ...form, awardName: e.target.value })
                    }
                  />
                </div>

                {/* Awarding Agent */}
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
                    🏢 Awarding Agent
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
                    value={form.awardingAgent}
                    onChange={(e) =>
                      setForm({ ...form, awardingAgent: e.target.value })
                    }
                  />
                </div>

                {/* Award Year */}
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
                    📅 Award Year
                  </label>
                  <select
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
                    value={form.awardYear}
                    onChange={(e) =>
                      setForm({ ...form, awardYear: e.target.value })
                    }
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
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
              {loading ? "Saving..." : "✓ Submit Award"}
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
              📊 My Awards
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
                    Award Name
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
                    Awarding Agent
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
                      borderTopRightRadius: "12px",
                    }}
                  >
                    Award Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAwards.length > 0 ? (
                  sortedAwards.map((a, index) => (
                    <tr
                      key={a.id}
                      style={{
                        background: index % 2 === 0 ? "#f8fafc" : "white",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f1f5f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          index % 2 === 0 ? "#f8fafc" : "#fff")
                      }
                    >
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#334155",
                          fontWeight: "500",
                        }}
                      >
                        {a.award_name}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {a.awarding_agent}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {a.award_year}
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
                      No award records found
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

export default AddAward;