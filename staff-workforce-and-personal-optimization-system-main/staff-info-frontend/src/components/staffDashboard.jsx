import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard,
  FaClock,
  FaBirthdayCake,
  FaUserGraduate,
  FaAward,
  FaFileAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaBell
} from "react-icons/fa";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    staffId: "",
    designation: "",
    email: "",
    mobile: "",
    photo: null,
    joiningDate: "",
    dob: ""
  });

  const [pendingCounts, setPendingCounts] = useState({
    designation: 0,
    qualification: 0,
    additionalPost: 0,
    experience: 0
  });

  const [loading, setLoading] = useState(true);

  // FIX 1: Wrap in useCallback so it's stable and safe to include in useEffect deps
  const fetchDashboardData = useCallback(async () => {
    try {
      const profileRes = await fetch(`http://localhost:5000/api/staff/${staffId}`);
      const profileData = await profileRes.json();

      setProfile({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        staffId: profileData.staffId || "",
        designation: profileData.designation || "Not Set",
        email: profileData.email || "",
        mobile: profileData.mobile || "",
        photo: profileData.photo || null,
        joiningDate: profileData.joiningDate || "",
        dob: profileData.dob || ""
      });

      const designationRes = await fetch(`http://localhost:5000/api/designation/staff/${staffId}`);
      const designations = await designationRes.json();
      const pendingDesignation = designations.filter(d => d.flag === 0).length;

      const qualificationRes = await fetch(`http://localhost:5000/api/qualifications/staff/${staffId}`);
      const qualifications = await qualificationRes.json();
      const pendingQualification = qualifications.filter(q => q.status === 0).length;

      const additionalRes = await fetch(`http://localhost:5000/api/additional-posts/staff/${staffId}`);
      const additionalPosts = await additionalRes.json();
      const pendingAdditional = additionalPosts.filter(a => a.status === 0).length;

      setPendingCounts({
        designation: pendingDesignation,
        qualification: pendingQualification,
        additionalPost: pendingAdditional,
        experience: 0
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setLoading(false);
    }
  }, [staffId]); // staffId is the only external value used inside

  useEffect(() => {
    if (!staffId) {
      navigate("/signin");
      return;
    }
    fetchDashboardData();
  }, [staffId, navigate, fetchDashboardData]); // FIX 1 cont'd: all deps now included

  const totalPending = pendingCounts.designation + pendingCounts.qualification + 
                       pendingCounts.additionalPost + pendingCounts.experience;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome, {profile.firstName}!</h1>
        </div>
        <div style={styles.dateBox}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          {profile.photo ? (
            <img 
              src={`http://localhost:5000/uploads/${profile.photo}`}
              alt="Profile"
              style={styles.profilePhoto}
            />
          ) : (
            <div style={styles.profilePhotoPlaceholder}>
              <FaUser size={40} color="#fff" />
            </div>
          )}
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p style={styles.profileDesignation}>{profile.designation}</p>
          </div>
          {totalPending > 0 && (
            <div style={styles.notificationBadge}>
              <FaBell size={16} />
              <span>{totalPending} Pending</span>
            </div>
          )}
        </div>

        <div style={styles.profileDetails}>
          <div style={styles.profileDetailItem}>
            <FaIdCard style={styles.profileIcon} />
            <div>
              <p style={styles.profileLabel}>Staff ID</p>
              <p style={styles.profileValue}>{profile.staffId}</p>
            </div>
          </div>

          <div style={styles.profileDetailItem}>
            <FaEnvelope style={styles.profileIcon} />
            <div>
              <p style={styles.profileLabel}>Email</p>
              <p style={styles.profileValue}>{profile.email}</p>
            </div>
          </div>

          <div style={styles.profileDetailItem}>
            <FaPhone style={styles.profileIcon} />
            <div>
              <p style={styles.profileLabel}>Mobile</p>
              <p style={styles.profileValue}>{profile.mobile}</p>
            </div>
          </div>

          <div style={styles.profileDetailItem}>
            <FaBirthdayCake style={styles.profileIcon} />
            <div>
              <p style={styles.profileLabel}>Date Of Birth</p>
              <p style={styles.profileValue}>{profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>

          <div style={styles.profileDetailItem}>
            <FaCalendarAlt style={styles.profileIcon} />
            <div>
              <p style={styles.profileLabel}>Joining Date</p>
              <p style={styles.profileValue}>
                {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <button 
          style={styles.viewFullProfile}
          onClick={() => navigate(`/staff/${staffId}`)}
        >
          View Full Profile →
        </button>
      </div>

      {/* Pending Status Cards */}
      <div style={styles.statusSection}>
        <h2 style={styles.sectionTitle}>Approval Status</h2>
        
        <div style={styles.statusGrid}>
          <div 
            style={{...styles.statusCard, ...styles.purpleGradient}}
            onClick={() => navigate("/add-designation")}
          >
            {pendingCounts.designation > 0 && (
              <div style={styles.statusBadge}>{pendingCounts.designation}</div>
            )}
            <div style={styles.statusIcon}>
              <FaUserGraduate size={32} />
            </div>
            <div style={styles.statusContent}>
              <h3 style={styles.statusNumber}>{pendingCounts.designation}</h3>
              <p style={styles.statusLabel}>Designation Pending</p>
              <div style={styles.statusFooter}>
                <FaClock size={14} />
                <span>Click to view</span>
              </div>
            </div>
          </div>

          <div 
            style={{...styles.statusCard, ...styles.blueGradient}}
            onClick={() => navigate("/add-qualification")}
          >
            {pendingCounts.qualification > 0 && (
              <div style={styles.statusBadge}>{pendingCounts.qualification}</div>
            )}
            <div style={styles.statusIcon}>
              <FaAward size={32} />
            </div>
            <div style={styles.statusContent}>
              <h3 style={styles.statusNumber}>{pendingCounts.qualification}</h3>
              <p style={styles.statusLabel}>Qualification Pending</p>
              <div style={styles.statusFooter}>
                <FaClock size={14} />
                <span>Click to view</span>
              </div>
            </div>
          </div>

          <div 
            style={{...styles.statusCard, ...styles.orangeGradient}}
            onClick={() => navigate("/add-additional-post")}
          >
            {pendingCounts.additionalPost > 0 && (
              <div style={styles.statusBadge}>{pendingCounts.additionalPost}</div>
            )}
            <div style={styles.statusIcon}>
              <FaFileAlt size={32} />
            </div>
            <div style={styles.statusContent}>
              <h3 style={styles.statusNumber}>{pendingCounts.additionalPost}</h3>
              <p style={styles.statusLabel}>Additional Post Pending</p>
              <div style={styles.statusFooter}>
                <FaClock size={14} />
                <span>Click to view</span>
              </div>
            </div>
          </div>

          <div 
            style={{...styles.statusCard, ...styles.greenGradient}}
            onClick={() => navigate("/add-experience")}
          >
            {pendingCounts.experience > 0 && (
              <div style={styles.statusBadge}>{pendingCounts.experience}</div>
            )}
            <div style={styles.statusIcon}>
              <FaBriefcase size={32} />
            </div>
            <div style={styles.statusContent}>
              <h3 style={styles.statusNumber}>{pendingCounts.experience}</h3>
              <p style={styles.statusLabel}>Experience Pending</p>
              <div style={styles.statusFooter}>
                <FaClock size={14} />
                <span>Click to view</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        
        <div style={styles.quickGrid}>
          <div style={styles.quickCard} onClick={() => navigate("/add-membership")}>
            <div style={styles.quickIcon}>📋</div>
            <p style={styles.quickLabel}>Add Membership</p>
          </div>

          <div style={styles.quickCard} onClick={() => navigate("/add-award")}>
            <div style={styles.quickIcon}>🏆</div>
            <p style={styles.quickLabel}>Add Award</p>
          </div>

          <div style={styles.quickCard} onClick={() => navigate("/add-publication")}>
            <div style={styles.quickIcon}>📚</div>
            <p style={styles.quickLabel}>Add Publication</p>
          </div>

          <div style={styles.quickCard} onClick={() => navigate("/add-conference")}>
            <div style={styles.quickIcon}>🎤</div>
            <p style={styles.quickLabel}>Add Conference</p>
          </div>

          <div style={styles.quickCard} onClick={() => navigate("/add-book")}>
            <div style={styles.quickIcon}>📰</div>
            <p style={styles.quickLabel}>Add Popular Article</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// FIX 2: Removed unused getStatusText and getStatusStyle functions

const styles = {
  container: {
    marginLeft: "260px",
    padding: "30px 40px",
    background: "#f8fafc",
    minHeight: "100vh"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f8fafc"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "5px"
  },
  dateBox: {
    background: "#fff",
    padding: "12px 20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500"
  },
  profileCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginBottom: "30px",
    position: "relative",
    overflow: "hidden"
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f1f5f9"
  },
  profilePhoto: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e0e7ff"
  },
  profilePhotoPlaceholder: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 5px 0"
  },
  profileDesignation: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0
  },
  notificationBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "10px 16px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "14px"
  },
  profileDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "20px"
  },
  profileDetailItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "12px"
  },
  profileIcon: {
    color: "#3b82f6",
    fontSize: "24px"
  },
  profileLabel: {
    fontSize: "12px",
    color: "#64748b",
    margin: "0 0 4px 0"
  },
  profileValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0
  },
  viewFullProfile: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s"
  },
  statusSection: {
    marginBottom: "30px"
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "20px"
  },
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px"
  },
  statusCard: {
    padding: "24px",
    borderRadius: "16px",
    cursor: "pointer",
    position: "relative",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  purpleGradient: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  blueGradient: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  orangeGradient: {
    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
  },
  greenGradient: {
    background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
  },
  statusBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#ef4444",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow: "0 4px 10px rgba(239,68,68,0.4)"
  },
  statusIcon: {
    color: "rgba(255,255,255,0.9)",
    marginBottom: "12px"
  },
  statusContent: {
    color: "#fff"
  },
  statusNumber: {
    fontSize: "36px",
    fontWeight: "800",
    margin: "0 0 8px 0"
  },
  statusLabel: {
    fontSize: "15px",
    opacity: 0.95,
    margin: "0 0 12px 0"
  },
  statusFooter: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    opacity: 0.9
  },
  quickActions: {
    marginBottom: "30px"
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px"
  },
  quickCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "transform 0.2s"
  },
  quickIcon: {
    fontSize: "36px",
    marginBottom: "12px"
  },
  quickLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
    margin: 0
  }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default StaffDashboard;