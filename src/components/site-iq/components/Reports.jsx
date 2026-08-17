import React, { useState, useEffect } from "react";
import { Download, Search, FileText, CheckCircle2, Compass } from "lucide-react";
import { getDPRs, getPOs, getProjects, getSapLogs, getUsers, getVendors } from "../data/mockData";

export default function Reports({ currentUser }) {
  const [reportsList] = useState([
    { id: "REP-01", name: "Site-wise Consolidated DPR" },
    { id: "REP-02", name: "Engineer-level Progress Report" },
    { id: "REP-03", name: "Approval Tracking Report" },
    { id: "REP-04", name: "Monthly Progress Summary" },
    { id: "REP-05", name: "WBS Quantity Tracking" },
    { id: "REP-06", name: "Day-wise Cost Monitor (SAP)" },
    { id: "REP-07", name: "Month-End Actual Cost Report" },
    { id: "REP-08", name: "Spend Variance Report" },
    { id: "REP-09", name: "BOM Reference Report" },
    { id: "REP-10", name: "Audit Trail Report" }
  ]);

  const [selectedReportId, setSelectedReportId] = useState("REP-01");
  const [selectedProjectId, setSelectedProjectId] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [recentlyVisited, setRecentlyVisited] = useState(() => {
    return JSON.parse(localStorage.getItem("isprp_recently_visited") || "[]");
  });

  const handleProjectSelect = (projId) => {
    setSelectedProjectId(projId);
    if (projId !== "ALL") {
      setRecentlyVisited((prev) => {
        const filtered = prev.filter(id => id !== projId);
        const updated = [projId, ...filtered].slice(0, 5);
        localStorage.setItem("isprp_recently_visited", JSON.stringify(updated));
        return updated;
      });
    }
  };
  
  // Data sets
  const [projects, setProjects] = useState([]);
  const [dprs, setDPRs] = useState([]);
  const [pos, setPOs] = useState([]);
  const [sapLogs, setSapLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const rawProjects = getProjects();
    const rawDprs = getDPRs();
    const rawPOs = getPOs();

    // Filter projects based on user permissions
    const filteredProjects = currentUser.role === "PMCC" || currentUser.role === "HO Incharge" || currentUser.role === "Admin"
      ? rawProjects
      : rawProjects.filter(p => currentUser.projects.includes(p.id));

    const projectIds = filteredProjects.map(p => p.id);
    const filteredDprs = rawDprs.filter(d => projectIds.includes(d.projectId));
    const filteredPOs = rawPOs.filter(po => projectIds.includes(po.projectId));

    setProjects(filteredProjects);
    setDPRs(filteredDprs);
    setPOs(filteredPOs);
    setSapLogs(getSapLogs());
    setUsers(getUsers());
    setVendors(getVendors());
  }, [currentUser]);

  // Filter project-wise helper
  const filterByProject = (itemProjId) => {
    if (selectedProjectId === "ALL") return true;
    return itemProjId === selectedProjectId;
  };

  // Filter search matches
  const matchSearch = (text) => {
    if (!text) return false;
    return text.toString().toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Convert table rows to CSV and download
  const downloadCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `${selectedReportId}_Export.csv`;

    switch (selectedReportId) {
      case "REP-01":
        headers = ["DPR ID", "Project Code", "Reported Date", "PO Code", "Quantity", "Manpower", "Status", "SAP Sync"];
        rows = dprs
          .filter(d => filterByProject(d.projectId))
          .filter(d => !searchTerm || matchSearch(d.id) || matchSearch(d.poNumber) || matchSearch(d.status))
          .map(d => {
            const p = projects.find(proj => proj.id === d.projectId);
            return [d.id, p?.code || "", d.reportedDate, d.poNumber, d.quantityExecuted, d.manpower, d.status, d.sapSync?.synced ? "Yes" : "No"];
          });
        break;
      case "REP-02":
        headers = ["DPR ID", "Engineer Name", "Role Action", "Timestamp", "Work Qty", "Status"];
        rows = dprs
          .filter(d => filterByProject(d.projectId))
          .filter(d => !searchTerm || matchSearch(d.id) || matchSearch(d.workflow.siteEng?.user))
          .map(d => [d.id, d.workflow.siteEng?.user || "N/A", "Submit", d.workflow.siteEng?.timestamp || "N/A", d.quantityExecuted, d.status]);
        break;
      case "REP-03":
        headers = ["DPR ID", "Planning Engr Action", "PM Action", "HO Action", "PMCC Action", "Rejections"];
        rows = dprs
          .filter(d => filterByProject(d.projectId))
          .filter(d => !searchTerm || matchSearch(d.id))
          .map(d => [
            d.id,
            d.workflow.planningEng?.action || "Pending",
            d.workflow.pm?.action || "Pending",
            d.workflow.ho?.action || "Pending",
            d.workflow.pmcc?.action || "Pending",
            d.workflow.rejection ? `Rejected by ${d.workflow.rejection.user}` : "None"
          ]);
        break;
      case "REP-05":
        headers = ["PO Number", "Material Desc", "WBS node", "Contract Qty", "Cumulative Executed Qty", "Remaining Balance", "UOM"];
        rows = pos
          .filter(po => filterByProject(po.projectId))
          .filter(po => !searchTerm || matchSearch(po.poNumber) || matchSearch(po.materialDescription))
          .map(po => {
            const approvedDprs = dprs.filter(d => d.poNumber === po.poNumber && d.status !== "Rejected");
            const cumQty = approvedDprs.reduce((s, d) => s + d.quantityExecuted, 0);
            return [po.poNumber, po.materialDescription, po.wbsNodeId, po.totalQty, cumQty, po.totalQty - cumQty, po.uom];
          });
        break;
      case "REP-06":
        headers = ["PO Number", "Unit Rate", "Executing Qty", "Total Value (INR)", "Cumulative Locked Value"];
        rows = pos
          .filter(po => filterByProject(po.projectId))
          .filter(po => !searchTerm || matchSearch(po.poNumber))
          .map(po => {
            const approvedDprs = dprs.filter(d => d.poNumber === po.poNumber && d.status !== "Rejected");
            const cumQty = approvedDprs.reduce((s, d) => s + d.quantityExecuted, 0);
            return [po.poNumber, po.rate, po.totalQty, po.totalQty * po.rate, cumQty * po.rate];
          });
        break;
      default:
        headers = ["Export Code", "Export Status"];
        rows = [["DPR-EXPORT", "Completed"]];
        break;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lock status mapping for display
  const getLockStatus = (status) => {
    switch (status) {
      case "FULLY LOCKED":
        return { label: "Fully Locked", qty: "LOCKED", rate: "FROZEN", class: "badge-fullylocked" };
      case "HO Approved":
      case "Approved":
        return { label: "Qty + Rate Frozen", qty: "LOCKED", rate: "FROZEN", class: "badge-approved" };
      case "Under Review":
        return { label: "Quantity Locked", qty: "LOCKED", rate: "UNLOCKED", class: "badge-review" };
      default:
        return { label: "Unlocked", qty: "UNLOCKED", rate: "UNLOCKED", class: "badge-draft" };
    }
  };

  const activeReport = reportsList.find(r => r.id === selectedReportId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>SAP Reports & Export Center</h1>
          <p>Generate daily progress logs, financial variance sheets, WBS summaries, and download audit-ready CSV ledgers</p>
        </div>
      </div>

      <div className="responsive-grid-split">
        
        {/* Navigation reports catalog list */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="chart-title">
            Reports Catalog
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "500px", overflowY: "auto", paddingRight: "4px" }}>
            {reportsList.map(rep => {
              const isSelected = selectedReportId === rep.id;
              
              return (
                <button
                  key={rep.id}
                  onClick={() => { setSelectedReportId(rep.id); setSearchTerm(""); }}
                  className="tab-btn"
                  style={{ 
                    textAlign: "left", 
                    width: "100%", 
                    borderBottom: "none", 
                    borderRadius: "var(--radius-sm)", 
                    border: isSelected ? "1px solid var(--border-color)" : "1px solid transparent",
                    background: isSelected ? "var(--bg-secondary)" : "transparent",
                    color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                    padding: "10px 12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{rep.name}</span>
                    <span style={{ fontSize: "var(--font-xs)", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{rep.id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Report View Panel */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <div>
              <h2 style={{ fontSize: "var(--font-md)", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={16} style={{ color: "var(--primary)" }} /> {activeReport?.name}
              </h2>
              <p style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", marginTop: "2px" }}>Index reference: {activeReport?.id} | Synced with SAP HANA ledger</p>
            </div>
            
            <button 
              onClick={downloadCSV}
              className="btn btn-primary"
              style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>

          {/* Filtering toolbar */}
          <div className="reports-toolbar" style={{ display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", width: "100%" }}>
              
              <div className="form-group" style={{ flex: "1 1 200px", margin: 0 }}>
                <label style={{ fontSize: "var(--font-xs)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>Site Location Filter</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="scrollable-chips-container" style={{ display: "flex", gap: "6px", overflowX: "auto", maxWidth: "340px", padding: "2px 0", whiteSpace: "nowrap" }}>
                    <button 
                      type="button"
                      className={`btn chip-btn ${selectedProjectId === "ALL" ? "active" : ""}`}
                      onClick={() => handleProjectSelect("ALL")}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "15px",
                        background: selectedProjectId === "ALL" ? "var(--primary)" : "var(--bg-secondary)",
                        color: selectedProjectId === "ALL" ? "white" : "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "var(--transition)",
                        margin: 0
                      }}
                    >
                      All Sites
                    </button>
                    {projects.map(p => (
                      <button 
                        type="button"
                        key={p.id}
                        className={`btn chip-btn ${selectedProjectId === p.id ? "active" : ""}`}
                        onClick={() => handleProjectSelect(p.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "15px",
                          background: selectedProjectId === p.id ? "var(--primary)" : "var(--bg-secondary)",
                          color: selectedProjectId === p.id ? "white" : "var(--text-secondary)",
                          border: "1px solid var(--border-color)",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          margin: 0
                        }}
                      >
                        {p.code}
                      </button>
                    ))}
                  </div>

                  <select
                    className="form-control"
                    value={selectedProjectId}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                    style={{ padding: "5px 10px", fontSize: "var(--font-xs)", width: "120px" }}
                  >
                    <option value="ALL">All ({projects.length})</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ flex: "2 1 300px", margin: 0 }}>
                <label style={{ fontSize: "var(--font-xs)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>Keyword Search</label>
                <div className="input-suffix">
                  <input
                    type="text"
                    placeholder="Filter records..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "5px 10px", fontSize: "var(--font-sm)" }}
                  />
                </div>
              </div>

            </div>

            {/* Scrollable Recently Visited Row inside Reports */}
            {recentlyVisited.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                <span style={{ fontSize: "var(--font-xs)", fontWeight: "bold", color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                  <Compass size={11} style={{ color: "var(--primary)" }} /> Recents:
                </span>
                <div className="scrollable-chips-container" style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  {recentlyVisited.map(id => {
                    const proj = projects.find(p => p.id === id);
                    if (!proj) return null;
                    return (
                      <button
                        type="button"
                        key={id}
                        className={`btn chip-btn ${selectedProjectId === id ? "active" : ""}`}
                        onClick={() => handleProjectSelect(id)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: selectedProjectId === id ? "var(--primary)" : "var(--bg-tertiary)",
                          color: selectedProjectId === id ? "white" : "var(--text-secondary)",
                          border: "1px solid var(--border-color)",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          margin: 0
                        }}
                      >
                        {proj.code}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Table display */}
          <div className="data-table-container">
            <table className="data-table">
              
              {/* Site Consolidated DPR Tab */}
              {selectedReportId === "REP-01" && (
                <>
                  <thead>
                    <tr>
                      <th>DPR ID</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>PO Ref</th>
                      <th>Executed Qty</th>
                      <th>Workers</th>
                      <th>Status</th>
                      <th style={{ textAlign: "center" }}>SAP Sync</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dprs
                      .filter(d => filterByProject(d.projectId))
                      .filter(d => !searchTerm || matchSearch(d.id) || matchSearch(d.poNumber) || matchSearch(d.status))
                      .map(d => {
                        const p = projects.find(proj => proj.id === d.projectId);
                        const po = pos.find(poRef => poRef.poNumber === d.poNumber);
                        const locks = getLockStatus(d.status);
                        
                        return (
                          <tr key={d.id}>
                            <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px" }}>{d.id}</td>
                            <td style={{ fontWeight: 600 }}>{p?.code || "N/A"}</td>
                            <td>{d.reportedDate}</td>
                            <td style={{ color: "var(--text-secondary)" }}>{d.poNumber}</td>
                            <td style={{ fontWeight: "bold" }}>{d.quantityExecuted} {po?.uom}</td>
                            <td>{d.manpower}</td>
                            <td><span className={`badge ${locks.class}`}>{locks.label}</span></td>
                            <td style={{ textAlign: "center" }}>
                              {d.sapSync?.synced ? (
                                <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                                  <CheckCircle2 size={12} /> Synced
                                </span>
                              ) : (
                                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Pending</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </>
              )}

              {/* Engineer Audit logs */}
              {selectedReportId === "REP-02" && (
                <>
                  <thead>
                    <tr>
                      <th>DPR Reference</th>
                      <th>Reporting Engineer</th>
                      <th>Role Action</th>
                      <th>Timestamp</th>
                      <th>Work Quantity</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dprs
                      .filter(d => filterByProject(d.projectId))
                      .filter(d => !searchTerm || matchSearch(d.id) || matchSearch(d.workflow.siteEng?.user))
                      .map(d => (
                        <tr key={d.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px" }}>{d.id}</td>
                          <td style={{ fontWeight: 600 }}>{d.workflow.siteEng?.user || "System"}</td>
                          <td><span className="badge badge-review" style={{ fontSize: "9px" }}>SUBMIT</span></td>
                          <td style={{ color: "var(--text-secondary)" }}>{d.workflow.siteEng?.timestamp || "N/A"}</td>
                          <td style={{ fontWeight: "bold" }}>{d.quantityExecuted}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{d.remarks || "No comments"}</td>
                        </tr>
                      ))}
                  </tbody>
                </>
              )}

              {/* Approval Trackings */}
              {selectedReportId === "REP-03" && (
                <>
                  <thead>
                    <tr>
                      <th>DPR Reference</th>
                      <th style={{ textAlign: "center" }}>Planning Engr</th>
                      <th style={{ textAlign: "center" }}>Project Manager</th>
                      <th style={{ textAlign: "center" }}>HO Incharge</th>
                      <th style={{ textAlign: "center" }}>PMCC Signoff</th>
                      <th>Rejection Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dprs
                      .filter(d => filterByProject(d.projectId))
                      .filter(d => !searchTerm || matchSearch(d.id))
                      .map(d => (
                        <tr key={d.id}>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px" }}>{d.id}</td>
                          <td style={{ textAlign: "center" }}>
                            {d.workflow.planningEng ? (
                              <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--success)" }}>✓ {d.workflow.planningEng.user}</span>
                            ) : "Awaiting"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {d.workflow.pm ? (
                              <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--success)" }}>✓ {d.workflow.pm.user}</span>
                            ) : "Awaiting"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {d.workflow.ho ? (
                              <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--success)" }}>✓ {d.workflow.ho.user}</span>
                            ) : "Awaiting"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {d.workflow.pmcc ? (
                              <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--success)" }}>✓ {d.workflow.pmcc.user}</span>
                            ) : "Awaiting"}
                          </td>
                          <td>
                            {d.workflow.rejection ? (
                              <span style={{ fontSize: "10px", fontWeight: "bold", color: "var(--danger)" }}>
                                REJECTED ({d.workflow.rejection.user})
                              </span>
                            ) : (
                              <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </>
              )}

              {/* Monthly progress summary */}
              {selectedReportId === "REP-04" && (
                <>
                  <thead>
                    <tr>
                      <th>Work Month</th>
                      <th style={{ textAlign: "center" }}>Total Entries</th>
                      <th style={{ textAlign: "center" }}>Fully Approved</th>
                      <th style={{ textAlign: "center" }}>Flagged Out of Bounds</th>
                      <th style={{ textAlign: "right" }}>Progress Value (Lakhs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: "bold" }}>June {new Date().getFullYear()}</td>
                      <td style={{ textAlign: "center" }}>{dprs.filter(d => filterByProject(d.projectId)).length}</td>
                      <td style={{ textAlign: "center" }}>{dprs.filter(d => filterByProject(d.projectId) && d.status === "FULLY LOCKED").length}</td>
                      <td style={{ textAlign: "center" }}>{dprs.filter(d => filterByProject(d.projectId) && d.gps.isFlagged).length}</td>
                      <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--primary)" }}>
                        {((dprs.filter(d => filterByProject(d.projectId) && d.status !== "Rejected").reduce((sum, d) => {
                          const po = pos.find(p => p.poNumber === d.poNumber);
                          return sum + (d.quantityExecuted * (po ? po.rate : 0));
                        }, 0)) / 100000).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </>
              )}

              {/* WBS Quantity balances */}
              {selectedReportId === "REP-05" && (
                <>
                  <thead>
                    <tr>
                      <th>PO Reference</th>
                      <th>Material Description</th>
                      <th>WBS Element</th>
                      <th style={{ textAlign: "right" }}>Contract Qty</th>
                      <th style={{ textAlign: "right" }}>Cumulative Executed</th>
                      <th style={{ textAlign: "right" }}>Remaining Balance</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pos
                      .filter(po => filterByProject(po.projectId))
                      .filter(po => !searchTerm || matchSearch(po.poNumber) || matchSearch(po.materialDescription))
                      .map(po => {
                        const approvedDprs = dprs.filter(d => d.poNumber === po.poNumber && d.status !== "Rejected");
                        const cumQty = approvedDprs.reduce((s, d) => s + d.quantityExecuted, 0);
                        const balance = po.totalQty - cumQty;
                        
                        return (
                          <tr key={po.poNumber}>
                            <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px", color: "var(--text-muted)" }}>{po.poNumber}</td>
                            <td style={{ fontWeight: 600 }}>{po.materialDescription}</td>
                            <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{po.wbsNodeId}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold" }}>{po.totalQty}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--success)" }}>{cumQty}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--text-primary)" }}>{balance}</td>
                            <td style={{ color: "var(--text-muted)" }}>{po.uom}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </>
              )}

              {/* Day-wise Cost Monitor */}
              {selectedReportId === "REP-06" && (
                <>
                  <thead>
                    <tr>
                      <th>PO Reference</th>
                      <th style={{ textAlign: "right" }}>Unit Rate (INR)</th>
                      <th style={{ textAlign: "right" }}>Contract Volume</th>
                      <th style={{ textAlign: "right" }}>Contract Value (INR)</th>
                      <th style={{ textAlign: "right" }}>Cumulative Locked Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pos
                      .filter(po => filterByProject(po.projectId))
                      .filter(po => !searchTerm || matchSearch(po.poNumber))
                      .map(po => {
                        const approvedDprs = dprs.filter(d => d.poNumber === po.poNumber && d.status !== "Rejected");
                        const cumQty = approvedDprs.reduce((s, d) => s + d.quantityExecuted, 0);
                        
                        return (
                          <tr key={po.poNumber}>
                            <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "11px", color: "var(--text-muted)" }}>{po.poNumber}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold" }}>₹{po.rate}</td>
                            <td style={{ textAlign: "right" }}>{po.totalQty}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold" }}>₹{(po.totalQty * po.rate).toLocaleString()}</td>
                            <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--success)" }}>₹{(cumQty * po.rate).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </>
              )}

              {/* SAP HANA logs audit */}
              {selectedReportId === "REP-10" && (
                <>
                  <thead>
                    <tr>
                      <th>API Lock Reference</th>
                      <th>Sync Action</th>
                      <th>Timestamp</th>
                      <th>Payload Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sapLogs
                      .filter(log => !searchTerm || matchSearch(log.type) || matchSearch(log.payload))
                      .map(log => (
                        <tr key={log.id} style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                          <td style={{ fontWeight: "bold", color: "var(--text-muted)" }}>{log.id}</td>
                          <td style={{ fontWeight: "bold", color: "var(--primary)" }}>{log.type}</td>
                          <td style={{ color: "var(--text-muted)" }}>{log.timestamp}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{log.payload}</td>
                          <td>
                            <span className="badge badge-approved" style={{ fontSize: "9px", background: log.status === "SUCCESS" ? "var(--bg-tertiary)" : "var(--bg-secondary)" }}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
