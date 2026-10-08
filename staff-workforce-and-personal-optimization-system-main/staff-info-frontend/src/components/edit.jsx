// ================= EditStaff.jsx =================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  fetchStaffById,
  editStaff,
  getMyDesignations,
  updateDesignation,
} from "../api/staffApi";
import {
  getMyQualifications,
  updateQualification,
} from "../api/qualificationApi";
import {
  getMyExperiences,
  updateExperience,
} from "../api/experienceApi";
import {
  getMyAdditionalPosts,
  updateAdditionalPost,
} from "../api/additionalPostApi";

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= STAFF STATE ================= */
  const [staff, setStaff] = useState({
    email: "",
    staffId: "",
    firstName: "",
    lastName: "",
    mobile: "",
    dob: "",
    joiningDate: "",
    specialization: "",
    photo: null,
    street: "",
    city: "",
    district: "",
    state: "Tamil Nadu",
    pinCode: "",
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  /* ================= DESIGNATION STATE ================= */
  const [designations, setDesignations] = useState([]);
  const [selectedDesignationId, setSelectedDesignationId] = useState(null);
  const [designationForm, setDesignationForm] = useState({
    designation: "",
    from_date: "",
    to_date: "",
    order_no: "",
  });

  /* ================= QUALIFICATION STATE ================= */
  const [qualifications, setQualifications] = useState([]);
  const [selectedQualificationId, setSelectedQualificationId] = useState(null);
  const [qualificationForm, setQualificationForm] = useState({
    degree: "",
    major: "",
    completedYear: "",
    college: "",
    university: "",
  });

  /* ================= EXPERIENCE STATE ================= */
  const [experiences, setExperiences] = useState([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    experience_type: "",
    industry_worked: "",
    from_date: "",
    to_date: "",
    remarks: "",
  });

  /* ================= ADDITIONAL POST STATE ================= */
  const [additionalPosts, setAdditionalPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postForm, setPostForm] = useState({
    post: "",
    fromDate: "",
    toDate: "",
    resolutionNo: "",
    orderNo: "",
    remarks: "",
  });

  /* ================= LOAD STAFF + DESIGNATION + QUALIFICATION + EXPERIENCE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const s = await fetchStaffById(id);

        setStaff({
          email: s.email || "",
          staffId: s.staffId || "",
          firstName: s.firstName || "",
          lastName: s.lastName || "",
          mobile: s.mobile || "",
          dob: s.dob ? s.dob.split("T")[0] : "",
          joiningDate: s.joiningDate ? s.joiningDate.split("T")[0] : "",
          specialization: s.specialization || "",
          photo: null,
          street: s.street || "",
          city: s.city || "",
          district: s.district || "",
          state: s.state || "Tamil Nadu",
          pinCode: s.pinCode || "",
        });

        if (s.photo) {
          setPreview(`http://localhost:5000/uploads/${s.photo}`);
        }

        // Load designations
        const d = await getMyDesignations(s.staffId);
        setDesignations(d.filter((x) => x.flag === 1));

        // Load qualifications
        const q = await getMyQualifications(s.staffId);
        setQualifications(q.filter((x) => x.status === 1));

        // Load experiences
        const e = await getMyExperiences(s.staffId);
        setExperiences(e.filter((x) => x.flag === 1));

        // Load additional posts
        const ap = await getMyAdditionalPosts(s.staffId);
        setAdditionalPosts(ap.filter((x) => x.status === 1));
      } catch (err) {
        setError("Failed to load data");
      }
    };
    loadData();
  }, [id]);

  /* ================= STAFF CHANGE ================= */
  const handleStaffChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setStaff({ ...staff, photo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setStaff({ ...staff, [name]: value });
    }
  };

  /* ================= STAFF SUBMIT ================= */
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      Object.keys(staff).forEach((key) => {
        if (key === "photo") {
          if (staff.photo) formData.append("photo", staff.photo);
        } else {
          formData.append(key, staff[key]);
        }
      });

      await editStaff(id, formData);
      setSuccess("Staff updated successfully");
      setTimeout(() => navigate("/staff-list"), 1500);
    } catch (err) {
      setError("Staff update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DESIGNATION SELECT ================= */
  const selectDesignation = (d) => {
    setSelectedDesignationId(d.id);
    setDesignationForm({
      designation: d.designation || "",
      from_date: d.from_date ? d.from_date.split("T")[0] : "",
      to_date: d.to_date && d.to_date !== "0000-00-00" ? d.to_date.split("T")[0] : "",
      order_no: d.order_no || "",
    });
  };

  /* ================= DESIGNATION CHANGE ================= */
  const handleDesignationChange = (e) => {
    const { name, value } = e.target;
    setDesignationForm({ ...designationForm, [name]: value });
  };

  /* ================= DESIGNATION UPDATE ================= */
  const handleDesignationUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDesignationId) return;

    try {
      const payload = {
        designation: designationForm.designation,
        from_date: designationForm.from_date,
        to_date: designationForm.to_date || null,
        order_no: designationForm.order_no,
      };

      await updateDesignation(selectedDesignationId, payload);

      setDesignations((prev) =>
        prev.map((d) =>
          d.id === selectedDesignationId ? { ...d, ...designationForm } : d
        )
      );

      setSuccess("Designation updated successfully");
      setSelectedDesignationId(null);
    } catch (err) {
      console.error("Designation update error:", err);
      setError(err.message || "Designation update failed");
    }
  };

  /* ================= QUALIFICATION SELECT ================= */
  const selectQualification = (q) => {
    setSelectedQualificationId(q.id);
    setQualificationForm({
      degree: q.degree || "",
      major: q.major || "",
      completedYear: q.completedYear || "",
      college: q.college || "",
      university: q.university || "",
    });
  };

  /* ================= QUALIFICATION CHANGE ================= */
  const handleQualificationChange = (e) => {
    const { name, value } = e.target;
    setQualificationForm({ ...qualificationForm, [name]: value });
  };

  /* ================= QUALIFICATION UPDATE ================= */
  const handleQualificationUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedQualificationId) return;

    try {
      const formData = new FormData();
      formData.append("degree", qualificationForm.degree);
      formData.append("major", qualificationForm.major);
      formData.append("completedYear", qualificationForm.completedYear);
      formData.append("college", qualificationForm.college);
      formData.append("university", qualificationForm.university);

      await updateQualification(selectedQualificationId, formData);

      setQualifications((prev) =>
        prev.map((q) =>
          q.id === selectedQualificationId ? { ...q, ...qualificationForm } : q
        )
      );

      setSuccess("Qualification updated successfully");
      setSelectedQualificationId(null);
    } catch (err) {
      console.error("Qualification update error:", err);
      setError(err.message || "Qualification update failed");
    }
  };

  /* ================= EXPERIENCE SELECT ================= */
  const selectExperience = (exp) => {
    setSelectedExperienceId(exp.id);
    setExperienceForm({
      experience_type: exp.experience_type || "",
      industry_worked: exp.industry_worked || "",
      from_date: exp.from_date ? exp.from_date.split("T")[0] : "",
      to_date: exp.to_date ? exp.to_date.split("T")[0] : "",
      remarks: exp.remarks || "",
    });
  };

  /* ================= EXPERIENCE CHANGE ================= */
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperienceForm({ ...experienceForm, [name]: value });
  };

  /* ================= EXPERIENCE UPDATE ================= */
  const handleExperienceUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedExperienceId) return;

    try {
      await updateExperience(selectedExperienceId, {
        experience_type: experienceForm.experience_type,
        industry_worked: experienceForm.industry_worked,
        from_date: experienceForm.from_date,
        to_date: experienceForm.to_date,
        remarks: experienceForm.remarks,
      });

      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === selectedExperienceId ? { ...exp, ...experienceForm } : exp
        )
      );

      setSuccess("Experience updated successfully");
      setSelectedExperienceId(null);
    } catch (err) {
      console.error("Experience update error:", err);
      setError(err.message || "Experience update failed");
    }
  };

  /* ================= ADDITIONAL POST SELECT ================= */
  const selectPost = (post) => {
    setSelectedPostId(post.id);
    setPostForm({
      post: post.post || "",
      fromDate: post.fromDate ? post.fromDate.split("T")[0] : "",
      toDate: post.toDate && post.toDate !== "0000-00-00" ? post.toDate.split("T")[0] : "",
      resolutionNo: post.resolutionNo || "",
      orderNo: post.orderNo || "",
      remarks: post.remarks || "",
    });
  };

  /* ================= ADDITIONAL POST CHANGE ================= */
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostForm({ ...postForm, [name]: value });
  };

  /* ================= ADDITIONAL POST UPDATE ================= */
  const handlePostUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPostId) return;

    try {
      const formData = new FormData();
      formData.append("post", postForm.post);
      formData.append("fromDate", postForm.fromDate);
      formData.append("toDate", postForm.toDate || "");
      formData.append("resolutionNo", postForm.resolutionNo);
      formData.append("orderNo", postForm.orderNo);
      formData.append("remarks", postForm.remarks);

      await updateAdditionalPost(selectedPostId, formData);

      setAdditionalPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPostId ? { ...p, ...postForm } : p
        )
      );

      setSuccess("Additional post updated successfully");
      setSelectedPostId(null);
    } catch (err) {
      console.error("Additional post update error:", err);
      setError(err.message || "Additional post update failed");
    }
  };

  /* ================= TABS ================= */
  const tabs = [
    { key: "personal", label: "Personal Info", icon: "👤" },
    { key: "address", label: "Address", icon: "📍" },
    { key: "designation", label: "Designations", icon: "📋" },
    { key: "qualification", label: "Qualifications", icon: "🎓" },
    { key: "experience", label: "Experience", icon: "💼" },
    { key: "additionalPost", label: "Additional Post", icon: "📌" },
  ];

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "2rem", maxWidth: "860px", margin: "0 auto", width: "100%" }}>

        {/* ===== HEADER ===== */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          marginBottom: "1.5rem"
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b", fontFamily: "'Segoe UI', sans-serif" }}>
              Edit Staff
            </h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
              {staff.firstName} {staff.lastName} &nbsp;•&nbsp; ID: {staff.staffId}
            </p>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div style={{
          display: "flex", gap: "0.5rem", marginBottom: "1.25rem",
          background: "#e2e8f0", borderRadius: 10, padding: "4px",
          overflowX: "auto"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                borderRadius: 8, fontSize: "0.85rem", fontWeight: 600,
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? "#2563eb" : "#64748b",
                boxShadow: activeTab === tab.key ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                minWidth: "120px"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ===== MESSAGES ===== */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
            padding: "10px 14px", marginBottom: "1rem", color: "#dc2626", fontSize: "0.85rem"
          }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8,
            padding: "10px 14px", marginBottom: "1rem", color: "#16a34a", fontSize: "0.85rem"
          }}>
            ✅ {success}
          </div>
        )}

        {/* ===== CARD WRAPPER ===== */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "1.75rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0"
        }}>

          {/* ---------- PERSONAL INFO TAB ---------- */}
          {activeTab === "personal" && (
            <form onSubmit={handleStaffSubmit}>
              {/* Photo Upload */}
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "0.85rem", display: "block", marginBottom: 8 }}>
                  Staff Photo
                </label>
                <div style={{
                  width: 110, height: 110, borderRadius: "50%", margin: "0 auto",
                  border: "3px dashed #cbd5e1", overflow: "hidden", position: "relative",
                  background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                }}>
                  {preview ? (
                    <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 36, opacity: 0.4 }}>📷</span>
                  )}
                  <input
                    type="file" name="photo" onChange={handleStaffChange}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                  />
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: 6 }}>Click to change photo</p>
              </div>

              {/* 2-col grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <InputField label="Staff ID" name="staffId" value={staff.staffId} onChange={handleStaffChange} />
                <InputField label="Email" name="email" type="email" value={staff.email} onChange={handleStaffChange} />
                <InputField label="First Name" name="firstName" value={staff.firstName} onChange={handleStaffChange} />
                <InputField label="Last Name" name="lastName" value={staff.lastName} onChange={handleStaffChange} />
                <InputField label="Mobile" name="mobile" type="tel" value={staff.mobile} onChange={handleStaffChange} />
                <InputField label="Specialization" name="specialization" value={staff.specialization} onChange={handleStaffChange} />
                <InputField label="Date of Birth" name="dob" type="date" value={staff.dob} onChange={handleStaffChange} />
                <InputField label="Joining Date" name="joiningDate" type="date" value={staff.joiningDate} onChange={handleStaffChange} />
              </div>

              <SubmitButton loading={loading} label="Update Staff" />
            </form>
          )}

          {/* ---------- ADDRESS TAB ---------- */}
          {activeTab === "address" && (
            <form onSubmit={handleStaffSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField label="Street Address" name="street" value={staff.street} onChange={handleStaffChange} placeholder="e.g. 123 Main Street" />
                </div>
                <InputField label="City" name="city" value={staff.city} onChange={handleStaffChange} placeholder="e.g. Chennai" />
                <InputField label="District" name="district" value={staff.district} onChange={handleStaffChange} placeholder="e.g. Chennai" />
                <InputField label="State" name="state" value={staff.state} onChange={handleStaffChange} placeholder="Tamil Nadu" />
                <InputField label="PIN Code" name="pinCode" value={staff.pinCode} onChange={handleStaffChange} placeholder="e.g. 600001" />
              </div>

              <SubmitButton loading={loading} label="Update Address" />
            </form>
          )}

          {/* ---------- DESIGNATION TAB ---------- */}
          {activeTab === "designation" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1rem" }}>Approved Designations</h3>
                <span style={{
                  background: "#dbeafe", color: "#2563eb", fontSize: "0.75rem",
                  fontWeight: 600, padding: "3px 10px", borderRadius: 20
                }}>
                  {designations.length} Total
                </span>
              </div>

              {designations.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "2.5rem 1rem",
                  background: "#f8fafc", borderRadius: 10, border: "1px dashed #cbd5e1"
                }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>No approved designations yet.</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {designations.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => selectDesignation(d)}
                    style={{
                      border: selectedDesignationId === d.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                      background: selectedDesignationId === d.id ? "#eff6ff" : "#fafafa",
                      transition: "all 0.2s ease",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{d.designation}</p>
                      <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.77rem" }}>
                        {d.from_date && d.from_date.split("T")[0]} {d.to_date && d.to_date !== "0000-00-00" ? "→ " + d.to_date.split("T")[0] : "→ Present"}
                      </p>
                    </div>
                    <span style={{ color: "#2563eb", fontSize: "0.75rem", fontWeight: 600 }}>
                      {selectedDesignationId === d.id ? "✓ Selected" : "Edit →"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Designation Edit Form */}
              {selectedDesignationId && (
                <form onSubmit={handleDesignationUpdate} style={{
                  marginTop: "1.25rem", background: "#f8fafc", borderRadius: 10,
                  padding: "1.25rem", border: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                    <h4 style={{ margin: 0, color: "#1e293b", fontSize: "0.95rem" }}>Edit Designation</h4>
                    <button type="button" onClick={() => setSelectedDesignationId(null)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <InputField label="Designation" name="designation" value={designationForm.designation} onChange={handleDesignationChange} />
                    </div>
                    <InputField label="From Date" name="from_date" type="date" value={designationForm.from_date} onChange={handleDesignationChange} />
                    <InputField label="To Date" name="to_date" type="date" value={designationForm.to_date} onChange={handleDesignationChange} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <InputField label="Order No" name="order_no" value={designationForm.order_no} onChange={handleDesignationChange} />
                    </div>
                  </div>

                  <button type="submit" style={{
                    marginTop: "1rem", width: "100%", padding: "10px", border: "none",
                    borderRadius: 8, background: "#16a34a", color: "#fff",
                    fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
                  }}
                    onMouseEnter={e => e.target.style.background = "#15803d"}
                    onMouseLeave={e => e.target.style.background = "#16a34a"}
                  >
                    Update Designation
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ---------- QUALIFICATION TAB ---------- */}
          {activeTab === "qualification" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1rem" }}>Approved Qualifications</h3>
                <span style={{
                  background: "#dbeafe", color: "#2563eb", fontSize: "0.75rem",
                  fontWeight: 600, padding: "3px 10px", borderRadius: 20
                }}>
                  {qualifications.length} Total
                </span>
              </div>

              {qualifications.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "2.5rem 1rem",
                  background: "#f8fafc", borderRadius: 10, border: "1px dashed #cbd5e1"
                }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>No approved qualifications yet.</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {qualifications.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => selectQualification(q)}
                    style={{
                      border: selectedQualificationId === q.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                      background: selectedQualificationId === q.id ? "#eff6ff" : "#fafafa",
                      transition: "all 0.2s ease",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{q.degree}</p>
                      <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.77rem" }}>
                        {q.major} • {q.university} • {q.completedYear}
                      </p>
                    </div>
                    <span style={{ color: "#2563eb", fontSize: "0.75rem", fontWeight: 600 }}>
                      {selectedQualificationId === q.id ? "✓ Selected" : "Edit →"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Qualification Edit Form */}
              {selectedQualificationId && (
                <form onSubmit={handleQualificationUpdate} style={{
                  marginTop: "1.25rem", background: "#f8fafc", borderRadius: 10,
                  padding: "1.25rem", border: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                    <h4 style={{ margin: 0, color: "#1e293b", fontSize: "0.95rem" }}>Edit Qualification</h4>
                    <button type="button" onClick={() => setSelectedQualificationId(null)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <InputField label="Degree" name="degree" value={qualificationForm.degree} onChange={handleQualificationChange} />
                    <InputField label="Major" name="major" value={qualificationForm.major} onChange={handleQualificationChange} />
                    <InputField label="Completed Year" name="completedYear" type="number" value={qualificationForm.completedYear} onChange={handleQualificationChange} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <InputField label="College" name="college" value={qualificationForm.college} onChange={handleQualificationChange} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <InputField label="University" name="university" value={qualificationForm.university} onChange={handleQualificationChange} />
                    </div>
                  </div>

                  <button type="submit" style={{
                    marginTop: "1rem", width: "100%", padding: "10px", border: "none",
                    borderRadius: 8, background: "#16a34a", color: "#fff",
                    fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
                  }}
                    onMouseEnter={e => e.target.style.background = "#15803d"}
                    onMouseLeave={e => e.target.style.background = "#16a34a"}
                  >
                    Update Qualification
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ---------- EXPERIENCE TAB ---------- */}
          {activeTab === "experience" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1rem" }}>Approved Experience</h3>
                <span style={{
                  background: "#dbeafe", color: "#2563eb", fontSize: "0.75rem",
                  fontWeight: 600, padding: "3px 10px", borderRadius: 20
                }}>
                  {experiences.length} Total
                </span>
              </div>

              {experiences.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "2.5rem 1rem",
                  background: "#f8fafc", borderRadius: 10, border: "1px dashed #cbd5e1"
                }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>No approved experience yet.</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => selectExperience(exp)}
                    style={{
                      border: selectedExperienceId === exp.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                      background: selectedExperienceId === exp.id ? "#eff6ff" : "#fafafa",
                      transition: "all 0.2s ease",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                        {exp.experience_type} - {exp.industry_worked}
                      </p>
                      <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.77rem" }}>
                        {exp.from_date && exp.from_date.split("T")[0]} → {exp.to_date ? exp.to_date.split("T")[0] : "Present"}
                      </p>
                    </div>
                    <span style={{ color: "#2563eb", fontSize: "0.75rem", fontWeight: 600 }}>
                      {selectedExperienceId === exp.id ? "✓ Selected" : "Edit →"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Experience Edit Form */}
              {selectedExperienceId && (
                <form onSubmit={handleExperienceUpdate} style={{
                  marginTop: "1.25rem", background: "#f8fafc", borderRadius: 10,
                  padding: "1.25rem", border: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                    <h4 style={{ margin: 0, color: "#1e293b", fontSize: "0.95rem" }}>Edit Experience</h4>
                    <button type="button" onClick={() => setSelectedExperienceId(null)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <div>
                      <label style={{
                        display: "block", marginBottom: 5, fontSize: "0.8rem",
                        fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px"
                      }}>
                        Experience Type
                      </label>
                      <select
                        name="experience_type"
                        value={experienceForm.experience_type}
                        onChange={handleExperienceChange}
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 8,
                          border: "1px solid #e2e8f0", fontSize: "0.88rem", color: "#1e293b",
                          background: "#fff", outline: "none", boxSizing: "border-box"
                        }}
                      >
                        <option value="">Select Type</option>
                        <option value="Industry">Industry</option>
                        <option value="Academic">Academic</option>
                      </select>
                    </div>
                    <InputField label="Industry/Organization" name="industry_worked" value={experienceForm.industry_worked} onChange={handleExperienceChange} />
                    <InputField label="From Date" name="from_date" type="date" value={experienceForm.from_date} onChange={handleExperienceChange} />
                    <InputField label="To Date" name="to_date" type="date" value={experienceForm.to_date} onChange={handleExperienceChange} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{
                        display: "block", marginBottom: 5, fontSize: "0.8rem",
                        fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px"
                      }}>
                        Remarks
                      </label>
                      <textarea
                        name="remarks"
                        value={experienceForm.remarks}
                        onChange={handleExperienceChange}
                        rows="3"
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 8,
                          border: "1px solid #e2e8f0", fontSize: "0.88rem", color: "#1e293b",
                          background: "#fff", outline: "none", boxSizing: "border-box", resize: "vertical"
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" style={{
                    marginTop: "1rem", width: "100%", padding: "10px", border: "none",
                    borderRadius: 8, background: "#16a34a", color: "#fff",
                    fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
                  }}
                    onMouseEnter={e => e.target.style.background = "#15803d"}
                    onMouseLeave={e => e.target.style.background = "#16a34a"}
                  >
                    Update Experience
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ---------- ADDITIONAL POST TAB ---------- */}
          {activeTab === "additionalPost" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1rem" }}>Approved Additional Posts</h3>
                <span style={{
                  background: "#dbeafe", color: "#2563eb", fontSize: "0.75rem",
                  fontWeight: 600, padding: "3px 10px", borderRadius: 20
                }}>
                  {additionalPosts.length} Total
                </span>
              </div>

              {additionalPosts.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "2.5rem 1rem",
                  background: "#f8fafc", borderRadius: 10, border: "1px dashed #cbd5e1"
                }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>No approved additional posts yet.</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {additionalPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => selectPost(post)}
                    style={{
                      border: selectedPostId === post.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                      background: selectedPostId === post.id ? "#eff6ff" : "#fafafa",
                      transition: "all 0.2s ease",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{post.post}</p>
                      <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.77rem" }}>
                        {post.fromDate && post.fromDate.split("T")[0]} → {post.toDate && post.toDate !== "0000-00-00" ? post.toDate.split("T")[0] : "Present"}
                      </p>
                    </div>
                    <span style={{ color: "#2563eb", fontSize: "0.75rem", fontWeight: 600 }}>
                      {selectedPostId === post.id ? "✓ Selected" : "Edit →"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional Post Edit Form */}
              {selectedPostId && (
                <form onSubmit={handlePostUpdate} style={{
                  marginTop: "1.25rem", background: "#f8fafc", borderRadius: 10,
                  padding: "1.25rem", border: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                    <h4 style={{ margin: 0, color: "#1e293b", fontSize: "0.95rem" }}>Edit Additional Post</h4>
                    <button type="button" onClick={() => setSelectedPostId(null)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <InputField label="Post" name="post" value={postForm.post} onChange={handlePostChange} />
                    </div>
                    <InputField label="From Date" name="fromDate" type="date" value={postForm.fromDate} onChange={handlePostChange} />
                    <InputField label="To Date" name="toDate" type="date" value={postForm.toDate} onChange={handlePostChange} />
                    <InputField label="Resolution No" name="resolutionNo" value={postForm.resolutionNo} onChange={handlePostChange} />
                    <InputField label="Order No" name="orderNo" value={postForm.orderNo} onChange={handlePostChange} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{
                        display: "block", marginBottom: 5, fontSize: "0.8rem",
                        fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px"
                      }}>
                        Remarks
                      </label>
                      <textarea
                        name="remarks"
                        value={postForm.remarks}
                        onChange={handlePostChange}
                        rows="3"
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 8,
                          border: "1px solid #e2e8f0", fontSize: "0.88rem", color: "#1e293b",
                          background: "#fff", outline: "none", boxSizing: "border-box", resize: "vertical"
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" style={{
                    marginTop: "1rem", width: "100%", padding: "10px", border: "none",
                    borderRadius: 8, background: "#16a34a", color: "#fff",
                    fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
                  }}
                    onMouseEnter={e => e.target.style.background = "#15803d"}
                    onMouseLeave={e => e.target.style.background = "#16a34a"}
                  >
                    Update Additional Post
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== REUSABLE INPUT COMPONENT ===== */
function InputField({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label style={{
        display: "block", marginBottom: 5, fontSize: "0.8rem",
        fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px"
      }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8,
          border: "1px solid #e2e8f0", fontSize: "0.88rem", color: "#1e293b",
          background: "#fff", outline: "none", boxSizing: "border-box",
          transition: "border-color 0.2s, box-shadow 0.2s"
        }}
        onFocus={e => {
          e.target.style.borderColor = "#2563eb";
          e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
        }}
        onBlur={e => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

/* ===== REUSABLE SUBMIT BUTTON ===== */
function SubmitButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{
      marginTop: "1.5rem", width: "100%", padding: "11px", border: "none",
      borderRadius: 8, background: loading ? "#93c5fd" : "#2563eb", color: "#fff",
      fontSize: "0.9rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
      transition: "background 0.2s", letterSpacing: "0.3px"
    }}
      onMouseEnter={e => { if (!loading) e.target.style.background = "#1d4ed8"; }}
      onMouseLeave={e => { if (!loading) e.target.style.background = "#2563eb"; }}
    >
      {loading ? "Updating..." : label}
    </button>
  );
}

export default EditStaff;