import React, { useEffect, useState } from "react";
import { getAllStaff, searchStaff, deleteStaff } from "../api/staffApi";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchStaffData = async () => {
    const data = await getAllStaff();
    setStaff(data);
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    const trimmed = value.trim();
    setQuery(value);

    try {
      if (!trimmed) {
        fetchStaffData();
      } else {
        const results = await searchStaff(trimmed);
        setStaff(results);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const openDeleteModal = (staffRow) => {
    setSelectedStaff(staffRow);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;
    await deleteStaff(selectedStaff.staffId);
    setShowModal(false);
    setSelectedStaff(null);
    fetchStaffData();
  };

  /* ============== STYLES ============== */

  const layout = {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6", // plain background
  };

  const pageStyle = {
    flex: 1,
    marginLeft: "240px",
    padding: "30px 40px",
    boxSizing: "border-box",
  };

  const containerCard = {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px 30px 34px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.15)",
    position: "relative",
    overflow: "hidden",
  };

  const headerBar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const title = {
    margin: 0,
    fontSize: "30px", // increased
    fontWeight: 800,
    color: "#111827",
    letterSpacing: "0.02em",
  };

  

  const countBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#e5f0ff",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: 600,
    marginTop: "6px",
  };

  const searchWrapper = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "340px",
    background: "#ffffff",
    padding: "12px 16px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    boxShadow: "0 1px 3px rgba(148, 163, 184, 0.25)",
  };

  const searchIcon = { fontSize: "18px" };

  const searchInput = {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "16px", // increased
    background: "transparent",
    color: "#111827",
  };

  const listWrapper = {
    marginTop: "16px",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
  };

  const headerRow = {
    display: "grid",
    gridTemplateColumns: "1.2fr 2fr 3fr 2fr 1.5fr",
    alignItems: "center",
    padding: "14px 20px",
    background: "#e5e7eb",
    fontWeight: 700,
    fontSize: "16px", // increased
    color: "#111827",
    borderBottom: "1px solid #d1d5db",
  };

  const rowBox = (index) => ({
    display: "grid",
    gridTemplateColumns: "1.2fr 2fr 3fr 2fr 1.5fr",
    alignItems: "center",
    padding: "14px 20px",
    fontSize: "15px", // increased
    background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
    transition: "background 0.15s ease",
  });

  const cellDim = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const nameCell = {
    ...cellDim,
    fontWeight: 600,
    color: "#111827",
  };

  const idChip = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 12px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "14px", // increased
    fontWeight: 600,
    maxWidth: "140px",
  };

  const actionCell = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    justifyContent: "flex-start",
  };

  const iconButtonBase = {
    border: "none",
    cursor: "pointer",
    borderRadius: "999px",
    padding: "7px 11px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
  };

  const editBtn = {
    ...iconButtonBase,
  };

  const deleteBtn = {
    ...iconButtonBase,
  };

  const emptyState = {
    padding: "40px 28px 34px",
    textAlign: "center",
    color: "#6b7280",
  };

  const emptyTitle = {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "4px",
  };

  

  const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
  };

  const modalCard = {
    background: "#ffffff",
    padding: "28px 26px 24px",
    borderRadius: "20px",
    width: "400px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.4)",
  };

  const modalTitle = {
    margin: 0,
    marginBottom: "12px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#b91c1c",
  };

  const modalText = {
    fontSize: "16px",
    color: "#4b5563",
    lineHeight: 1.6,
  };

  const modalFooter = {
    textAlign: "right",
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  };

  const cancelBtn = {
    padding: "11px 24px",
    fontSize: "15px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    background: "#e5e7eb",
    fontWeight: 600,
    color: "#374151",
  };

  const confirmBtn = {
    padding: "11px 24px",
    fontSize: "15px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: 600,
  };

  return (
    <div style={layout}>
      <Sidebar />

      <main style={pageStyle}>
        <div style={containerCard}>
          {/* Header + search */}
          <div style={headerBar}>
            <div>
              <h2 style={title}>Staff Directory</h2>
              
              <div style={countBadge}>
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#16a34a",
                  }}
                />
                {staff.length} active staff
              </div>
            </div>

            <div style={searchWrapper}>
              <span style={searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or staff ID"
                value={query}
                onChange={handleSearch}
                style={searchInput}
              />
            </div>
          </div>

          {/* List */}
          <div style={listWrapper}>
            <div style={headerRow}>
              <div>Staff ID</div>
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div style={{ textAlign: "left" }}>Actions</div>
            </div>

            {staff.length === 0 ? (
              <div style={emptyState}>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>👥</div>
                <div style={emptyTitle}>No staff found</div>
                
              </div>
            ) : (
              staff.map((s, index) => (
                <div key={s.staffId} style={rowBox(index)}>
                  <div style={cellDim}>
                    <span style={idChip}>{s.staffId}</span>
                  </div>
                  <div style={nameCell}>
                    {s.firstName} {s.lastName}
                  </div>
                  <div style={{ ...cellDim, color: "#4b5563" }}>{s.email}</div>
                  <div style={{ ...cellDim, color: "#4b5563" }}>{s.mobile}</div>

                  <div style={actionCell}>
                    <Link to={`/edit-staff/${s.staffId}`}>
                      <button style={editBtn} title="Edit">
                        <FaEdit size={18} color="#2563eb" />
                      </button>
                    </Link>

                    <button
                      style={deleteBtn}
                      title="Delete"
                      onClick={() => openDeleteModal(s)}
                    >
                      <FaTrashAlt size={18} color="#dc2626" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DELETE MODAL */}
        {showModal && selectedStaff && (
          <div style={modalOverlay}>
            <div style={modalCard}>
              <h3 style={modalTitle}>Delete staff?</h3>
              <p style={modalText}>
                Are you sure you want to delete staff{" "}
                <b>{selectedStaff.staffId}</b>? This action cannot be undone.
              </p>

              <div style={modalFooter}>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedStaff(null);
                  }}
                  style={cancelBtn}
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} style={confirmBtn}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffList;
