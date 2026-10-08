import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { applyLeave, getMyLeave } from "../api/leaveApi";

const LeaveApply = () => {
  const staffId = localStorage.getItem("staffId");

  const [list, setList] = useState([]);

  /* ===== MAX LIMITS ===== */
  const MAX_LIMIT = {
    CASUAL: 12,
    RESTRICTED: 3,
    SPECIAL: 15,
  };

  /* ===== LEAVE BALANCE STATE ===== */
  const [balance, setBalance] = useState(MAX_LIMIT);

  const [form, setForm] = useState({
    leaveType: "CASUAL",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  /* ===== FORMAT DATE ===== */
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* ===== CALCULATE DAYS ===== */
  const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = end - start;
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
    return diffDays;
  };

  /* ===== LOAD LEAVE HISTORY ===== */
  const load = useCallback(async () => {
    const data = await getMyLeave(staffId);
    const leaveData = Array.isArray(data) ? data : [];
    setList(leaveData);

    const updatedBalance = { ...MAX_LIMIT };

    leaveData.forEach((l) => {
      if (l.status === 1) {
        const days = calculateDays(l.from_date, l.to_date);
        if (updatedBalance[l.leave_type] !== undefined) {
          updatedBalance[l.leave_type] -= days;
        }
      }
    });

    setBalance(updatedBalance);
  }, [staffId]);

  useEffect(() => {
    load();
  }, [load]);

  /* ===== APPLY LEAVE ===== */
  const submit = async (e) => {
    e.preventDefault();

    const days = calculateDays(form.fromDate, form.toDate);

    if (balance[form.leaveType] < days) {
      alert("Not enough leave balance!");
      return;
    }

    await applyLeave({
      staffId,
      ...form,
    });

    alert("Leave applied successfully");

    setForm({
      leaveType: "CASUAL",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    load();
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
        <div style={cardStyle}>
          <h2 style={headingStyle}>Leave Management</h2>

          {/* ===== NEW ANIMATED BALANCE CARDS ===== */}
          <div style={balanceContainer}>
            {Object.keys(MAX_LIMIT).map((type) => (
              <div key={type} style={balanceCard}>
                <div style={balanceTitle}>
                  {type === "CASUAL"
                    ? "Casual Leave"
                    : type === "RESTRICTED"
                    ? "Restricted Leave"
                    : "Special Casual Leave"}
                </div>

                <div style={balanceCount}>
                  {balance[type]} / {MAX_LIMIT[type]}
                </div>

                <div
                  style={{
                    ...progressBar,
                    width: `${
                      (balance[type] / MAX_LIMIT[type]) * 100
                    }%`,
                  }}
                ></div>
              </div>
            ))}
          </div>

          <form onSubmit={submit}>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={(e) =>
                    setForm({ ...form, leaveType: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="RESTRICTED">Restricted Holiday</option>
                  <option value="SPECIAL">Special Casual Leave</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>From Date</label>
                <input
                  type="date"
                  required
                  value={form.fromDate}
                  onChange={(e) =>
                    setForm({ ...form, fromDate: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>To Date</label>
                <input
                  type="date"
                  required
                  value={form.toDate}
                  onChange={(e) =>
                    setForm({ ...form, toDate: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: "25px" }}>
              <label style={labelStyle}>Reason</label>
              <textarea
                required
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
                style={{ ...inputStyle, height: "100px" }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <button type="submit" style={buttonStyle}>
                Apply Leave
              </button>
            </div>
          </form>
        </div>

        {/* ===== LEAVE HISTORY ===== */}
        <div style={{ ...cardStyle, marginTop: "40px" }}>
          <h3 style={historyHeading}>Leave History</h3>

          {list.length > 0 ? (
            list.map((l, idx) => (
              <div
                key={l.id}
                style={{
                  padding: "18px",
                  borderBottom: "1px solid #e2e8f0",
                  background: idx % 2 === 0 ? "#f8fafc" : "#fff",
                }}
              >
                <div style={{ fontWeight: "600" }}>
                  {l.leave_type}
                </div>

                <div style={{ marginTop: "6px", color: "#475569" }}>
                  {formatDate(l.from_date)} - {formatDate(l.to_date)}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    fontWeight: "600",
                    color:
                      l.status === 0
                        ? "#d97706"
                        : l.status === 1
                        ? "#059669"
                        : "#dc2626",
                  }}
                >
                  {l.status === 0
                    ? "⏳ Pending"
                    : l.status === 1
                    ? "✓ Approved"
                    : "✗ Rejected"}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#64748b" }}>
              No leave records found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== STYLES ===== */

const balanceContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const balanceCard = {
  flex: "1",
  minWidth: "200px",
  background: "#ffffff",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease",
};

const balanceTitle = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "10px",
  color: "#334155",
};

const balanceCount = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#667eea",
};

const progressBar = {
  height: "6px",
  background: "linear-gradient(90deg, #667eea, #764ba2)",
  borderRadius: "4px",
  marginTop: "12px",
  transition: "width 0.5s ease-in-out",
};

const cardStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  background: "#fff",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
};

const headingStyle = {
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "30px",
  textAlign: "center",
};

const historyHeading = {
  fontSize: "20px",
  marginBottom: "20px",
  borderBottom: "2px solid #e2e8f0",
  paddingBottom: "10px",
  fontWeight: "600",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  fontSize: "15px",
  background: "#f8fafc",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "30px",
  background: "#667eea",
  color: "#fff",
  padding: "14px 45px",
  borderRadius: "30px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

export default LeaveApply;