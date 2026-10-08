import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPendingApprovals } from "../api/adminApi";
import { getStaffByStaffId } from "../api/staffApi";
import { getPendingLeaveCount } from "../api/leaveApi";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // admin | staff
  const staffId = localStorage.getItem("staffId") || "14";

  const [openAddStaff, setOpenAddStaff] = useState(localStorage.getItem("openAddStaff") === "true");
  const [openApproval, setOpenApproval] = useState(localStorage.getItem("openApproval") === "true");
  const [staffPhoto, setStaffPhoto] = useState(null);
const [leavePendingCount, setLeavePendingCount] = useState(0);

  useEffect(() => {
    if (role === "staff" && staffId) {
      const fetchStaffPhoto = async () => {
        try {
          const res = await getStaffByStaffId(staffId);
          if (res?.photo) {
            setStaffPhoto(res.photo);
          }
        } catch (err) {
          console.error("Failed to load staff photo", err);
        }
      };
      fetchStaffPhoto();
    }
  }, [role, staffId]);

  const toggleAddStaff = () => {
    const val = !openAddStaff;
    setOpenAddStaff(val);
    localStorage.setItem("openAddStaff", val);
    
    // Navigate to ViewDetails page when toggling
    if (val && role === "staff" && staffId) {
      navigate(`/staff/${staffId}`);
    }
  };

  const toggleApproval = () => {
    const val = !openApproval;
    setOpenApproval(val);
    localStorage.setItem("openApproval", val);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
    window.location.reload();
  };

  const [pendingCounts, setPendingCounts] = useState({
    designation: 0,
    qualification: 0,
    additionalPost: 0,
    experience: 0,
  });

useEffect(() => {
  if (role === "admin") {

    const fetchPending = async () => {
      try {
        const res = await getPendingApprovals();
        setPendingCounts({
          designation: Number(res.designation) || 0,
          qualification: Number(res.qualification) || 0,
          additionalPost: Number(res.additionalPost) || 0,
          experience: Number(res.experience) || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLeavePending = async () => {
      try {
        const res = await getPendingLeaveCount();
        setLeavePendingCount(Number(res.count) || 0);
      } catch (err) {
        console.error("Leave count error:", err);
      }
    };

    fetchPending();
    fetchLeavePending();

    const interval = setInterval(() => {
      fetchPending();
      fetchLeavePending();
    }, 15000);

    return () => clearInterval(interval);
  }
}, [role]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sidebarStyle = {
    background: "linear-gradient(135deg, #8576aa 0%, #9bb5e3 100%)",
    color: "#000",
    width: "280px",
    height: "100vh",
    padding: "0",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: "6px 0 30px rgba(99, 102, 241, 0.25)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "2rem 1.5rem",
    textAlign: "center",
    borderBottom: "2px solid rgba(255,255,255,0.2)",
    background: "linear-gradient(135deg, #8576aa 0%, #9bb5e3 100%)",
  };

  const avatarStyle = {
    width: "95px",
    height: "95px",
    borderRadius: "50%",
    background: "#fff",
    margin: "0 auto 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "#8b5cf6",
    fontWeight: "bold",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    border: "4px solid rgba(255,255,255,0.4)",
  };

  const staffIdStyle = {
    fontSize: "1.1rem",
    color: "#fff",
    fontWeight: "600",
  };

  const menuContainerStyle = {
    padding: "1.5rem 0",
    flex: 1,
  };

  const liBaseStyle = {
    margin: "0.4rem 1rem",
    padding: "1rem 1.3rem",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "1.05rem",
    color: "#000",
    fontWeight: "600",
  };

  const linkStyle = {
    color: "inherit",
    textDecoration: "none",
    marginLeft: "15px",
    fontSize: "1.05rem",
    flex: 1,
    fontWeight: "600",
  };

  const iconStyle = { fontSize: "1.2rem", color: "inherit" };
  const caretStyle = { marginLeft: "auto", fontSize: "0.9rem", color: "inherit" };

  const badgeStyle = {
    background: "linear-gradient(135deg, #f59e0b 0%,#fb6f0b 100%)",
    color: "#000",
    fontWeight: "700",
    fontSize: "12px",
    padding: "5px 10px",
    borderRadius: "14px",
    minWidth: "24px",
    textAlign: "center",
    marginLeft: "10px",
    boxShadow: "0 3px 10px rgba(245, 158, 11, 0.5)",
  };

  const getItemStyle = (index, isActive = false) => {
    const isHovered = hoveredIndex === index;
    const isActiveItem = activeIndex === index || isActive;
    
    return {
      ...liBaseStyle,
      background: isActiveItem 
        ? "linear-gradient(135deg, #93a0bd 0%, #8963dc 100%)" 
        : isHovered 
        ? "rgba(255, 255, 255, 0.25)" 
        : "transparent",
      color: "#000",
      boxShadow: isActiveItem ? "0 6px 16px rgba(212, 210, 206, 0.5)" : "none",
      transform: isHovered || isActiveItem ? "translateX(5px) scale(1.02)" : "translateX(0)",
    };
  };

  const renderLi = (index, content, onClick = null, styleOverrides = {}, isActive = false) => (
    <li
      style={{
        ...getItemStyle(index, isActive),
        ...styleOverrides,
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={() => {
        if (onClick) onClick();
        setActiveIndex(index);
      }}
    >
      {content}
    </li>
  );

  let itemIndex = 0;

  return (
    <aside style={sidebarStyle}>
      {/* Header with Avatar */}
      <div style={headerStyle}>
        <div style={avatarStyle}>
          {staffPhoto ? (
            <img
              src={`http://localhost:5000/uploads/${staffPhoto}`}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          ) : (
            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>

        {role === "admin" && (
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "0.3rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Admin
          </div>
        )}

        {role === "staff" && (
          <div style={staffIdStyle}>Staff ID: {staffId}</div>
        )}
      </div>

      {/* Menu Items */}
      <div style={menuContainerStyle}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {/* STAFF MENU */}
          {role === "staff" && (
            <>
              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                </>
              ), null, {}, true)}
              {renderLi(itemIndex++, (
  <>
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={iconStyle}
    >
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
    </svg>
    <Link to={`/edit-membership/${staffId}`} style={linkStyle}>
      Edit Profile
    </Link>
  </>
))}

{renderLi(itemIndex++, (
  <>
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={iconStyle}
    >
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
    <Link to="/apply-leave" style={linkStyle}>
      Apply Leave
    </Link>
  </>
))}
              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span style={linkStyle}>Faculty Details</span>
                  {openAddStaff ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={caretStyle}>
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={caretStyle}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </>
              ), toggleAddStaff)}

              {openAddStaff && (
                <div style={{ marginLeft: "0rem" }}>
                  <SubItem link="/add-designation" text="Designation" />
                  <SubItem link="/add-qualification" text="Qualification" />
                  <SubItem link="/add-experience" text="Experience" />
                  <SubItem link="/add-additional-post" text="Additional Post" />
                  <SubItem link="/add-membership" text="Membership" />
                  <SubItem link="/add-award" text="Award" />
                  <SubItem link="/add-book" text="Book/Popular Article" />
                  <SubItem link="/add-conference" text="Conference" />
                  <SubItem link="/add-publication" text="Publication" />
                </div>
              )}
              
              
            </>
          )}
          
          

          {/* ADMIN MENU */}
          {role === "admin" && (
            <>
              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                </>
              ), null, {}, true)}

              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <Link to="/add-staff" style={linkStyle}>Add Staff</Link>
                </>
              ))}

              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <Link to="/staff-list" style={linkStyle}>Faculty Members</Link>
                </>
              ))}

              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span style={linkStyle}>Approval Status</span>
                  {Object.values(pendingCounts).reduce((a,b)=>a+b,0) > 0 && (
                    <span style={badgeStyle}>
                      {Object.values(pendingCounts).reduce((a,b)=>a+b,0)}
                    </span>
                  )}
                  {openApproval ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={caretStyle}>
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={caretStyle}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </>
              ), toggleApproval)}

              {openApproval && (
                <div style={{ marginLeft: "0rem" }}>
                  <ApprovalItem link="/designation-approval" text="Designation" count={pendingCounts.designation} />
                  <ApprovalItem link="/qualification-approval" text="Qualification" count={pendingCounts.qualification} />
                  <ApprovalItem link="/experience-approval" text="Experience" count={pendingCounts.experience} />
                  <ApprovalItem link="/additional-post-approval" text="Additional Post" count={pendingCounts.additionalPost} />
                </div>
              )}

              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <Link to="/update-staff" style={linkStyle}>Update / Delete</Link>
                </>
              ))}

              {renderLi(itemIndex++, (
  <>
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={iconStyle}
    >
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
    <Link to="/leave-approval" style={linkStyle}>
  Leave Approval
</Link>

{leavePendingCount > 0 && (
  <span style={badgeStyle}>
    {leavePendingCount}
  </span>
)}
  </>
))}

              {renderLi(itemIndex++, (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <Link to="/contact" style={linkStyle}>Contact Details</Link>
                </>
              ))}

              {renderLi(itemIndex++, (
  <>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
    <Link to="/staff-report" style={linkStyle}>Reports</Link>
  </>
))}

             
            </>
          )}

          {/* LOGOUT */}
          {renderLi(itemIndex++, (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={iconStyle}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span style={linkStyle}>Logout</span>
            </>
          ), handleLogout, { marginTop: "1.5rem", background: "#f56060", color: "#000" })}
        </ul>
      </div>
    </aside>
  );
};

/* ===== Helper Components ===== */
const SubItem = ({ link, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li 
      style={{ 
        margin: "0.3rem 1rem", 
        padding: "0.85rem 1.2rem 0.85rem 3rem", 
        display: "flex",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        color: "#000",
        background: isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent",
        fontSize: "1rem",
        cursor: "pointer",
        fontWeight: "600",
        transform: isHovered ? "translateX(5px)" : "translateX(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={link} style={{ 
        color: "inherit", 
        textDecoration: "none",
        fontWeight: "600",
      }}>
        • {text}
      </Link>
    </li>
  );
};

const ApprovalItem = ({ link, text, count }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li 
      style={{ 
        margin: "0.3rem 1rem", 
        padding: "0.85rem 1.2rem 0.85rem 3rem", 
        display: "flex", 
        alignItems: "center",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        color: "#000",
        background: isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent",
        fontSize: "1rem",
        cursor: "pointer",
        fontWeight: "600",
        transform: isHovered ? "translateX(5px)" : "translateX(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={link} style={{ 
        color: "inherit",
        textDecoration: "none", 
        flex: 1,
        fontWeight: "600",
      }}>
        • {text}
      </Link>
      {count > 0 && (
        <span style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #fb6f0b 100%)",
          color: "#000",
          borderRadius: "12px",
          padding: "4px 10px",
          fontSize: "11px",
          fontWeight: "700",
          boxShadow: "0 3px 8px rgba(251, 191, 36, 0.4)",
        }}>
          {count}
        </span>
      )}
    </li>
  );
};

export default Sidebar;