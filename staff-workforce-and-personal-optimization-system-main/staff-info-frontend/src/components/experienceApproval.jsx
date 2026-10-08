import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  getAllExperiences,
  updateExperienceStatus,
} from "../api/experienceApi";

const ExperienceApproval = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    try {
      const data = await getAllExperiences();
      
      // Sort: Pending (0) first, then Approved (1), then Rejected (2)
      const sorted = Array.isArray(data) 
        ? data.sort((a, b) => {
            // flag priority: 0 (pending) > 1 (approved) > 2 (rejected)
            const statusOrder = { 0: 0, 1: 1, 2: 2 };
            return statusOrder[a.flag] - statusOrder[b.flag];
          })
        : [];
      
      setList(sorted);
    } catch {
      setList([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const badge = (flag) => {
    if (flag === 1) return <span style={approved}>Approved</span>;
    if (flag === 2) return <span style={rejected}>Rejected</span>;
    return <span style={pending}>Pending</span>;
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "Till Date";

  const duration = (from, to) => `${formatDate(from)} - ${formatDate(to)}`;

  return (
    <div style={page}>
      <Sidebar />

      <div style={content}>
        <h2 style={heading}>Experience Approvals</h2>

        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Staff ID</th>

                <th style={th}>Staff Name</th>
                <th style={th}>Type</th>
                <th style={th}>Duration</th>
                <th style={{ ...th, textAlign: "center" }}>Status</th>
                <th style={{ ...th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.length ? (
                list.map((e) => (
                  <tr key={e.id} style={e.flag === 2 ? rejectedRow : row}>
                    <td style={td}>{e.staffId}</td>
                    <td style={td}>{e.staffName}</td>
                    <td style={td}>{e.experience_type}</td>
                    <td style={td}>
                      {duration(e.from_date, e.to_date)}
                    </td>

                    <td style={{ ...td, textAlign: "center" }}>
                      {badge(e.flag)}
                    </td>

                    <td style={{ ...td, textAlign: "center" }}>
                      <button
                        style={approveBtn}
                        disabled={e.flag === 1}
                        onClick={() =>
                          updateExperienceStatus(e.id, 1).then(load)
                        }
                      >
                        Approve
                      </button>

                      <button
                        style={rejectBtn}
                        disabled={e.flag === 2}
                        onClick={() =>
                          updateExperienceStatus(e.id, 2).then(load)
                        }
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={empty}>
                    No experience requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES (MATCH QUALIFICATION PAGE) ================= */

const page = { display: "flex", minHeight: "100vh", background: "#f5f7fb" };

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

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const table = { width: "100%", borderCollapse: "collapse" };

const th = {
  padding: "16px",
  background: "#eef2ff",
  fontWeight: "600",
  textAlign: "left",
};

const td = {
  padding: "16px",
  borderBottom: "1px solid #eee",
};

const row = {};

const rejectedRow = {
  background: "#fff1f1",
};

const pending = {
  background: "#fff3cd",
  color: "#856404",
  padding: "4px 14px",
  borderRadius: "14px",
};

const approved = {
  background: "#d4edda",
  color: "#155724",
  padding: "4px 14px",
  borderRadius: "14px",
};

const rejected = {
  background: "#f8d7da",
  color: "#721c24",
  padding: "4px 14px",
  borderRadius: "14px",
};

const approveBtn = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  marginRight: "10px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  cursor: "pointer",
};

const empty = {
  textAlign: "center",
  padding: "25px",
  color: "#888",
};

export default ExperienceApproval;