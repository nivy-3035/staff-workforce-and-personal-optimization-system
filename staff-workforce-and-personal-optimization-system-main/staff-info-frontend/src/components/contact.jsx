import React, { useEffect, useState } from "react";
import { getAllStaff, updateStaffContact, searchStaff } from "../api/staffApi";
import Sidebar from "./Sidebar";

const Contact = () => {
  const [staffList, setStaffList] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const data = await getAllStaff();
    setStaffList(data);

    const original = {};
    data.forEach((s) => {
      original[s.staffId] = {
        email: s.email,
        mobile: s.mobile,
      };
    });
    setOriginalData(original);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    try {
      if (value.trim() === "") {
        fetchStaff();
      } else {
        const results = await searchStaff(value);
        setStaffList(results);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleChange = (staffId, field, value) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.staffId === staffId ? { ...s, [field]: value } : s
      )
    );
  };

  const handleUpdate = async (staff) => {
    try {
      await updateStaffContact(staff.staffId, {
        email: staff.email,
        mobile: staff.mobile,
      });

      setSuccessMsg("Contact updated successfully ✔");
      fetchStaff();

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setSuccessMsg("❌ Failed to update staff");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleReset = (staffId) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.staffId === staffId
          ? {
              ...s,
              email: originalData[staffId].email,
              mobile: originalData[staffId].mobile,
            }
          : s
      )
    );
  };

  /* ===== ENHANCED STYLES ===== */

  const layout = {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6",
  };

  const page = {
    marginLeft: "260px",
    padding: "30px 40px",
    width: "100%",
    boxSizing: "border-box",
  };

  const headerWrapper = {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const title = {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#111827",
  };

  
  const searchWrapper = {
    marginTop: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "320px",
    background: "#ffffff",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    boxShadow: "0 1px 2px rgba(148, 163, 184, 0.2)",
  };

  const searchIcon = { fontSize: "16px" };

  const searchInput = {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    background: "transparent",
  };

  const card = {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "22px 24px 26px",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  };

  const msgBox = (isError) => ({
    marginBottom: "15px",
    padding: "10px 15px",
    borderRadius: "8px",
    background: isError ? "#fee2e2" : "#dcfce7",
    color: isError ? "#991b1b" : "#166534",
    fontWeight: 500,
    fontSize: "14px",
  });

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  };

  const theadRow = {
    background: "#5582d7f2",
    color: "#ffffff",
  };

  const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "14px",
  };

  const tdStyle = {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "16px",
    color: "#111827",
  };

  const inputStyle = {
    padding: "7px 10px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const actionsCell = {
    display: "flex",
    gap: "8px",
  };

  const updateBtn = {
    padding: "6px 12px",
    background: "#1d4ed8",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  };

  const resetBtn = {
    padding: "6px 12px",
    background: "#6b7280",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  };

  return (
    <div style={layout}>
      <Sidebar />

      <div style={page}>
        {/* Header + Search */}
        <div style={headerWrapper}>
          <h2 style={title}>Staff Contact</h2>
          

          <div style={searchWrapper}>
            <span style={searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or staff ID"
              value={search}
              onChange={handleSearch}
              style={searchInput}
            />
          </div>
        </div>

        {/* Success / Error Message */}
        {successMsg && (
          <div style={msgBox(successMsg.includes("Failed"))}>{successMsg}</div>
        )}

        {/* Table Card */}
        <div style={card}>
          <table style={table}>
            <thead>
              <tr style={theadRow}>
                <th style={thStyle}>Staff ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Mobile</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.staffId}>
                  <td style={tdStyle}>{staff.staffId}</td>
                  <td style={tdStyle}>
                    {staff.firstName} {staff.lastName}
                  </td>

                  <td style={tdStyle}>
                    <input
                      type="email"
                      value={staff.email}
                      onChange={(e) =>
                        handleChange(staff.staffId, "email", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>

                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={staff.mobile}
                      onChange={(e) =>
                        handleChange(staff.staffId, "mobile", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>

                  <td style={{ ...tdStyle, ...actionsCell }}>
                    <button
                      style={updateBtn}
                      onClick={() => handleUpdate(staff)}
                    >
                      Update
                    </button>
                    <button
                      style={resetBtn}
                      onClick={() => handleReset(staff.staffId)}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ))}

              {staffList.length === 0 && (
                <tr>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                    colSpan={5}
                  >
                    No staff found
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

export default Contact;
