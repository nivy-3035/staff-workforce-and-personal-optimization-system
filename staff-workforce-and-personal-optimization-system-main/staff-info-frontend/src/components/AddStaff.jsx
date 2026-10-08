import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { addstaff } from "../api/staffApi";

const AddStaff = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [data, setData] = useState({
    email: "",
    staffId: "",
    firstName: "",
    lastName: "",
    mobile: "",
    dob: "",
    joiningDate: "",
    specialization: "",
    street: "",
    city: "",
    district: "",
    state: "Tamil Nadu",
    pinCode: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= DISTRICTS ================= */
  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
    "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur",
    "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar"
  ];

  /* ================= DATE FORMAT ================= */
  const formatDateForMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    if (name === "staffId") {
      if (!/^\d*$/.test(value) || value.length > 5) return;
    }

    if (name === "pinCode") {
      if (!/^\d*$/.test(value) || value.length > 6) return;
    }

    if (name === "photo") {
  setData({ ...data, photo: files[0] });
  return;
}


    setData({ ...data, [name]: value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};

    if (!data.email.endsWith("@gmail.com"))
      errs.email = "Email must be @gmail.com";

    if (!/^\d{10}$/.test(data.mobile))
      errs.mobile = "Mobile must be 10 digits";

    if (!/^\d{5}$/.test(data.staffId))
      errs.staffId = "Staff ID must be 5 digits";

    if (!/^\d{6}$/.test(data.pinCode))
      errs.pinCode = "Pin Code must be 6 digits";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "dob" || key === "joiningDate") {
          formData.append(key, formatDateForMySQL(data[key]));
        } else if (data[key] !== null && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      await addstaff(formData);
      alert("Staff added successfully");
      navigate("/staff-list");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FIELD CONFIG ================= */
  const fieldConfig = {
    email: { label: "Email Address", icon: "📧" },
    staffId: { label: "Staff ID", icon: "🆔" },
    firstName: { label: "First Name", icon: "👤" },
    lastName: { label: "Last Name", icon: "👤" },
    mobile: { label: "Mobile Number", icon: "📱" },
    specialization: { label: "Specialization", icon: "💼" },
    street: { label: "Street Address", icon: "🏠" },
    city: { label: "City", icon: "🏙️" },
    pinCode: { label: "Pin Code", icon: "📮" },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <div style={{ flex: 1,marginLeft: "260px", background: "#f3f4f6", padding: "40px", overflowY: "auto" }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
          
            <h2 style={{
              margin: 0,
              fontSize: "32px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700"
            }}>Add Staff Member</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "18px",
                color: "#1e293b",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
                fontWeight: "600"
              }}>
                📋 Personal Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {["email", "staffId", "firstName", "lastName", "mobile", "specialization"].map((key) => (
                  <div key={key} style={{ position: "relative" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155"
                    }}>
                      {fieldConfig[key].icon} {fieldConfig[key].label}
                    </label>
                    <input
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: errors[key] ? "2px solid #ef4444" : "2px solid #e2e8f0",
                        fontSize: "15px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        background: "#f8fafc",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = errors[key] ? "#ef4444" : "#e2e8f0"}
                      name={key}
                      value={data[key]}
                      onChange={handleChange}
                    />
                    {errors[key] && (
                      <small style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                        ⚠️ {errors[key]}
                      </small>
                    )}
                  </div>
                ))}

                {/* DOB */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155"
                  }}>
                    🎂 Date of Birth
                  </label>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    name="dob"
                    value={data.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* Joining Date */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155"
                  }}>
                    📅 Joining Date
                  </label>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    name="joiningDate"
                    value={data.joiningDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "18px",
                color: "#1e293b",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
                fontWeight: "600"
              }}>
                📍 Address Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {["street", "city", "pinCode"].map((key) => (
                  <div key={key}>
                    <label style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155"
                    }}>
                      {fieldConfig[key].icon} {fieldConfig[key].label}
                    </label>
                    <input
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: errors[key] ? "2px solid #ef4444" : "2px solid #e2e8f0",
                        fontSize: "15px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        background: "#f8fafc",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = errors[key] ? "#ef4444" : "#e2e8f0"}
                      name={key}
                      value={data[key]}
                      onChange={handleChange}
                    />
                    {errors[key] && (
                      <small style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                        ⚠️ {errors[key]}
                      </small>
                    )}
                  </div>
                ))}

                {/* District */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155"
                  }}>
                    🗺️ District
                  </label>
                  <select
                    name="district"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    value={data.district}
                    onChange={handleChange}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155"
                  }}>
                    🏛️ State
                  </label>
                  <input
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "15px",
                      background: "#f1f5f9",
                      color: "#64748b",
                      cursor: "not-allowed",
                      boxSizing: "border-box"
                    }}
                    value="Tamil Nadu"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "18px",
                color: "#1e293b",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
                fontWeight: "600"
              }}>
                📸 Profile Photo
              </h3>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "2px dashed #cbd5e1"
              }}>
                <label style={{
                  flex: 1,
                  cursor: "pointer",
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "12px",
                  background: "white",
                  border: "2px dashed #cbd5e1",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background = "white";
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>📤</div>
                  <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                    Click to upload photo
                  </div>
                  <input type="file" name="photo" onChange={handleChange} style={{ display: "none" }} />
                </label>
                
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "20px",
    background: "#667eea 0%",
    color: "#fff",
    padding: "12px 40px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    gridColumn: "1 / -1",
    justifySelf: "flex-start",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.4)";
              }}
            >
              {loading ? "⏳ Saving..." : "✓ Submit Staff Details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;