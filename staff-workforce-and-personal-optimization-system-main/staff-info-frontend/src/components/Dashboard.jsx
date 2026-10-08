import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

import {
  FaUsers,
  FaClock,
  FaCalendarCheck,
  FaUserTag,
  
  FaUserGraduate,
  FaAward,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaChartBar,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStaff: 0,
    pendingDesignation: 0,
    pendingQualification: 0,
    pendingExperience: 0,
    pendingAdditionalPost: 0,
    leavePending: 0,
  });

  const [summary, setSummary] = useState({
    totalApproved: 0,
    totalRejected: 0,
    totalPending: 0,
    moduleHealth: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const staffRes = await fetch("http://localhost:5000/api/staff");
      const staffData = await staffRes.json();

      const pendingRes = await fetch("http://localhost:5000/api/admin/pending-counts");
      const pendingData = await pendingRes.json();

      const [designationRes, qualificationRes, experienceRes, additionalRes, leaveRes] =
        await Promise.all([
          fetch("http://localhost:5000/api/designation/admin"),
          fetch("http://localhost:5000/api/qualifications/admin/all"),
          fetch("http://localhost:5000/api/experience/admin/all"),
          fetch("http://localhost:5000/api/additional-posts/admin/all"),
          fetch("http://localhost:5000/api/leave/admin/all"),
        ]);

      const designations = await designationRes.json();
      const qualifications = await qualificationRes.json();
      const experiences = await experienceRes.json();
      const additionalPosts = await additionalRes.json();
      const leaves = await leaveRes.json();

      const leavePending = leaves.filter(
        (l) => l.status === 0 || l.status === "pending" || l.flag === 0
      ).length;

      // Compute summary stats
      const computeStats = (items, statusField = "status") => ({
        pending: items.filter((i) => i[statusField] === 0).length,
        approved: items.filter((i) => i[statusField] === 1).length,
        rejected: items.filter((i) => i[statusField] === 2).length,
      });

      const desSt = computeStats(designations, "flag");
      const qualSt = computeStats(qualifications);
      const expSt = computeStats(experiences);
      const addSt = computeStats(additionalPosts);
      const leaveSt = computeStats(leaves);

      const totalApproved =
        desSt.approved + qualSt.approved + expSt.approved + addSt.approved + leaveSt.approved;
      const totalRejected =
        desSt.rejected + qualSt.rejected + expSt.rejected + addSt.rejected + leaveSt.rejected;
      const totalPending =
        desSt.pending + qualSt.pending + expSt.pending + addSt.pending + leaveSt.pending;

      const moduleHealth = [
        {
          label: "Designation",
          pending: desSt.pending,
          approved: desSt.approved,
          rejected: desSt.rejected,
          total: designations.length,
          route: "/designation-approval",
        },
        {
          label: "Qualification",
          pending: qualSt.pending,
          approved: qualSt.approved,
          rejected: qualSt.rejected,
          total: qualifications.length,
          route: "/qualification-approval",
        },
        {
          label: "Experience",
          pending: expSt.pending,
          approved: expSt.approved,
          rejected: expSt.rejected,
          total: experiences.length,
          route: "/experience-approval",
        },
        {
          label: "Additional Post",
          pending: addSt.pending,
          approved: addSt.approved,
          rejected: addSt.rejected,
          total: additionalPosts.length,
          route: "/additional-post-approval",
        },
        {
          label: "Leave",
          pending: leaveSt.pending,
          approved: leaveSt.approved,
          rejected: leaveSt.rejected,
          total: leaves.length,
          route: "/leave-approval",
        },
      ];

      setStats({
        totalStaff: staffData.length,
        pendingDesignation: pendingData.designation,
        pendingQualification: pendingData.qualification,
        pendingExperience: pendingData.experience || 0,
        pendingAdditionalPost: pendingData.additionalPost,
        leavePending,
      });

      setSummary({ totalApproved, totalRejected, totalPending, moduleHealth });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setLoading(false);
    }
  };

  const totalPending =
    stats.pendingDesignation +
    stats.pendingQualification +
    stats.pendingExperience +
    stats.pendingAdditionalPost;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const grandTotal = summary.totalApproved + summary.totalRejected + summary.totalPending || 1;
  const approvedPct = Math.round((summary.totalApproved / grandTotal) * 100);
  const rejectedPct = Math.round((summary.totalRejected / grandTotal) * 100);
  const pendingPct = Math.round((summary.totalPending / grandTotal) * 100);

  return (
    <div style={styles.container}>
      <Sidebar />

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome back!</p>
        </div>
        <div style={styles.dateBox}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div
          style={{ ...styles.statCard, ...styles.blueGradient }}
          onClick={() => navigate("/staff-list")}
        >
          <div style={styles.statIcon}>
            <FaUsers size={32} />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalStaff}</h3>
            <p style={styles.statLabel}>Total Faculty Members</p>
            <span style={styles.statLink}>View All →</span>
          </div>
        </div>

        <div
          style={{ ...styles.statCard, ...styles.orangeGradient }}
          onClick={(e) => e.preventDefault()}
        >
          {totalPending > 0 && <div style={styles.badge}>{totalPending}</div>}
          <div style={styles.statIcon}>
            <FaClock size={32} />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{totalPending}</h3>
            <p style={styles.statLabel}>Pending Approvals</p>
          </div>
        </div>

        <div
          style={{ ...styles.statCard, ...styles.greenGradient }}
          onClick={() => navigate("/leave-approval")}
        >
          {stats.leavePending > 0 && <div style={styles.badge}>{stats.leavePending}</div>}
          <div style={styles.statIcon}>
            <FaCalendarCheck size={32} />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.leavePending}</h3>
            <p style={styles.statLabel}>Leave Approval</p>
            <span style={styles.statLink}>View All →</span>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div style={styles.breakdownGrid}>
        <div style={styles.breakdownCard} onClick={() => navigate("/designation-approval")}>
          <div style={styles.breakdownIcon}>
            <FaUserGraduate size={24} color="#3b82f6" />
          </div>
          <div>
            <h4 style={styles.breakdownNumber}>{stats.pendingDesignation}</h4>
            <p style={styles.breakdownLabel}>Designation Requests</p>
          </div>
        </div>

        <div style={styles.breakdownCard} onClick={() => navigate("/qualification-approval")}>
          <div style={styles.breakdownIcon}>
            <FaAward size={24} color="#10b981" />
          </div>
          <div>
            <h4 style={styles.breakdownNumber}>{stats.pendingQualification}</h4>
            <p style={styles.breakdownLabel}>Qualification Requests</p>
          </div>
        </div>

        <div style={styles.breakdownCard} onClick={() => navigate("/experience-approval")}>
          <div style={styles.breakdownIcon}>
            <FaUserTag size={24} color="#fb86de" />
          </div>
          <div>
            <h4 style={styles.breakdownNumber}>{stats.pendingExperience}</h4>
            <p style={styles.breakdownLabel}>Experience Requests</p>
          </div>
        </div>

        <div style={styles.breakdownCard} onClick={() => navigate("/additional-post-approval")}>
          <div style={styles.breakdownIcon}>
            <FaFileAlt size={24} color="#f59e0b" />
          </div>
          <div>
            <h4 style={styles.breakdownNumber}>{stats.pendingAdditionalPost}</h4>
            <p style={styles.breakdownLabel}>Additional Post Requests</p>
          </div>
        </div>
      </div>

      {/* ── Summary Overview (replaces Recent Activities) ── */}
      <div style={styles.summaryContainer}>
        {/* Section header */}
        <div style={styles.summaryHeader}>
          <h2 style={styles.summaryTitle}>
            <FaChartBar style={{ marginRight: "10px", color: "#6366f1" }} />
            Approval Summary Overview
          </h2>
          <span style={styles.refreshBadge}>● Live</span>
        </div>

        <div style={styles.summaryBody}>
          {/* Left: KPI tiles + bar */}
          <div style={styles.kpiPanel}>
            <div style={styles.kpiGrid}>
              <div style={{ ...styles.kpiTile, borderLeft: "4px solid #10b981" }}>
                <FaCheckCircle size={20} color="#10b981" style={{ marginBottom: 8 }} />
                <span style={styles.kpiNumber}>{summary.totalApproved}</span>
                <span style={styles.kpiLabel}>Approved</span>
              </div>
              <div style={{ ...styles.kpiTile, borderLeft: "4px solid #ef4444" }}>
                <FaTimesCircle size={20} color="#ef4444" style={{ marginBottom: 8 }} />
                <span style={styles.kpiNumber}>{summary.totalRejected}</span>
                <span style={styles.kpiLabel}>Rejected</span>
              </div>
              <div style={{ ...styles.kpiTile, borderLeft: "4px solid #f59e0b" }}>
                <FaHourglassHalf size={20} color="#f59e0b" style={{ marginBottom: 8 }} />
                <span style={styles.kpiNumber}>{summary.totalPending}</span>
                <span style={styles.kpiLabel}>Pending</span>
              </div>
            </div>

            {/* Stacked progress bar */}
            <div style={{ marginTop: 24 }}>
              <p style={styles.barLabel}>Overall Request Distribution</p>
              <div style={styles.stackedBar}>
                <div
                  title={`Approved: ${approvedPct}%`}
                  style={{ ...styles.barSegment, width: `${approvedPct}%`, background: "#10b981" }}
                />
                <div
                  title={`Rejected: ${rejectedPct}%`}
                  style={{ ...styles.barSegment, width: `${rejectedPct}%`, background: "#ef4444" }}
                />
                <div
                  title={`Pending: ${pendingPct}%`}
                  style={{ ...styles.barSegment, width: `${pendingPct}%`, background: "#f59e0b" }}
                />
              </div>
              <div style={styles.barLegend}>
                <span style={{ ...styles.legendDot, background: "#10b981" }} /> Approved {approvedPct}%
                <span style={{ ...styles.legendDot, background: "#ef4444", marginLeft: 16 }} /> Rejected {rejectedPct}%
                <span style={{ ...styles.legendDot, background: "#f59e0b", marginLeft: 16 }} /> Pending {pendingPct}%
              </div>
            </div>
          </div>

          {/* Right: Module health table */}
          <div style={styles.modulePanel}>
            <p style={styles.modulePanelTitle}>Module-wise Breakdown</p>
            <table style={styles.moduleTable}>
              <thead>
                <tr>
                  {["Module", "Total", "Approved", "Rejected", "Pending"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.moduleHealth.map((mod, i) => (
                  <tr
                    key={i}
                    style={styles.tr}
                    onClick={() => navigate(mod.route)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={styles.tdLabel}>{mod.label}</td>
                    <td style={styles.td}>{mod.total}</td>
                    <td style={styles.td}>
                      <span style={styles.pillGreen}>{mod.approved}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.pillRed}>{mod.rejected}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.pillAmber}>{mod.pending}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h3 style={styles.quickTitle}>Quick Actions</h3>
        <div style={styles.quickGrid}>
          <button style={styles.quickBtn} onClick={() => navigate("/contact")}>
            📞 Update Contact Details
          </button>
          <button style={styles.quickBtn} onClick={() => navigate("/update-staff")}>
            ✏️ Edit Staff Information
          </button>
          <button style={styles.quickBtn} onClick={() => navigate("/removed-staff")}>
            🗑️ Manage Deleted Staff
          </button>
          <button style={styles.quickBtn} onClick={() => navigate("/settings")}>
            🔐 Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginLeft: "260px",
    padding: "30px 40px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f8fafc",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: { fontSize: "32px", fontWeight: "800", color: "#1e293b", marginBottom: "5px" },
  subtitle: { fontSize: "16px", color: "#64748b" },
  dateBox: {
    background: "#fff",
    padding: "12px 20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  blueGradient: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  orangeGradient: { background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  greenGradient: { background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  statIcon: { color: "rgba(255,255,255,0.9)", flexShrink: 0 },
  statContent: { color: "#fff" },
  statNumber: { fontSize: "42px", fontWeight: "800", margin: "0 0 5px 0" },
  statLabel: { fontSize: "14px", opacity: 0.9, margin: 0 },
  statLink: { display: "inline-block", marginTop: "8px", fontSize: "13px", fontWeight: "600", opacity: 0.95 },
  badge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#ef4444",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 4px 10px rgba(239,68,68,0.4)",
  },
  breakdownGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  breakdownCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  breakdownIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  breakdownNumber: { fontSize: "24px", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" },
  breakdownLabel: { fontSize: "13px", color: "#64748b", margin: 0 },

  // ── Summary Overview ──
  summaryContainer: {
    background: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  summaryTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    margin: 0,
  },
  refreshBadge: {
    background: "#ecfdf5",
    color: "#065f46",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  summaryBody: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "32px",
    alignItems: "start",
  },

  // KPI left panel
  kpiPanel: { display: "flex", flexDirection: "column" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" },
  kpiTile: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  kpiNumber: { fontSize: "28px", fontWeight: "800", color: "#1e293b" },
  kpiLabel: { fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },

  barLabel: { fontSize: "13px", color: "#64748b", marginBottom: "8px", fontWeight: "600" },
  stackedBar: {
    display: "flex",
    height: "10px",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#f1f5f9",
  },
  barSegment: { height: "100%", transition: "width 0.6s ease" },
  barLegend: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    fontSize: "12px",
    color: "#64748b",
    flexWrap: "wrap",
    gap: "4px",
  },
  legendDot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "5px",
  },

  // Module table right panel
  modulePanel: { overflow: "auto" },
  modulePanelTitle: { fontSize: "13px", fontWeight: "700", color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" },
  moduleTable: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #f1f5f9",
  },
  tr: { cursor: "pointer", transition: "background 0.15s", borderBottom: "1px solid #f8fafc" },
  tdLabel: { padding: "12px 12px", fontWeight: "600", color: "#334155" },
  td: { padding: "12px 12px", color: "#475569", textAlign: "left" },
  pillGreen: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  pillRed: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  pillAmber: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },

  // Quick Actions
  quickActions: {
    background: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  quickTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  quickBtn: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "14px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
    transition: "all 0.2s",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  [style*="quickBtn"]:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }
  [style*="breakdownCard"]:hover {
    transform: translateY(-3px);
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;