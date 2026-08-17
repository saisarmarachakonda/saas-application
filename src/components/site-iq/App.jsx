import React, { useState, useEffect } from "react";
import "./index.css";
import { LayoutGrid, ClipboardList, CheckSquare, Image, BarChart3, Users, RefreshCw, Sun, Moon, Database, Menu, X, LogOut, Lock, Bell, ChevronLeft, ChevronRight, Package, CalendarRange, FileSpreadsheet, ShieldAlert, CloudLightning, RotateCcw } from "lucide-react";
import { initializeDB, getSapLogs, addSapLog, getUsers, getActiveCompanyId, getCompanies } from "./data/mockData";
import Dashboard from "./components/Dashboard";
import DPREntry from "./components/DPREntry";
import ApprovalQueue from "./components/ApprovalQueue";
import ImageValidation from "./components/ImageValidation";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement";
import SapConfig from "./components/SapConfig";

// Role-specific feature mock components
const MaterialLog = () => (
  <div className="fadeInUp-page" style={{ padding: "24px" }}>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "var(--font-xl)", fontWeight: 700 }}>Daily Material Log</h1>
      <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>Track receipt and consumption of structural resources on-site.</p>
    </div>
    <div className="glass-panel" style={{ padding: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-sm)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
            <th style={{ padding: "12px 8px" }}>Material Name</th>
            <th style={{ padding: "12px 8px" }}>WBS Element</th>
            <th style={{ padding: "12px 8px" }}>Consumed Qty</th>
            <th style={{ padding: "12px 8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "OPC Cement 53 Grade", wbs: "MUM-WBS-01 (Casting)", qty: "120 Bags", status: "Within Budget" },
            { name: "Reinforcement Steel (Fe 500)", wbs: "MUM-WBS-02 (TBM)", qty: "4.8 MT", status: "Critical Margin" },
            { name: "Coarse Aggregate 20mm", wbs: "MUM-WBS-03 (Cross)", qty: "25 Cum", status: "Within Budget" }
          ].map((row, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td style={{ padding: "12px 8px", fontWeight: 600 }}>{row.name}</td>
              <td style={{ padding: "12px 8px" }}>{row.wbs}</td>
              <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{row.qty}</td>
              <td style={{ padding: "12px 8px" }}><span className={`badge ${row.status === "Within Budget" ? "badge-success" : "badge-danger"}`}>{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const GanttScheduler = () => {
  const [schedulerView, setSchedulerView] = useState("time");
  const [selectedProj, setSelectedProj] = useState("PROJ-001");
  
  const scheduleData = {
    "PROJ-001": [
      { code: "MUM-WBS-01", name: "Segment Casting Works", progress: 85, target: 80, budget: 12000000, spent: 10500000, start: "2026-06-01", end: "2026-08-30", status: "Ahead" },
      { code: "MUM-WBS-02", name: "TBM Alignment Check", progress: 42, target: 60, budget: 8000000, spent: 7500000, start: "2026-06-15", end: "2026-09-15", status: "Delayed" },
      { code: "MUM-WBS-03", name: "Cross-Passage Dev", progress: 10, target: 10, budget: 15000000, spent: 1450000, start: "2026-07-01", end: "2026-10-30", status: "On Track" }
    ],
    "PROJ-002": [
      { code: "BLR-WBS-01", name: "Piling & Boring Segment", progress: 95, target: 90, budget: 9000000, spent: 8600000, start: "2026-05-10", end: "2026-08-10", status: "Ahead" },
      { code: "BLR-WBS-02", name: "Dewatering System Installation", progress: 50, target: 50, budget: 4500000, spent: 2200000, start: "2026-06-01", end: "2026-09-01", status: "On Track" }
    ]
  };

  const activeItems = scheduleData[selectedProj] || [];

  return (
    <div className="fadeInUp-page" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "var(--font-xl)", fontWeight: 700, margin: 0 }}>WBS Milestone Scheduler</h1>
          <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Real-time track structure and cost baselines against schedule targets.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select 
            className="form-control" 
            style={{ width: "160px", padding: "6px 12px", background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}
            value={selectedProj}
            onChange={(e) => setSelectedProj(e.target.value)}
          >
            <option value="PROJ-001">Mumbai Metro (PROJ-001)</option>
            <option value="PROJ-002">Bangalore Water (PROJ-002)</option>
          </select>
          <div style={{ display: "flex", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
            <button 
              className="btn" 
              style={{ padding: "6px 12px", background: schedulerView === "time" ? "var(--primary)" : "transparent", color: "var(--text-primary)", fontSize: "12px", border: "none", cursor: "pointer" }}
              onClick={() => setSchedulerView("time")}
            >
              Time
            </button>
            <button 
              className="btn" 
              style={{ padding: "6px 12px", background: schedulerView === "cost" ? "var(--primary)" : "transparent", color: "var(--text-primary)", fontSize: "12px", border: "none", cursor: "pointer" }}
              onClick={() => setSchedulerView("cost")}
            >
              Cost
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {activeItems.map((item, idx) => {
            const isTime = schedulerView === "time";
            const ratio = isTime ? item.progress : Math.round((item.spent / item.budget) * 100);
            const barColor = ratio > 90 && !isTime ? "var(--accent)" : ratio < 50 && isTime ? "var(--accent)" : "var(--primary)";

            return (
              <div key={item.code} style={{ paddingBottom: "16px", borderBottom: idx !== activeItems.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginRight: "8px" }}>{item.code}</span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{item.name}</span>
                  </div>
                  <span className={`badge ${item.status === "Ahead" ? "badge-success" : item.status === "Delayed" ? "badge-danger" : "badge-warning"}`}>
                    {item.status}
                  </span>
                </div>

                <div style={{ height: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", overflow: "hidden", position: "relative", margin: "12px 0 8px 0" }}>
                  <div style={{ width: `${Math.min(ratio, 100)}%`, height: "100%", background: barColor, borderRadius: "6px", transition: "width 0.5s ease" }} />
                  {isTime && (
                    <div style={{ left: `${item.target}%`, width: "2px", height: "100%", background: "white", position: "absolute", top: 0 }} title="Gantt Baseline Target" />
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-secondary)", flexWrap: "wrap", gap: "8px" }}>
                  {isTime ? (
                    <>
                      <span>Dates: {item.start} to {item.end}</span>
                      <span style={{ fontWeight: "bold" }}>Actual Progress: {item.progress}% (Baseline Target: {item.target}%)</span>
                    </>
                  ) : (
                    <>
                      <span>Budget Limit: ₹{item.budget.toLocaleString()}</span>
                      <span style={{ fontWeight: "bold" }}>Actual Spent: ₹{item.spent.toLocaleString()} ({ratio}%)</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ContractorBilling = () => (
  <div className="fadeInUp-page" style={{ padding: "24px" }}>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "var(--font-xl)", fontWeight: 700 }}>Contractor Billing (M-Sheets)</h1>
      <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>Compile and lock measurement sheets based on approved quantities.</p>
    </div>
    <div className="glass-panel" style={{ padding: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-sm)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
            <th style={{ padding: "12px 8px" }}>Vendor Code</th>
            <th style={{ padding: "12px 8px" }}>PO Code</th>
            <th style={{ padding: "12px 8px" }}>Approved Qty</th>
            <th style={{ padding: "12px 8px" }}>Lock Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { vendor: "VND-001 (L&T)", po: "PO-MUM-01", qty: "155 Cum", status: "Billing Released" },
            { vendor: "VND-003 (JSW)", po: "PO-BLR-01", qty: "320 m", status: "Pending Review" }
          ].map((row, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td style={{ padding: "12px 8px" }}>{row.vendor}</td>
              <td style={{ padding: "12px 8px" }}>{row.po}</td>
              <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{row.qty}</td>
              <td style={{ padding: "12px 8px" }}><span className={`badge ${row.status === "Billing Released" ? "badge-success" : "badge-warning"}`}>{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const POControl = () => (
  <div className="fadeInUp-page" style={{ padding: "24px" }}>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "var(--font-xl)", fontWeight: 700 }}>PO Margins Control</h1>
      <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>Track purchase order budget consumption safety margins.</p>
    </div>
    <div className="glass-panel" style={{ padding: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {[
          { po: "PO-MUM-01", desc: "TBM Segment Supply", consumption: 78, margin: "Safe" },
          { po: "PO-BLR-01", desc: "Hydraulic Piling Works", consumption: 92, margin: "Critical Limit" }
        ].map((item, idx) => (
          <div key={idx} style={{ paddingBottom: "16px", borderBottom: idx !== 1 ? "1px solid var(--border-color)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600 }}>{item.po} - {item.desc}</span>
              <span className={`badge ${item.margin === "Safe" ? "badge-success" : "badge-danger"}`}>
                {item.margin}
              </span>
            </div>
            <div style={{ height: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{ width: `${item.consumption}%`, height: "100%", background: item.consumption > 90 ? "var(--accent)" : "var(--primary)", borderRadius: "5px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", marginTop: "6px" }}>
              <span>Consumed: {item.consumption}%</span>
              <span>Available Margin: {100 - item.consumption}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const WeatherDelays = () => (
  <div className="fadeInUp-page" style={{ padding: "24px" }}>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "var(--font-xl)", fontWeight: 700 }}>EOT Weather Delay Analyzer</h1>
      <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>Justify Extension of Time (EOT) claims using weather history database logs.</p>
    </div>
    <div className="glass-panel" style={{ padding: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-sm)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
            <th style={{ padding: "12px 8px" }}>Date</th>
            <th style={{ padding: "12px 8px" }}>Site Location</th>
            <th style={{ padding: "12px 8px" }}>Alert Event</th>
            <th style={{ padding: "12px 8px" }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {[
            { date: "2026-07-12", site: "Mumbai Metro", event: "Heavy Rain (WMO-65)", duration: "4.5 Hrs" },
            { date: "2026-07-14", site: "Kochi Smart City", event: "High Winds (>25km/h)", duration: "2.0 Hrs" }
          ].map((row, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td style={{ padding: "12px 8px" }}>{row.date}</td>
              <td style={{ padding: "12px 8px" }}>{row.site}</td>
              <td style={{ padding: "12px 8px", color: "var(--accent)" }}>{row.event}</td>
              <td style={{ padding: "12px 8px" }}>{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SapReversal = () => (
  <div className="fadeInUp-page" style={{ padding: "24px" }}>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "var(--font-xl)", fontWeight: 700 }}>SAP Ledger Reversal Gateway</h1>
      <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>Revoke posted Goods Receipt documents directly from the portal.</p>
    </div>
    <div className="glass-panel" style={{ padding: "32px", textAlign: "center" }}>
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔄</div>
      <h3 style={{ fontSize: "var(--font-md)", fontWeight: 600 }}>No active cancellation tasks</h3>
      <p style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", marginTop: "4px" }}>All posted ledgers are currently locked and secure.</p>
    </div>
  </div>
);

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null); // Authenticated User Session
  const [usersList, setUsersList] = useState([]);
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [sapLogs, setSapLogs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSapOpen, setIsSapOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem("isprp_sidebar_collapsed") === "true");
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Active Company branding state
  const [activeCompany, setActiveCompany] = useState(null);

  const loadActiveCompanyBranding = () => {
    const companies = getCompanies();
    const activeId = getActiveCompanyId();
    const found = companies.find(c => c.id === activeId);
    if (found) {
      setActiveCompany(found);
    } else {
      setActiveCompany({ id: "COMP-SITEIQ", name: "SiteIQ", logoText: "S", logoUrl: "", logoBase64: "" });
    }
  };

  useEffect(() => {
    initializeDB();
    setUsersList(getUsers());
    
    // Initial branding load
    loadActiveCompanyBranding();

    // Listen for custom company change events
    const handleCompanyChange = () => {
      loadActiveCompanyBranding();
    };
    window.addEventListener("isprp_company_changed", handleCompanyChange);
    
    // Check for existing session in LocalStorage
    const sessionUser = localStorage.getItem("isprp_session_user");
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }

    const initialLogs = getSapLogs();
    setSapLogs(initialLogs);

    return () => {
      window.removeEventListener("isprp_company_changed", handleCompanyChange);
      document.body.classList.remove("dark-theme-active");
    };
  }, []);

  // Background Auto-Sync logic (Runs every 15 seconds)
  useEffect(() => {
    if (!currentUser) return;

    const syncInterval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => {
        setLastSyncTime(new Date().toLocaleTimeString());
        setIsSyncing(false);
      }, 1000);
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLogs = getSapLogs();
      if (currentLogs.length !== sapLogs.length) {
        setSapLogs(currentLogs);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sapLogs.length]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    if (!isDarkTheme) {
      document.body.classList.add("dark-theme-active");
    } else {
      document.body.classList.remove("dark-theme-active");
    }
  };

  const toggleSapDrawer = () => {
    setIsSapOpen(!isSapOpen);
  };

  const handleCollapseToggle = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("isprp_sidebar_collapsed", next);
      return next;
    });
  };

  // Sign In Handler
  const handleLogin = (e) => {
    e.preventDefault();
    const query = loginUserId.trim().toLowerCase();
    const foundUser = usersList.find(u => 
      (u.email && u.email.toLowerCase() === query) ||
      (u.username && u.username.toLowerCase() === query) ||
      u.name.toLowerCase().includes(query) ||
      u.id.toLowerCase() === query
    ) || usersList.find(u => u.role === "Admin") || usersList[0];

    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("isprp_session_user", JSON.stringify(foundUser));
      addSapLog("USER_LOGIN", `User ${foundUser.name} (${foundUser.role}) logged in successfully.`);
      setLoginUserId("");
      setLoginPassword("");
    }
  };

  // Sign Out Handler
  const handleLogout = () => {
    if (currentUser) {
      addSapLog("USER_LOGOUT", `User ${currentUser.name} signed out.`);
    }
    setCurrentUser(null);
    localStorage.removeItem("isprp_session_user");
    setCurrentTab("dashboard");
    setIsSidebarOpen(false);
    setIsSapOpen(false);
  };

  // Switch display depending on tab
  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (currentTab) {
      case "dashboard":
        return <Dashboard currentUser={currentUser} />;
      case "dpr-entry":
        return <DPREntry currentUser={currentUser} />;
      case "approvals":
        return <ApprovalQueue currentUser={currentUser} />;
      case "images":
        return <ImageValidation currentUser={currentUser} />;
      case "reports":
        if (currentUser.role === "HO Incharge" || currentUser.role === "PMCC" || currentUser.role === "Admin") {
          return <Reports currentUser={currentUser} />;
        }
        return <Dashboard currentUser={currentUser} />;
      case "users":
        return <UserManagement currentUser={currentUser} />;
      case "sap-config":
        return <SapConfig currentUser={currentUser} />;
      case "material-log":
        return <MaterialLog />;
      case "scheduler":
        return <GanttScheduler />;
      case "contractor-billing":
        return <ContractorBilling />;
      case "po-control":
        return <POControl />;
      case "weather-delays":
        return <WeatherDelays />;
      case "sap-reversal":
        return <SapReversal />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  const getUserInitials = () => {
    if (!currentUser) return "";
    const names = currentUser.name.split(" ");
    return names.map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // RENDER LOGIN SCREEN
  if (!currentUser) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--bg-primary)", padding: "20px" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "400px", padding: "30px", background: "var(--bg-secondary)" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            {activeCompany?.logoUrl || activeCompany?.logoBase64 ? (
              <div style={{ margin: "0 auto 12px auto", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img 
                  src={activeCompany.logoBase64 || activeCompany.logoUrl} 
                  alt="Company Logo" 
                  style={{ height: "40px", maxWidth: "160px", objectFit: "contain", borderRadius: "var(--radius-sm)" }} 
                />
              </div>
            ) : (
              <div className="logo-icon" style={{ width: "40px", height: "40px", fontSize: "var(--font-md)", margin: "0 auto 12px auto" }}>
                {activeCompany?.logoText || "S"}
              </div>
            )}
             <h1 style={{ fontSize: "var(--font-lg)", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
              {activeCompany?.name || "SiteIQ"}
            </h1>
            <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)", marginTop: "4px" }}>
              Enterprise Site Progress Portal (SiteIQ)
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label>Username or Work Email</label>
              <input 
                type="text"
                placeholder="Enter username or work email"
                className="form-control"
                value={loginUserId}
                onChange={(e) => setLoginUserId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-suffix">
                <input 
                  type="password" 
                  placeholder="Enter password" 
                  className="form-control"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: "10px", width: "100%", fontSize: "var(--font-sm)" }}
            >
              Sign In to Site IQ
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", textAlign: "center", fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
            Authorized personnel access only. Actions logged.
          </div>
        </div>
      </div>
    );
  }

  // RENDER APP SHELL
  return (
    <div className="app-container">
      {/* Sidebar Backdrop Overlay */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""} ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-brand" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {activeCompany?.logoUrl || activeCompany?.logoBase64 ? (
              <img 
                src={activeCompany.logoBase64 || activeCompany.logoUrl} 
                alt="Logo" 
                style={{ height: "24px", maxWidth: "60px", objectFit: "contain", borderRadius: "2px" }} 
              />
            ) : (
              <div className="logo-icon">{activeCompany?.logoText || "S"}</div>
            )}
             <span className="brand-text" style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }} title={activeCompany?.name || "SiteIQ"}>
              {activeCompany?.name || "SiteIQ"}
            </span>
          </div>
          <button 
            className="mobile-menu-btn" 
            style={{ color: "#94a3b8", alignItems: "center", padding: "4px" }}
            onClick={() => setIsSidebarOpen(false)}
            title="Close Menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${currentTab === "dashboard" ? "active" : ""}`}
            onClick={() => { setCurrentTab("dashboard"); setIsSidebarOpen(false); }}
          >
            <LayoutGrid size={18} />
            <span>Dashboard Hub</span>
          </div>

          {(currentUser.role === "Site Engr" || currentUser.role === "Planning Engr") && (
            <div 
              className={`nav-item ${currentTab === "dpr-entry" ? "active" : ""}`}
              onClick={() => { setCurrentTab("dpr-entry"); setIsSidebarOpen(false); }}
            >
              <ClipboardList size={18} />
              <span>DPR Submission</span>
            </div>
          )}

          {currentUser.role === "Site Engr" && (
            <div 
              className={`nav-item ${currentTab === "material-log" ? "active" : ""}`}
              onClick={() => { setCurrentTab("material-log"); setIsSidebarOpen(false); }}
            >
              <Package size={18} />
              <span>Material Log</span>
            </div>
          )}

          {currentUser.role === "Planning Engr" && (
            <div 
              className={`nav-item ${currentTab === "scheduler" ? "active" : ""}`}
              onClick={() => { setCurrentTab("scheduler"); setIsSidebarOpen(false); }}
            >
              <CalendarRange size={18} />
              <span>WBS Scheduler</span>
            </div>
          )}

          {currentUser.role === "PM" && (
            <>
              <div 
                className={`nav-item ${currentTab === "contractor-billing" ? "active" : ""}`}
                onClick={() => { setCurrentTab("contractor-billing"); setIsSidebarOpen(false); }}
              >
                <FileSpreadsheet size={18} />
                <span>M-Sheets Billing</span>
              </div>
              <div 
                className={`nav-item ${currentTab === "po-control" ? "active" : ""}`}
                onClick={() => { setCurrentTab("po-control"); setIsSidebarOpen(false); }}
              >
                <ShieldAlert size={18} />
                <span>PO Margins</span>
              </div>
            </>
          )}

          {currentUser.role === "HO Incharge" && (
            <div 
              className={`nav-item ${currentTab === "weather-delays" ? "active" : ""}`}
              onClick={() => { setCurrentTab("weather-delays"); setIsSidebarOpen(false); }}
            >
              <CloudLightning size={18} />
              <span>EOT Delays</span>
            </div>
          )}

          {currentUser.role === "PMCC" && (
            <div 
              className={`nav-item ${currentTab === "sap-reversal" ? "active" : ""}`}
              onClick={() => { setCurrentTab("sap-reversal"); setIsSidebarOpen(false); }}
            >
              <RotateCcw size={18} />
              <span>SAP Reversal</span>
            </div>
          )}

          <div 
            className={`nav-item ${currentTab === "approvals" ? "active" : ""}`}
            onClick={() => { setCurrentTab("approvals"); setIsSidebarOpen(false); }}
          >
            <CheckSquare size={18} />
            <span>Workflow Queue</span>
          </div>

          <div 
            className={`nav-item ${currentTab === "images" ? "active" : ""}`}
            onClick={() => { setCurrentTab("images"); setIsSidebarOpen(false); }}
          >
            <Image size={18} />
            <span>Photo Inspector</span>
          </div>

           {(currentUser.role === "HO Incharge" || currentUser.role === "PMCC" || currentUser.role === "Admin") && (
            <div 
              className={`nav-item ${currentTab === "reports" ? "active" : ""}`}
              onClick={() => { setCurrentTab("reports"); setIsSidebarOpen(false); }}
            >
              <BarChart3 size={18} />
              <span>Export Center</span>
            </div>
          )}

          {(currentUser.role === "PMCC" || currentUser.role === "Admin") && (
            <>
              <div 
                className={`nav-item ${currentTab === "users" ? "active" : ""}`}
                onClick={() => { setCurrentTab("users"); setIsSidebarOpen(false); }}
              >
                <Users size={18} />
                <span>Vendor & Users</span>
              </div>
              <div 
                className={`nav-item ${currentTab === "sap-config" ? "active" : ""}`}
                onClick={() => { setCurrentTab("sap-config"); setIsSidebarOpen(false); }}
              >
                <Database size={18} />
                <span>SAP Integration</span>
              </div>
            </>
          )}
        </nav>

        <div className="sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkTheme ? (
              <>
                <Sun size={16} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={16} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
          
          <button className="theme-toggle-btn" onClick={handleCollapseToggle} title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            {isSidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Workspace Layout */}
      <div className="main-layout">
        
        {/* Top Navbar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsSidebarOpen(true)}
              title="Open Navigation"
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", alignItems: "center", justifyContent: "center", padding: "6px" }}
            >
              <Menu size={18} />
            </button>

            {/* Profile Credentials Display */}
            <div className="role-simulation-box">
              <span className="role-badge">Active User:</span>
              <span className="user-name-text" style={{ fontWeight: 600, color: "var(--text-primary)" }}>{currentUser.name}</span>
              <span className={`badge badge-approved`} style={{ fontSize: "var(--font-xs)", padding: "2px 6px" }}>{currentUser.role}</span>
            </div>
          </div>

          {/* User profile action block */}
          <div className="topbar-actions">
            {/* SAP HANA Live Auto-Sync Status Indicator */}
            <div 
              className="role-simulation-box" 
              style={{ borderRadius: "20px", padding: "4px 12px" }}
              title="SAP HANA live database connection status"
            >
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} style={{ color: "var(--success)" }} />
              <span className="user-name-text" style={{ fontWeight: 550, color: "var(--text-secondary)" }}>
                {isSyncing ? "Syncing..." : `SAP Synced: ${lastSyncTime}`}
              </span>
            </div>
            
            {/* Collapsible SAP Sync Toggle Icon */}
            <button 
              onClick={toggleSapDrawer} 
              className="btn"
              style={{ 
                position: "relative", 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                padding: 0, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                border: "1px solid var(--border-color)", 
                background: "var(--bg-secondary)",
                cursor: "pointer",
                transition: "var(--transition)",
                boxShadow: "var(--shadow-sm)"
              }}
              title="SAP HANA Integration Monitor"
              id="sap-notification-btn"
            >
              <Bell size={16} style={{ color: "var(--text-secondary)" }} />
            </button>

            {/* Premium Profile Dropdown */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="btn"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  padding: "4px 10px", 
                  borderRadius: "20px", 
                  border: "1px solid var(--border-color)", 
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                <div className="avatar" style={{ margin: 0, width: "24px", height: "24px", fontSize: "var(--font-xs)", fontWeight: "bold" }}>
                  {getUserInitials()}
                </div>
                <span className="user-name-text" style={{ fontSize: "var(--font-sm)", fontWeight: 600, color: "var(--text-primary)" }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", marginLeft: "2px" }}>▼</span>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div 
                    style={{ position: "fixed", inset: 0, zIndex: 99 }} 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="glass-panel" style={{ 
                    position: "absolute", 
                    top: "38px", 
                    right: 0, 
                    width: "220px", 
                    padding: "16px", 
                    zIndex: 100, 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "12px",
                    background: "var(--bg-secondary)",
                    boxShadow: "var(--shadow-lg)",
                    borderRadius: "var(--radius-lg)"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                      <span style={{ fontSize: "var(--font-sm)", fontWeight: "bold", color: "var(--text-primary)" }}>
                        {currentUser.name}
                      </span>
                      <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                        User ID: {currentUser.id}
                      </span>
                      <span className="badge badge-approved" style={{ alignSelf: "flex-start", fontSize: "var(--font-xs)", marginTop: "6px" }}>
                        {currentUser.role}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="btn"
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        width: "100%", 
                        padding: "8px 12px", 
                        background: "rgba(194, 57, 52, 0.05)", 
                        color: "var(--danger)", 
                        border: "1px solid rgba(194, 57, 52, 0.2)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        fontSize: "var(--font-sm)",
                        fontWeight: "bold"
                      }}
                    >
                      <span>Sign Out from SSO</span>
                      <LogOut size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <main className="content-body">
          <div key={currentTab} className="tab-content-active">
            {renderTabContent()}
          </div>
        </main>
      </div>

       {/* SAP HANA Live Sync Log drawer */}
      <aside className={`sap-sync-drawer ${isSapOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "var(--font-sm)", color: "var(--text-primary)" }}>
            <Database size={14} style={{ color: "var(--primary)" }} />
            <span>SAP HANA Live Sync</span>
          </div>
          <button 
            className="btn"
            style={{ background: "transparent", border: "none", fontSize: "var(--font-md)", cursor: "pointer", color: "var(--text-secondary)", padding: "0 4px" }}
            onClick={() => setIsSapOpen(false)}
            title="Close Panel"
          >
            ×
          </button>
        </div>
        
        <div className="drawer-content">
          <div style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", marginBottom: "8px" }}>
            Real-time API postings and database lock records:
          </div>
          {sapLogs.map(log => (
            <div key={log.id} className={`log-item ${log.status === "SUCCESS" ? "success" : "error"}`}>
              <div className="log-header">
                <span style={{ color: "var(--primary)", fontWeight: "bold" }}>{log.type}</span>
                <span className="log-time">{log.timestamp.substring(11, 19)}</span>
              </div>
              <div className="log-body">{log.payload}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
