import React, { useEffect, useState } from "react";
import { getAllStaff, searchStaff, deleteStaff } from "../api/staffApi";
import Sidebar from "./Sidebar";
import { FaSearch, FaTrashAlt } from "react-icons/fa";

const DeleteStaff = () => {
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
    const value = e.target.value.trim();
    setQuery(value);

    if (!value) return fetchStaffData();

    const results = await searchStaff(value);
    setStaff(results);
  };

  const openDeleteModal = (staff) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteStaff(selectedStaff.staffId);
    setShowModal(false);
    fetchStaffData();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main style={pageStyle}>
        <h2 style={title}>🗑️ Delete Staff</h2>

        {/* Search */}
        <div style={searchWrapper}>
          <FaSearch style={searchIcon} />
          <input
            type="text"
            placeholder="Search staff..."
            value={query}
            onChange={handleSearch}
            style={searchInput}
          />
        </div>

        {/* Table */}
        <div style={glassCard}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Staff ID</th>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((s) => (
                <tr key={s.staffId} style={row}>
                  <td>{s.staffId}</td>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.mobile}</td>
                  <td>
                    <button
                      style={deleteBtn}
                      onClick={() => openDeleteModal(s)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={overlay}>
            <div style={modal}>
              <h3 style={{ color: "#ff4d4f" }}>Confirm Delete</h3>
              <p>
                Are you sure you want to delete staff <b>{selectedStaff.staffId}</b>?
              </p>

              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button style={cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button style={confirmBtn} onClick={confirmDelete}>
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

/* ================= STYLES ================= */

const pageStyle = {
  marginLeft: "260px",
  padding: "40px",
  width: "100%",
  minHeight: "100vh",
background: "#f4f7fb",   };

const title = {
  color: "#090909ff",
  marginBottom: "25px",
};

const searchWrapper = {
  position: "relative",
  width: "320px",
  marginBottom: "25px",
};

const searchIcon = {
  position: "absolute",
  top: "50%",
  left: "12px",
  transform: "translateY(-50%)",
  color: "#666",
};

const searchInput = {
  width: "100%",
  padding: "12px 12px 12px 38px",
  borderRadius: "30px",
  border: "none",
  outline: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const glassCard = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
};

const table = {
    background: "rgba(255, 255, 255, 0.95)",
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
};

const th = {
  textAlign: "left",
  padding: "12px",
  color: "#1e3c72",
};

const row = {
  background: "#f9fbff",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const deleteBtn = {
  background: "linear-gradient(135deg, #ff4d4f, #d9363e)",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3000,
};

const modal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  width: "380px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
};

const confirmBtn = {
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "20px",
  marginLeft: "10px",
};

const cancelBtn = {
  background: "#ccc",
  border: "none",
  padding: "10px 18px",
  borderRadius: "20px",
};

export default DeleteStaff;
