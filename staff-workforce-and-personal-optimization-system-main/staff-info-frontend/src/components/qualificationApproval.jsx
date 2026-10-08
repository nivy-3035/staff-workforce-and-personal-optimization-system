import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  getAllQualifications,
  updateQualificationStatus,
} from "../api/qualificationApi";

const QualificationApproval = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    const data = await getAllQualifications();
    
    // Sort: Pending (0) first, then Approved (1), then Rejected (2)
    const sorted = Array.isArray(data) 
      ? data.sort((a, b) => {
          // Status priority: 0 (pending) > 1 (approved) > 2 (rejected)
          const statusOrder = { 0: 0, 1: 1, 2: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        })
      : [];
    
    setList(sorted);
  };

  useEffect(() => {
    load();
  }, []);

  const badge = (status) => {
    if (status === 1) return <span style={approved}>Approved</span>;
    if (status === 2) return <span style={rejected}>Rejected</span>;
    return <span style={pending}>Pending</span>;
  };

  return (
    <div style={page}>
      <Sidebar />

      <div style={content}>
        <h2 style={heading}>Qualification Approvals</h2>

        <div style={centerWrap}>
          <div style={card}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: "left" }}>Staff ID</th>

                  <th style={{ ...th, textAlign: "left"}}>Staff Name</th>
                  <th style={{ ...th, textAlign: "left"}}>Degree</th>
                  <th style={{ ...th, textAlign: "left"}}>University</th>
                  <th style={{ ...th, textAlign: "right" }}>Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length ? (
                  list.map((q) => (
                    <tr key={q.id} style={q.status === 2 ? rejectedRow : row}>
                      <td style={td}>{q.staffId}</td>
                      <td style={td}>{q.name}</td>
                      <td style={td}>{q.degree}</td>
                      <td style={td}>{q.university}</td>

                      <td style={{ ...td, textAlign: "right" }}>
                        {badge(q.status)}
                      </td>

                      <td style={{ ...td, textAlign: "right" }}>
                        <button
                          style={approveBtn}
                          onClick={() =>
                            updateQualificationStatus(q.id, 1).then(load)
                          }
                          disabled={q.status === 1}
                        >
                          Approve
                        </button>

                        <button
                          style={rejectBtn}
                          onClick={() =>
                            updateQualificationStatus(q.id, 2).then(load)
                          }
                          disabled={q.status === 2}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={empty}>
                      No qualification requests
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

/* ================= STYLES ================= */

const page = { display: "flex", minHeight: "100vh", background: "#f5f7fb" };

const content = { flex: 1, marginLeft: "260px", padding: "30px 40px" };

const heading = {
  margin: 0,
  fontSize: "32px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "700",
  marginBottom: "20px",
};

const centerWrap = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  maxWidth: "1100px",
  width: "100%",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "14px 20px",
  background: "#eef2ff",
  fontWeight: "600",
  fontSize: "16px",
};

const td = {
  padding: "16px 20px",
  fontSize: "16px",
};

const row = {
  borderBottom: "1px solid #eee",
};

const rejectedRow = {
  background: "#fff1f1",
};

const approveBtn = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  marginRight: "10px",
  cursor: "pointer",
  fontSize: "13px",
};

const rejectBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
};

const pending = {
  background: "#fff3cd",
  color: "#856404",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "13px",
};

const approved = {
  background: "#d4edda",
  color: "#155724",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "13px",
};

const rejected = {
  background: "#f8d7da",
  color: "#721c24",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "13px",
};

const empty = {
  textAlign: "center",
  padding: "25px",
  color: "#888",
};

export default QualificationApproval;