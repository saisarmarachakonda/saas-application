import React, { useState, useEffect } from "react";
import { Check, X, ShieldAlert, Clock, AlertTriangle, FileText, Lock, Unlock, CheckCircle } from "lucide-react";
import { getDPRs, getPOs, getProjects, updateDPR, addSapLog } from "../data/mockData";

export default function ApprovalQueue({ currentUser }) {
  const [dprs, setDPRs] = useState([]);
  const [pos, setPOs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDPR, setSelectedDPR] = useState(null);
  
  // Rejection modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");

  const refreshData = () => {
    const rawDprs = getDPRs();
    const rawPOs = getPOs();
    const rawProjects = getProjects();

    // Filter projects based on user permissions
    const filteredProjects = currentUser.role === "PMCC" || currentUser.role === "HO Incharge" || currentUser.role === "Admin"
      ? rawProjects
      : rawProjects.filter(p => currentUser.projects.includes(p.id));

    const projectIds = filteredProjects.map(p => p.id);
    const filteredDprs = rawDprs.filter(d => projectIds.includes(d.projectId));
    const filteredPOs = rawPOs.filter(po => projectIds.includes(po.projectId));

    setDPRs(filteredDprs);
    setPOs(filteredPOs);
    setProjects(filteredProjects);
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Filter DPRs pending action for the CURRENT simulated role
  const getPendingDprs = () => {
    switch (currentUser.role) {
      case "Planning Engr":
        return dprs.filter(d => d.status === "Submitted");
      case "PM":
        return dprs.filter(d => d.status === "Under Review");
      case "HO Incharge":
        return dprs.filter(d => d.status === "Approved" || d.status === "PM Approved");
      case "PMCC":
      case "Admin":
        return dprs.filter(d => d.status === "HO Approved");
      default: // Site Engineer has no approvals, can see draft/rejected for correction
        return dprs.filter(d => d.status === "Draft" || d.status === "Rejected");
    }
  };

  const pendingList = getPendingDprs();

  // Perform Approval Step
  const handleApprove = (dpr) => {
    let nextStatus = "";
    let actionDesc = "";
    let typeCode = "";

    const userName = currentUser.name;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updatedWorkflow = { ...dpr.workflow };

    if (currentUser.role === "Planning Engr") {
      nextStatus = "Under Review"; // Escalates to PM
      actionDesc = "Planning Engineer random validation passed & accepted";
      updatedWorkflow.planningEng = { user: userName, action: "Accept", timestamp };
      typeCode = "PLANNING_ACCEPT";
    } 
    else if (currentUser.role === "PM") {
      nextStatus = "Approved"; // Escalates to HO Incharge
      actionDesc = "Project Manager review complete. PO limits verified. Rate Frozen.";
      updatedWorkflow.pm = { user: userName, action: "Approve", timestamp, comment: "Verified rates vs SAP table" };
      typeCode = "PM_APPROVE";
    } 
    else if (currentUser.role === "HO Incharge") {
      nextStatus = "HO Approved"; // Escalates to PMCC
      actionDesc = "HO Incharge review complete. Approved for final billing release.";
      updatedWorkflow.ho = { user: userName, action: "Approve", timestamp };
      typeCode = "HO_APPROVE";
    } 
    else if (currentUser.role === "PMCC" || currentUser.role === "Admin") {
      nextStatus = "FULLY LOCKED"; // Complete
      actionDesc = "Final PMCC/Admin sign-off. DPR fully locked. Financial postings sent to SAP.";
      updatedWorkflow.pmcc = { user: userName, action: "Final Approve", timestamp };
      typeCode = "PMCC_FINAL_APPROVE";
    }

    const newHistory = [
      ...dpr.historyLog,
      { step: currentUser.role, desc: `${actionDesc} (${userName})`, timestamp }
    ];

    const updatedDprObj = {
      ...dpr,
      status: nextStatus,
      workflow: updatedWorkflow,
      historyLog: newHistory
    };

    // If PMCC or Admin approved, trigger mock SAP HANA Sync document creation
    if (currentUser.role === "PMCC" || currentUser.role === "Admin") {
      const mockGR = `500${Math.floor(1000000 + Math.random() * 9000000)}`;
      updatedDprObj.sapSync = {
        synced: true,
        grDocument: mockGR,
        syncTimestamp: timestamp
      };
      addSapLog("GR_POSTING", `DPR ${dpr.id} milestone approved. Created SAP GR Document: ${mockGR}`);
    } else if (currentUser.role === "PM") {
      addSapLog("QTY_LOCK_STATUS", `DPR ${dpr.id} approved by PM. Quantities locked. Rates frozen in SAP table.`);
    }

    updateDPR(updatedDprObj);
    setSelectedDPR(null);
    refreshData();
  };

  // Perform Rejection Step
  const triggerRejection = (dpr) => {
    setSelectedDPR(dpr);
    setRejectionModalOpen(true);
  };

  const submitRejection = () => {
    if (!rejectionComment.trim()) return;

    const userName = currentUser.name;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updatedWorkflow = { ...selectedDPR.workflow };
    updatedWorkflow.rejection = { user: userName, comment: rejectionComment, timestamp };

    const newHistory = [
      ...selectedDPR.historyLog,
      { step: "Rejection", desc: `DPR rejected by ${currentUser.role}. Reason: ${rejectionComment} (${userName})`, timestamp }
    ];

    const updatedDprObj = {
      ...selectedDPR,
      status: "Rejected", // returns to Site Engr
      workflow: updatedWorkflow,
      historyLog: newHistory
    };

    updateDPR(updatedDprObj);
    addSapLog("DPR_REJECTED", `DPR ${selectedDPR.id} rejected by ${currentUser.role}. Comment: ${rejectionComment}`, "ERROR");

    setRejectionModalOpen(false);
    setRejectionComment("");
    setSelectedDPR(null);
    refreshData();
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Milestone Workflow Queue</h1>
          <p>Validate physical measures, audit EXIF parameters, and release budget lines to SAP</p>
        </div>
      </div>

      <div className="responsive-grid-equal">
        
        {/* Pending Items List */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="chart-title">
            Pending Action ({pendingList.length})
          </h2>

          {pendingList.length === 0 ? (
            <div style={{ padding: "48px 16px", textAlign: "center", color: "var(--text-muted)" }}>
              <Clock size={40} style={{ margin: "0 auto 12px auto", opacity: 0.5 }} />
              <p style={{ fontSize: "var(--font-sm)" }}>No DPRs awaiting approval for your role: <strong>{currentUser.role}</strong></p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "550px", overflowY: "auto", paddingRight: "4px" }}>
              {pendingList.map(d => {
                const proj = projects.find(p => p.id === d.projectId);
                const po = pos.find(p => p.poNumber === d.poNumber);
                const locks = getLockStatus(d.status);
                const isSelected = selectedDPR?.id === d.id;

                return (
                  <div 
                    key={d.id} 
                    className="glass-panel"
                    style={{ 
                      padding: "16px", 
                      cursor: "pointer", 
                      borderLeft: isSelected 
                        ? "3px solid var(--primary)" 
                        : d.gps.isFlagged 
                          ? "3px solid var(--status-rejected)" 
                          : "3px solid var(--border-color)",
                      background: isSelected ? "var(--bg-tertiary)" : "var(--bg-secondary)"
                    }}
                    onClick={() => setSelectedDPR(d)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "var(--font-sm)" }}>{d.id}</span>
                      <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>{d.subDate}</span>
                    </div>

                    <div style={{ fontSize: "var(--font-xs)", display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Project:</span>
                        <span style={{ fontWeight: 600 }}>{proj?.code}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Executed Qty:</span>
                        <span style={{ fontWeight: 600 }}>{d.quantityExecuted} {po?.uom}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", borderTop: "1px solid var(--border-color)", marginTop: "4px" }}>
                        <span className={`badge ${locks.class}`}>{locks.label}</span>
                        {d.gps.isFlagged && (
                          <span style={{ fontSize: "var(--font-xs)", color: "var(--status-rejected)", fontWeight: "bold" }}>
                            ⚠️ GPS WARN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Inspector Panel */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 className="chart-title">
            DPR Compliance Checksheet
          </h2>

          {selectedDPR ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "var(--font-md)", fontWeight: "bold" }}>Record ID: {selectedDPR.id}</div>
                  <div style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", marginTop: "2px" }}>Submitted: {selectedDPR.subDate} | Target Work Date: {selectedDPR.reportedDate}</div>
                </div>
                <span className={`badge ${getLockStatus(selectedDPR.status).class}`}>{getLockStatus(selectedDPR.status).label}</span>
              </div>

              {/* Graphical Workflow Status Timeline */}
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative", padding: "16px 0 20px 0", borderBottom: "1px solid var(--border-color)", borderTop: "1px solid var(--border-color)", margin: "12px 0" }}>
                {[
                  { label: "Submitted", statusKey: "Submitted" },
                  { label: "Check", statusKey: "Under Review" },
                  { label: "PM Review", statusKey: "Approved" },
                  { label: "HQ Sign", statusKey: "HO Approved" },
                  { label: "SAP Post", statusKey: "FULLY LOCKED" }
                ].map((step, idx, arr) => {
                  const statusSequence = ["Draft", "Submitted", "Under Review", "Approved", "HO Approved", "FULLY LOCKED"];
                  const currentIdx = statusSequence.indexOf(selectedDPR.status);
                  const stepIdx = statusSequence.indexOf(step.statusKey);
                  const isCompleted = currentIdx >= stepIdx && selectedDPR.status !== "Rejected";
                  const isActive = selectedDPR.status === step.statusKey;
                  const dotColor = isCompleted ? "var(--success)" : "rgba(255,255,255,0.15)";
                  const textColor = isCompleted ? "var(--text-primary)" : "var(--text-muted)";

                  return (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 5 }}>
                      {idx < arr.length - 1 && (
                        <div style={{
                          position: "absolute",
                          top: "7px",
                          left: "50%",
                          width: "100%",
                          height: "2px",
                          background: currentIdx > stepIdx ? "var(--success)" : "rgba(255,255,255,0.08)",
                          zIndex: 1
                        }} />
                      )}
                      <div style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: dotColor,
                        border: isActive ? "2px solid white" : "none",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "white"
                      }}>
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <span style={{ fontSize: "9px", marginTop: "4px", color: textColor, fontWeight: isActive ? "bold" : "normal", textAlign: "center" }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Locks Alert */}
              <div className="lock-indicators-box" style={{ margin: "12px 0" }}>
                <div className={`lock-pill ${getLockStatus(selectedDPR.status).qty === "LOCKED" ? "locked" : "unlocked"}`}>
                  {getLockStatus(selectedDPR.status).qty === "LOCKED" ? <Lock size={12} /> : <Unlock size={12} />}
                  Quantity Lock: {getLockStatus(selectedDPR.status).qty}
                </div>
                <div className={`lock-pill ${getLockStatus(selectedDPR.status).rate === "FROZEN" ? "locked" : "unlocked"}`}>
                  {getLockStatus(selectedDPR.status).rate === "FROZEN" ? <Lock size={12} /> : <Unlock size={12} />}
                  Rate Freeze: {getLockStatus(selectedDPR.status).rate}
                </div>
              </div>

              <div className="responsive-grid-half" style={{ gap: "12px" }}>
                <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", fontSize: "var(--font-sm)" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Material Info</div>
                  <div style={{ fontWeight: "bold", marginTop: "4px" }}>{pos.find(p => p.poNumber === selectedDPR.poNumber)?.materialDescription}</div>
                  <div style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", marginTop: "2px" }}>PO Ref: {selectedDPR.poNumber}</div>
                </div>

                <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", fontSize: "var(--font-sm)" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Validation Metrics</div>
                  <div style={{ fontWeight: "bold", marginTop: "4px" }}>Quantity: {selectedDPR.quantityExecuted} {pos.find(p => p.poNumber === selectedDPR.poNumber)?.uom}</div>
                  <div style={{ fontSize: "var(--font-xs)", fontWeight: "bold", color: selectedDPR.gps.isFlagged ? "var(--status-rejected)" : "var(--status-approved)", marginTop: "2px" }}>
                    GPS Pin: {selectedDPR.gps.lat}, {selectedDPR.gps.lng} {selectedDPR.gps.isFlagged ? "(Out of bounds)" : "(In-bounds OK)"}
                  </div>
                </div>
              </div>

              <div className="responsive-grid-half" style={{ gap: "12px", fontSize: "var(--font-sm)" }}>
                <div>
                  <div style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Manpower Deployed</div>
                  <div style={{ fontWeight: "bold" }}>{selectedDPR.manpower} Workers</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Equipment Utilized</div>
                  <div style={{ fontWeight: "bold" }}>{selectedDPR.equipment}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", marginBottom: "2px" }}>Work Description</div>
                <div style={{ fontSize: "var(--font-sm)", background: "var(--bg-tertiary)", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>{selectedDPR.workDescription}</div>
              </div>

              {selectedDPR.images && selectedDPR.images.length > 0 && (
                <div>
                  <div style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", marginBottom: "6px" }}>Photo Evidence (EXIF Data Bound)</div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div className="watermark-overlay-container" style={{ maxWidth: "220px", flexShrink: 0 }}>
                      <img src={selectedDPR.images[0].url} alt="Evidence photo" style={{ borderRadius: "var(--radius-sm)", width: "100%" }} />
                      <div className="watermark-text" style={{ fontSize: "8px", padding: "4px" }}>
                        SITEIQ METADATA BOUND<br/>
                        GPS: {selectedDPR.images[0].gps.lat}, {selectedDPR.images[0].gps.lng}<br/>
                        TIME: {selectedDPR.images[0].timestamp}
                      </div>
                    </div>

                    <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "12px", fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--border-color)", paddingBottom: "4px", color: "var(--primary)" }}>EXIF Data Validator</div>
                      <div><strong>Device Model:</strong> iPhone 15 Pro (Simulated)</div>
                      <div><strong>Aperture / ISO:</strong> f/1.78 | ISO 80</div>
                      <div><strong>GPS Coordinates:</strong> {selectedDPR.images[0].gps.lat}, {selectedDPR.images[0].gps.lng}</div>
                      <div><strong>Accuracy:</strong> ±4.2 meters (Within perimeter)</div>
                      <div style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)" }} /> Tamper-proof Signature Verified
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action row */}
              {currentUser.role !== "Site Engr" && selectedDPR.status !== "FULLY LOCKED" && selectedDPR.status !== "Rejected" && (
                <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                  <button 
                    onClick={() => handleApprove(selectedDPR)}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "8px", fontWeight: "bold", background: "var(--status-approved)", borderColor: "var(--status-approved)" }}
                  >
                    <Check size={14} /> Approve / Release Level
                  </button>
                  <button 
                    onClick={() => triggerRejection(selectedDPR)}
                    className="btn"
                    style={{ padding: "8px", fontWeight: "bold", background: "var(--status-rejected)", color: "white", border: "none" }}
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              )}

              {/* Workflow Audit Timeline */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                <h3 className="chart-title" style={{ fontSize: "var(--font-sm)", marginBottom: "12px" }}>DPR Audit Trail</h3>
                <div className="timeline">
                  {selectedDPR.historyLog.map((log, index) => (
                    <div key={index} className="timeline-item">
                      <div className={`timeline-dot ${log.step === "Rejection" ? "danger" : "success"}`} />
                      <div className="timeline-content">
                        <span className="timeline-time">{log.timestamp}</span>
                        <span className="timeline-title">{log.step} Action</span>
                        <span className="timeline-desc">{log.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--font-sm)" }}>
              <ShieldAlert size={36} style={{ margin: "0 auto 10px auto", opacity: 0.4 }} />
              <p>Select a pending DPR record from the list to load EXIF audits, location perimeters, and financial lock checksheets.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection comment Modal Overlay */}
      {rejectionModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "400px", padding: "24px", background: "var(--bg-secondary)" }}>
            <h3 style={{ fontSize: "var(--font-md)", fontWeight: "bold", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={16} style={{ color: "var(--status-rejected)" }} /> Confirm DPR Rejection
            </h3>
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Please input an audit review rejection remark. This comment will write to the SAP history trail, and return the DPR back to the Site Engineer's desk for corrections.
            </p>

            <textarea 
              rows="3" 
              placeholder="e.g. Quantity discrepancy, photo blurry, out of bounds radius offset too high..."
              className="form-control"
              style={{ width: "100%", marginBottom: "16px" }}
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button 
                onClick={() => { setRejectionModalOpen(false); setRejectionComment(""); }}
                className="btn btn-secondary"
                style={{ padding: "6px 12px" }}
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                className="btn"
                style={{ padding: "6px 12px", background: "var(--status-rejected)", color: "white", border: "none" }}
                disabled={!rejectionComment.trim()}
              >
                Post Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
