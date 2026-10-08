import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  getAllDesignations,
  updateDesignationStatus,
} from "../api/staffApi";

const DesignationApproval = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    try {
      const data = await getAllDesignations();
      
      // Sort: Pending (0) first, then Approved (1), then Rejected (2)
      const sorted = Array.isArray(data) 
        ? data.sort((a, b) => {
            // flag priority: 0 (pending) > 1 (approved) > 2 (rejected)
            const statusOrder = { 0: 0, 1: 1, 2: 2 };
            return statusOrder[a.flag] - statusOrder[b.flag];
          })
        : [];
      
      setList(sorted);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, flag) => {
    await updateDesignationStatus(id, flag);
    load();
  };

  const badge = (flag) => {
    if (flag === 1) return <span style={approved}>Approved</span>;
    if (flag === 2) return <span style={rejected}>Rejected</span>;
    return <span style={pending}>Pending</span>;
  };

  return (
    <div style={page}>
      <Sidebar />

      <div style={content}>
        <h2 style={heading}>Designation Approvals</h2>

        <div style={centerWrapper}>
          <div style={card}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: "left" }}>Staff ID</th>

                  <th style={{ ...th, textAlign: "left" }}>Name</th>
                  <th style={{ ...th, textAlign: "left" }}>Designation</th>
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
                  list.map((d) => (
                    <tr key={d.id} style={d.flag === 2 ? rejectedRow : row}>
                      <td style={td}>{d.staffId}</td>
                      <td style={td}>
                        {d.firstName} {d.lastName}
                      </td>
                      <td style={td}>{d.designation}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {badge(d.flag)}
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <div style={actionWrap}>
                          <button
                            style={approveBtn}
                            onClick={() => update(d.id, 1)}
                            disabled={d.flag === 1}
                          >
                            Approve
                          </button>
                          <button
                            style={rejectBtn}
                            onClick={() => update(d.id, 2)}
                            disabled={d.flag === 2}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={empty}>
                      No designation requests found
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

/* ===================== STYLES (REQUIRED) ===================== */

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
  marginBottom: "20px",
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
  fontSize: "16px",
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

export default DesignationApproval;