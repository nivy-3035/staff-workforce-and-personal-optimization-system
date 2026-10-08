import React from "react";
import Sidebar from "./Sidebar";

const RemovedStaff = ({ removedList }) => {
  const containerStyle = { display: "flex" };
  const mainStyle = {
    flex: 1,
    padding: "1rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
    gap: "1rem",
  };
  const cardStyle = {
    backgroundColor: "#eee",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 0 8px #bbb",
  };
  const photoStyle = {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "0.8rem",
  };

  return (
    <div style={containerStyle}>
      <Sidebar />
      <main style={mainStyle}>
        {removedList.length === 0 && <p>No removed staff.</p>}
        {removedList.map((staff) => (
          <div key={staff.username} style={cardStyle}>
            <img
              src={staff.photo || "https://via.placeholder.com/200x150?text=No+Photo"}
              alt={staff.name}
              style={photoStyle}
            />
            <h4>{staff.name}</h4>
            <p>Department: {staff.department}</p>
            <p>Removed</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default RemovedStaff;
