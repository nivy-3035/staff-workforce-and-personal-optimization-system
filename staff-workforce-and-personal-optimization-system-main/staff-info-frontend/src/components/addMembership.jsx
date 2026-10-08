import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import {
  addMembership,
  getMembershipByStaff,
} from "../api/membershipApi";

const AddMembership = () => {
  const staffId = localStorage.getItem("staffId") || "—";

  const [form, setForm] = useState({
    membershipType: "",
    institution: "",
    membershipId: "",
  });

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===== LOAD MEMBERSHIPS (FIXED WITH useCallback) ===== */
  const loadMemberships = useCallback(async () => {
    try {
      const res = await getMembershipByStaff(staffId);
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && staffId !== "—") {
      loadMemberships();
    }
  }, [staffId, loadMemberships]);

  /* ===== SUBMIT ===== */
  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await addMembership({
        staffId,
        membershipType: form.membershipType,
        institution: form.institution,
        membershipId: form.membershipId,
      });

      alert("Membership added successfully");

      setForm({
        membershipType: "",
        institution: "",
        membershipId: "",
      });

      loadMemberships();
    } catch (err) {
      console.error(err);
      alert("Failed to add membership");
    } finally {
      setLoading(false);
    }
  };

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
              Membership
            </h2>
          </div>

          <form onSubmit={submit}>
            {/* Membership Details */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Membership Type */}
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
                    🏆 Membership Type
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
                    value={form.membershipType}
                    onChange={(e) =>
                      setForm({ ...form, membershipType: e.target.value })
                    }
                  />
                </div>

                {/* Institution */}
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
                    🏢 Institution
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
                    value={form.institution}
                    onChange={(e) =>
                      setForm({ ...form, institution: e.target.value })
                    }
                  />
                </div>

                {/* Membership ID */}
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
                    🆔 Membership ID
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
                    value={form.membershipId}
                    onChange={(e) =>
                      setForm({ ...form, membershipId: e.target.value })
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
              ✓ Submit Membership
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
              📊 My Memberships
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
                    Membership Type
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
                    Institution
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
                    Membership ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 ? (
                  list.map((m, index) => (
                    <tr
                      key={m.id}
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
                        {m.membershipType}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {m.institution}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {m.membershipId || "-"}
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
                      No membership records found
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

export default AddMembership;