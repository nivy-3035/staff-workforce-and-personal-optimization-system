import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  getAllAdditionalPosts,
  updateAdditionalPostStatus,
} from "../api/additionalPostApi";

const AdditionalPostApproval = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    try {
      const data = await getAllAdditionalPosts();
      
      // Sort: Pending (0) first, then Approved (1), then Rejected (2)
      const sorted = Array.isArray(data) 
        ? data.sort((a, b) => {
            // status priority: 0 (pending) > 1 (approved) > 2 (rejected)
            const statusOrder = { 0: 0, 1: 1, 2: 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          })
        : [];
      
      setList(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const badge = (status) => {
    if (status === 1) return <span style={approved}>Approved</span>;
    if (status === 2) return <span style={rejected}>Disapproved</span>;
    return <span style={pending}>Pending</span>;
  };

  return (
    <div style={page}>
      <Sidebar />

      <div style={content}>
        <h2 style={heading}>Additional Post Approvals</h2>

        {/* CENTERED CARD */}
        <div style={centerWrapper}>
          <div style={card}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: "left" }}>Staff ID</th>
                  <th style={{ ...th, textAlign: "left" }}>Post</th>
                  <th style={{ ...th, textAlign: "left" }}>Order No</th>
                  <th style={{ ...th, textAlign: "right" }}>Status</th>
                  <th
                    style={{ ...th, textAlign: "right", paddingRight: "28px" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.length > 0 ? (
                  list.map((p) => (
                    <tr
                      key={p.id}
                      style={p.status === 2 ? rejectedRow : row}
                    >
                      <td style={td}>{p.staffId}</td>
                      <td style={td}>{p.post}</td>
                      <td style={td}>{p.orderNo}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {badge(p.status)}
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <div style={actionWrap}>
                          <button
                            style={approveBtn}
                            disabled={p.status === 1}
                            onClick={() =>
                              updateAdditionalPostStatus(p.id, 1).then(load)
                            }
                          >
                            Approve
                          </button>
                          <button
                            style={rejectBtn}
                            disabled={p.status === 2}
                            onClick={() =>
                              updateAdditionalPostStatus(p.id, 2).then(load)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={empty}>
                      No additional post requests found
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

/* ===================== STYLES (MATCHED) ===================== */

const page = {
  display: "flex",
  minHeight: "100vh",
  background: "#f5f7fb",
};

const content = {
  flex: 1,
  marginLeft: "260px",
  padding: "30px 40px",
};

const heading = {
  margin: 0,
  fontSize: "32px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "700",
};

const centerWrapper = {
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
  fontSize: "14px",
  color: "#0a2c5d",
};

const row = {
  borderBottom: "1px solid #eee",
};

const rejectedRow = {
  background: "#fff1f1",
  borderBottom: "1px solid #f5c6cb",
};

const td = {
  padding: "16px 20px",
  verticalAlign: "middle",
};

const actionWrap = {
  display: "flex",
  justifyContent: "flex-end",
};

const approveBtn = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  cursor: "pointer",
  marginRight: "10px",
};

const rejectBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  cursor: "pointer",
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

export default AdditionalPostApproval;