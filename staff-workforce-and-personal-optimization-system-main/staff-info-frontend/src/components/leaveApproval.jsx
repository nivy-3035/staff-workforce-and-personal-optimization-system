import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getAllLeave, updateLeaveStatus } from "../api/leaveApi";

const LeaveApproval = () => {
  const [list, setList] = useState([]);

 const load = async () => {
  const data = await getAllLeave();

  // Order: Pending (0) → Approved (1) → Rejected (2)
  const sortedData = [...data].sort((a, b) => a.status - b.status);

  setList(sortedData);
};
  useEffect(() => {
    load();
  }, []);

  const approve = async (l) => {
    await updateLeaveStatus(l.id, {
      status: 1,
      staffId: l.staffId,
      leaveType: l.leave_type,
    });
    load();
  };

  const reject = async (l) => {
    await updateLeaveStatus(l.id, {
      status: 2,
      staffId: l.staffId,
      leaveType: l.leave_type,
    });
    load();
  };

  const getStatusLabel = (status) => {
    if (status === 0) return { text: "Pending", color: "#d97706" };
    if (status === 1) return { text: "Approved", color: "#059669" };
    return { text: "Rejected", color: "#dc2626" };
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
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
        }}
      >
        <div style={cardStyle}>
          <h2 style={headingStyle}>Leave Approval Panel</h2>

          {list.length > 0 ? (
            list.map((l, idx) => {
              const statusInfo = getStatusLabel(l.status);

              return (
                <div
                  key={l.id}
                  style={{
                    ...leaveCardStyle,
                    background:
                      idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={staffStyle}>
                      👤 Staff ID: {l.staffId}
                    </div>

                    <div style={typeStyle}>
                      📝 {l.leave_type}
                    </div>

                    <div style={dateStyle}>
                      📅 {formatDate(l.from_date)} -{" "}
                      {formatDate(l.to_date)}
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontWeight: "600",
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.text}
                    </div>
                  </div>

                  {l.status === 0 && (
                    <div style={buttonGroupStyle}>
                      <button
                        style={approveBtn}
                        onClick={() => approve(l)}
                      >
                        ✓ Approve
                      </button>

                      <button
                        style={rejectBtn}
                        onClick={() => reject(l)}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p style={{ color: "#64748b" }}>
              No leave requests found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== STYLES ===== */

const cardStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  background: "#ffffff",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
};

const headingStyle = {
  fontSize: "26px",
  fontWeight: "700",
  marginBottom: "30px",
  textAlign: "center",
};

const leaveCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  borderBottom: "1px solid #e2e8f0",
  borderRadius: "12px",
};

const staffStyle = {
  fontWeight: "600",
  fontSize: "15px",
  marginBottom: "5px",
};

const typeStyle = {
  fontSize: "14px",
  color: "#334155",
};

const dateStyle = {
  fontSize: "14px",
  color: "#475569",
  marginTop: "4px",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
};

const approveBtn = {
  background: "#059669",
  color: "#fff",
  padding: "8px 18px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const rejectBtn = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 18px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

export default LeaveApproval;