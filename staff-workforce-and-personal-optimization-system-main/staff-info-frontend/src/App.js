import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Components
import Landing from "./components/Landing";
import SigninPage from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import StaffDashboard from "./components/staffDashboard";
import AddStaff from "./components/AddStaff";
import AddDesignation from "./components/addDesignation";
import AddExperience from "./components/addExperience"
import AddQualification from "./components/addQualification";
import UpdateStaff from "./components/UpdateStaff";
import DeleteStaff from "./components/DeleteStaff";
import StaffList from "./components/StaffList";
import ViewDetails from "./components/ViewDetails";
import EditStaff from "./components/edit";
import Settings from "./components/Settings";
import ForgotPassword from "./components/ForgotPassword";
import Contact from "./components/contact";
import DesignationApproval from "./components/designationApproval";
import QualificationApproval from "./components/qualificationApproval";
import ExperienceApproval from "./components/experienceApproval"; 
import AdditionalPostAdd from "./components/addAdditionalpost";
import AdditionalPostApproval from "./components/additionalpostApproval";
import AddMembership from "./components/addMembership";
import AddAward from "./components/addAward";
import LeaveApply from "./components/leaveApply";
import LeaveApproval from "./components/leaveApproval";
import Update from "./components/update";
import StaffReport from "./components/staffReport";
import AddBook from "./components/addBook";
import AddConference from "./components/addConference";
import AddPublication from "./components/addPublication";

/* ================= PRIVATE ROUTE ================= */
function PrivateRoute({ children, adminOnly, user }) {
  if (!user) return <Navigate to="/signin" />;
  if (adminOnly && user !== "admin") return <Navigate to="/dashboard" />;
  return children;
}

/* ================= LOGOUT ================= */
function Logout({ onLogout }) {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Navigate to="/signin" />;
}

/* ================= APP ================= */
function App() {
  const [user, setUser] = useState(null); // 'admin' or 'staff'
  const [staffList, setStaffList] = useState([]);
  const [removedList, setRemovedList] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminPwd, setAdminPwd] = useState("admin123");

  /* ================= HANDLERS ================= */
  const handleLogin = (username) => setUser(username);
  const handleLogout = () => setUser(null);

  const handleAddStaff = (staff) => {
    setStaffList([...staffList, staff]);
    setRecentActivities((prev) => [`Added staff: ${staff.name}`, ...prev]);
  };

  const handleUpdateStaff = (data) => {
    setStaffList(
      staffList.map((sf) => (sf.username === data.username ? data : sf))
    );
    setRecentActivities((prev) => [`Updated staff: ${data.name}`, ...prev]);
  };

  const handleRemoveStaff = (staff) => {
    setRemovedList([...removedList, staff]);
    setStaffList(staffList.filter((sf) => sf.username !== staff.username));
    setRecentActivities((prev) => [`Removed staff: ${staff.name}`, ...prev]);
  };

  const handleChangeAdminPwd = (newPwd) => {
    setAdminPwd(newPwd);
    setRecentActivities((prev) => ["Admin password changed", ...prev]);
  };

  /* ================= FILTER ================= */
  const filteredStaff = staffList.filter((sf) =>
    (sf.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  /* ================= ROUTES ================= */
  return (
    <Routes>
      {/* ===== LANDING PAGE (HOME) ===== */}
      <Route path="/" element={<Landing />} />

      {/* ===== SIGN IN ===== */}
      <Route
        path="/signin"
        element={
          user ? <Navigate to="/dashboard" /> : <SigninPage onLogin={handleLogin} />
        }
      />

      {/* ===== DASHBOARD ===== */}
      <Route
  path="/dashboard"
  element={
    <PrivateRoute user={user}>
      {user === "admin" ? (
        <Dashboard
          staffCount={staffList.length}
          recentActivities={recentActivities}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />
      ) : (
        <StaffDashboard />
      )}
    </PrivateRoute>
  }
/>


      {/* ===== ADD STAFF ===== */}
      <Route
        path="/add-staff"
        element={
          <PrivateRoute user={user}>
            <AddStaff onAdd={handleAddStaff} />
          </PrivateRoute>
        }
      />

      <Route path="/update/:staffId" element={<UpdateStaff />} />

      {/* ===== ADD DESIGNATION ===== */}
      <Route
        path="/add-designation"
        element={
          <PrivateRoute user={user}>
            <AddDesignation />
          </PrivateRoute>
        }
      />

<Route
  path="/staff-report"
  element={
    <PrivateRoute adminOnly={true} user={user}>
      <StaffReport />
    </PrivateRoute>
  }
/>

{/* ===== APPLY LEAVE (STAFF) ===== */}
<Route
  path="/apply-leave"
  element={
    <PrivateRoute user={user}>
      <LeaveApply />
    </PrivateRoute>
  }
/>

{/* ===== LEAVE APPROVAL (ADMIN) ===== */}
<Route
  path="/leave-approval"
  element={
    <PrivateRoute user={user} adminOnly>
      <LeaveApproval />
    </PrivateRoute>
  }
/>
      {/* ===== ADD QUALIFICATION ===== */}
      <Route
        path="/add-qualification"
        element={
          <PrivateRoute user={user}>
            <AddQualification />
          </PrivateRoute>
        }
      />
      {/* ===== ADD EXPERIENCE ===== */} 
      <Route
        path="/add-experience"
        element={
          <PrivateRoute user={user}>
            <AddExperience />
          </PrivateRoute>
        }
      />


      <Route
        path="/edit-membership/:staffId"
        element={
            <PrivateRoute user={user}>
                <Update />
            </PrivateRoute>
  }
/>

      {/* 🔥 ADDITIONAL POST (STAFF) */}
      <Route
        path="/add-additional-post"
        element={
          <PrivateRoute user={user}>
            <AdditionalPostAdd />
          </PrivateRoute>
        }
      />

      {/* ===== ADD CONFERENCE ===== */}
<Route
  path="/add-conference"
  element={
    <PrivateRoute user={user}>
      <AddConference />
    </PrivateRoute>
  }
/>


      {/* ===== DESIGNATION APPROVAL (ADMIN) ===== */}
      <Route
        path="/designation-approval"
        element={
          <PrivateRoute user={user} adminOnly>
            <DesignationApproval />
          </PrivateRoute>
        }
      />

      {/* ===== QUALIFICATION APPROVAL (ADMIN) ===== */}
      <Route
        path="/qualification-approval"
        element={
          <PrivateRoute user={user} adminOnly>
            <QualificationApproval />
          </PrivateRoute>
        }
      />
      <Route
        path="/experience-approval"
        element={
          <PrivateRoute user={user} adminOnly>
            <ExperienceApproval />
          </PrivateRoute>
        }
      />

      {/* 🔥 ADDITIONAL POST APPROVAL (ADMIN) */}
      <Route
        path="/additional-post-approval"
        element={
          <PrivateRoute user={user} adminOnly>
            <AdditionalPostApproval />
          </PrivateRoute>
        }
      />

      {/* ===== UPDATE STAFF ===== */}
      <Route
        path="/update-staff"
        element={
          <PrivateRoute user={user} adminOnly>
            <UpdateStaff staff={currentStaff} onUpdate={handleUpdateStaff} />
          </PrivateRoute>
        }
      />

      {/* ===== CONTACT ===== */}
      <Route
        path="/contact"
        element={
          <PrivateRoute user={user} adminOnly>
            <Contact />
          </PrivateRoute>
        }
      />

      {/* ===== EDIT STAFF ===== */}
      <Route
        path="/edit-staff/:id"
        element={
          <PrivateRoute user={user} adminOnly>
            <EditStaff />
          </PrivateRoute>
        }
      />

      {/* ===== STAFF LIST ===== */}
      <Route
        path="/staff-list"
        element={
          <PrivateRoute user={user}>
            <StaffList
              staffList={filteredStaff}
              onView={setCurrentStaff}
              onDelete={handleRemoveStaff}
            />
          </PrivateRoute>
        }
      />

      {/* ===== VIEW DETAILS ===== */}
      <Route
        path="/staff/:id"
        element={
          <PrivateRoute user={user}>
            <ViewDetails />
          </PrivateRoute>
        }
      />

      {/* ===== REMOVED STAFF ===== */}
      <Route
        path="/removed-staff"
        element={
          <PrivateRoute user={user} adminOnly>
            <DeleteStaff />
          </PrivateRoute>
        }
      />

      {/* ===== SETTINGS ===== */}
      <Route
        path="/settings"
        element={
          <PrivateRoute user={user} adminOnly>
            <Settings
              oldPassword={adminPwd}
              onChangePassword={handleChangeAdminPwd}
            />
          </PrivateRoute>
        }
      />

      <Route
        path="/add-membership"
        element={
          <PrivateRoute user={user}>
            <AddMembership />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-award"
        element={
          <PrivateRoute user={user}>
            <AddAward />
          </PrivateRoute>
        }
      />
      {/* ===== ADD BOOK / POPULAR ARTICLE ===== */}
<Route
  path="/add-book"
  element={
    <PrivateRoute user={user}>
      <AddBook />
    </PrivateRoute>
  }
/>

      <Route
        path="/add-publication"
        element={
          <PrivateRoute user={user}>
            <AddPublication />
          </PrivateRoute>
        }
      />

      {/* ===== LOGOUT ===== */}
      <Route
        path="/logout"
        element={
          <PrivateRoute user={user}>
            <Logout onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* ===== FORGOT PASSWORD ===== */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

export default App;