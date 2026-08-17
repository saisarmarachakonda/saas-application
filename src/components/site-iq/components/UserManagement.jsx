import React, { useState, useEffect } from "react";
import { Users, UserPlus, Globe, Check, AlertCircle } from "lucide-react";
import { getUsers, getVendors, getProjects, saveData } from "../data/mockData";

export default function UserManagement({ currentUser }) {
  if (currentUser.role !== "PMCC" && currentUser.role !== "Admin") {
    return (
      <div className="validation-indicator danger" style={{ fontWeight: 650, marginTop: "20px" }}>
        <AlertCircle size={18} />
        <div>
          <strong>Access Denied:</strong> You are not authorized to view the User and Vendor control panel. Administrative privileges are restricted to PMCC executives and System Administrators.
        </div>
      </div>
    );
  }

  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState("users");

  // User form states
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("Site Engr");
  const [mappedProjects, setMappedProjects] = useState([]);

  // Vendor form states
  const [vendorName, setVendorName] = useState("");
  const [vendorType, setVendorType] = useState("External");

  // Alerts
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setUsers(getUsers());
    setVendors(getVendors());
    setProjects(getProjects());
  }, []);

  const handleProjectToggle = (projId) => {
    if (mappedProjects.includes(projId)) {
      setMappedProjects(mappedProjects.filter(p => p !== projId));
    } else {
      setMappedProjects([...mappedProjects, projId]);
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!username.trim()) {
      setAlert({ type: "danger", msg: "Please enter a valid username." });
      return;
    }

    if (mappedProjects.length === 0 && userRole !== "PMCC" && userRole !== "HO Incharge" && userRole !== "Admin") {
      setAlert({ type: "danger", msg: "Please map at least one project for this site role." });
      return;
    }

    const newUser = {
      id: username.toLowerCase().replace(/\s+/g, "_") + "_" + Math.floor(10 + Math.random() * 90),
      name: username,
      role: userRole,
      projects: userRole === "PMCC" || userRole === "HO Incharge" || userRole === "Admin" ? projects.map(p => p.id) : mappedProjects
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveData("users", updatedUsers);

    // Reset Form
    setUsername("");
    setMappedProjects([]);
    setAlert({ type: "success", msg: `User Account ${newUser.name} created successfully.` });
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!vendorName.trim()) {
      setAlert({ type: "danger", msg: "Please enter a valid vendor name." });
      return;
    }

    const newVendor = {
      id: `VND-${Math.floor(100 + Math.random() * 900)}`,
      name: vendorName,
      type: vendorType
    };

    const updatedVendors = [...vendors, newVendor];
    setVendors(updatedVendors);
    saveData("vendors", updatedVendors);

    // Reset Form
    setVendorName("");
    setAlert({ type: "success", msg: `Vendor ${newVendor.name} registered in SAP catalog.` });
  };

  // Mocked active sessions logs
  const sessionLogs = [
    { id: "SESS-01", name: "Amit Sharma", role: "Site Engr", ip: "192.168.1.104", device: "Safari / macOS", status: "Active Now" },
    { id: "SESS-02", name: "Vikram Malhotra", role: "Planning Engr", ip: "192.168.1.189", device: "Chrome / Windows", status: "Active Now" },
    { id: "SESS-03", name: "K. Chandrasekhar", role: "PMCC", ip: "10.0.4.15", device: "Antigravity App / iOS", status: "Idle 12m" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Vendor & User Control Panel</h1>
          <p>Govern user authorization levels, WBS node rights, and contractor entities</p>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => { setActiveTab("users"); setAlert(null); }}
        >
          User Accounts
        </button>
        <button 
          className={`tab-btn ${activeTab === "vendors" ? "active" : ""}`}
          onClick={() => { setActiveTab("vendors"); setAlert(null); }}
        >
          Vendor Registry
        </button>
        <button 
          className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
          onClick={() => { setActiveTab("sessions"); setAlert(null); }}
        >
          Active Sessions
        </button>
      </div>

      {alert && (
        <div className={`validation-indicator ${alert.type === "success" ? "success" : "danger"}`} style={{ marginBottom: "16px" }}>
          {alert.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <div>{alert.msg}</div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="responsive-grid-split">
          
          {/* User registration form */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h2 className="chart-title" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <UserPlus size={14} style={{ color: "var(--primary)" }} /> Provision Account
            </h2>

            <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>User Account Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vikram Malhotra"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Role Designation</label>
                <select 
                  className="form-control"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="Site Engr">Site Engineer (DPR Submissions)</option>
                  <option value="Planning Engr">Planning Engineer (Level 1 approvals)</option>
                  <option value="PM">Project Manager (Level 2 approvals)</option>
                  <option value="HO Incharge">HO Incharge (Level 3 approvals)</option>
                  <option value="PMCC">PMCC Executive (Final release & lock)</option>
                  <option value="Admin">Administrator (System connection & branding)</option>
                </select>
              </div>

              {userRole !== "PMCC" && userRole !== "HO Incharge" && userRole !== "Admin" && (
                <div className="form-group" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "4px" }}>
                  <label style={{ marginBottom: "6px" }}>Map WBS Site Permissions</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto", paddingRight: "4px" }}>
                    {projects.map(p => (
                      <label key={p.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                        <input 
                          type="checkbox"
                          checked={mappedProjects.includes(p.id)}
                          onChange={() => handleProjectToggle(p.id)}
                        />
                        <span>{p.code} - {p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: "8px", padding: "8px", fontWeight: "bold" }}>
                Provision User
              </button>
            </form>
          </div>

          {/* User Accounts list */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 className="chart-title">
              Registered Accounts ({users.length})
            </h2>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Account ID</th>
                    <th>User Name</th>
                    <th>Access Role</th>
                    <th>Mapped Sites</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px", color: "var(--text-muted)" }}>{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>
                        <span className="badge badge-review" style={{ fontSize: "9px", background: "var(--bg-tertiary)" }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                        {u.role === "PMCC" || u.role === "HO Incharge" || u.role === "Admin" ? "Company-wide (All)" : `${u.projects.length} Assigned`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === "vendors" && (
        <div className="responsive-grid-split">
          
          {/* Vendor creation */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h2 className="chart-title" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Globe size={14} style={{ color: "var(--primary)" }} /> Register Vendor Company
            </h2>

            <form onSubmit={handleAddVendor} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>Vendor Entity Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tata Steel, GKC Earthworks"
                  className="form-control"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Vendor Type Classification</label>
                <select 
                  className="form-control"
                  value={vendorType}
                  onChange={(e) => setVendorType(e.target.value)}
                >
                  <option value="External">External Contracting Partner</option>
                  <option value="Internal">GKC Internal Division (Direct)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "8px", padding: "8px", fontWeight: "bold" }}>
                Catalog Supplier Partner
              </button>
            </form>
          </div>

          {/* Vendor Catalog */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 className="chart-title">
              Vendor Master Catalog ({vendors.length})
            </h2>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vendor Code</th>
                    <th>Company Name</th>
                    <th>Registry Type</th>
                    <th>Quality Score</th>
                    <th>On-Time Score</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => {
                    // Generate compliance ratings based on vendor ID or name length
                    const quality = v.id === "VND-001" ? 97 : v.id === "VND-002" ? 98 : v.id === "VND-003" ? 94 : 95;
                    const ontime = v.id === "VND-001" ? 95 : v.id === "VND-002" ? 96 : v.id === "VND-003" ? 91 : 94;
                    return (
                      <tr key={v.id}>
                        <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px", color: "var(--text-muted)" }}>{v.id}</td>
                        <td style={{ fontWeight: 600 }}>{v.name}</td>
                        <td>
                          <span className={`badge ${v.type === "Internal" ? "badge-approved" : "badge-draft"}`} style={{ fontSize: "9px" }}>
                            {v.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: "bold", color: quality > 95 ? "var(--success)" : "var(--warning)" }}>{quality}%</td>
                        <td style={{ fontWeight: "bold", color: ontime > 95 ? "var(--success)" : "var(--warning)" }}>{ontime}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title">
            Security Active Sessions
          </h2>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>User Profile</th>
                  <th>Role</th>
                  <th>Client IP</th>
                  <th>User-Agent</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {sessionLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px", color: "var(--text-muted)" }}>{log.id}</td>
                    <td style={{ fontWeight: 600 }}>{log.name}</td>
                    <td>{log.role}</td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{log.ip}</td>
                    <td style={{ color: "var(--text-muted)" }}>{log.device}</td>
                    <td>
                      <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--success)", display: "flex", alignItems: "center", gap: "2px" }}>
                        <Check size={12} /> {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
