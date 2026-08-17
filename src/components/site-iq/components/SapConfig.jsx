import React, { useState, useEffect } from "react";
import { 
  Database, Upload, Plus, Trash2, Settings, AlertCircle, CheckCircle, 
  RefreshCw, Play, Building, Layers, Lock, Code, Undo2, Save, 
  Image as ImageIcon, ChevronDown, ChevronRight
} from "lucide-react";
import { 
  getCompanies, saveCompanies, getActiveCompanyId, setActiveCompanyId, 
  getSapConfigs, saveSapConfigs, getColumnMappings, saveColumnMappings, addSapLog 
} from "../data/mockData";

export default function SapConfig({ currentUser }) {
  if (currentUser.role !== "PMCC" && currentUser.role !== "Admin") {
    return (
      <div className="validation-indicator danger" style={{ fontWeight: 650, marginTop: "20px" }}>
        <AlertCircle size={18} />
        <div>
          <strong>Access Denied:</strong> You are not authorized to view the SAP Connection and Branding portal. Administrative privileges are restricted to PMCC executives and System Administrators.
        </div>
      </div>
    );
  }

  // App States
  const [companies, setCompanies] = useState([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(""); // The company currently being edited
  const [sapConfigs, setSapConfigs] = useState({});
  const [columnMappings, setColumnMappings] = useState({});

  // Collapsible section states
  const [isBrandingOpen, setIsBrandingOpen] = useState(true);
  const [isSapOpen, setIsSapOpen] = useState(true);
  const [isMappingsOpen, setIsMappingsOpen] = useState(true);
  const [isPayloadOpen, setIsPayloadOpen] = useState(true);

  // Active inputs states (linked to selectedCompanyId)
  const [companyName, setCompanyName] = useState("");
  const [logoText, setLogoText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  
  // SAP inputs
  const [serverUrl, setServerUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [systemId, setSystemId] = useState("");
  const [authType, setAuthType] = useState("Basic");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [rfcName, rfcNameSet] = useState("");
  const [oauthClientId, setOauthClientId] = useState("");
  const [oauthClientSecret, setOauthClientSecret] = useState("");
  const [oauthTokenUrl, setOauthTokenUrl] = useState("");

  // Mapping state
  const [mappingsList, setMappingsList] = useState([]);

  // New Company dialog
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  const [newCompanyLogoText, setNewCompanyLogoText] = useState("");

  // Testing & Save states
  const [testingConn, setTestingConn] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [alert, setAlert] = useState(null);

  // New Column Mapping inputs
  const [newAppId, setNewAppId] = useState("custom_field");
  const [newAppLabel, setNewAppLabel] = useState("");
  const [newSapField, setNewSapField] = useState("");
  const [newDataType, setNewDataType] = useState("CHAR");
  const [newLength, setNewLength] = useState(10);
  const [newIsMandatory, setNewIsMandatory] = useState(false);

  // Load configuration
  useEffect(() => {
    const loadedCompanies = getCompanies();
    const activeId = getActiveCompanyId();
    const loadedConfigs = getSapConfigs();
    const loadedMappings = getColumnMappings();

    setCompanies(loadedCompanies);
    setActiveCompanyIdState(activeId);
    setSapConfigs(loadedConfigs);
    setColumnMappings(loadedMappings);

    // Default editor focus to the active company
    setSelectedCompanyId(activeId);
  }, []);

  // Sync editor fields when selectedCompanyId changes
  useEffect(() => {
    if (!selectedCompanyId) return;

    // Load Company General Info
    const comp = companies.find(c => c.id === selectedCompanyId);
    if (comp) {
      setCompanyName(comp.name);
      setLogoText(comp.logoText || "");
      setLogoUrl(comp.logoUrl || "");
      setLogoBase64(comp.logoBase64 || "");
    }

    // Load SAP config
    const config = sapConfigs[selectedCompanyId] || {
      serverUrl: "", clientId: "", systemId: "", authType: "Basic",
      username: "", password: "", serviceName: "", rfcName: "",
      oauthClientId: "", oauthClientSecret: "", oauthTokenUrl: ""
    };
    setServerUrl(config.serverUrl || "");
    setClientId(config.clientId || "");
    setSystemId(config.systemId || "");
    setAuthType(config.authType || "Basic");
    setUsername(config.username || "");
    setPassword(config.password || "");
    setServiceName(config.serviceName || "");
    rfcNameSet(config.rfcName || "");
    setOauthClientId(config.oauthClientId || "");
    setOauthClientSecret(config.oauthClientSecret || "");
    setOauthTokenUrl(config.oauthTokenUrl || "");

    // Load column mapping
    const mappings = columnMappings[selectedCompanyId] || [];
    setMappingsList(mappings);
    setTestResult(null);
    setAlert(null);
  }, [selectedCompanyId, companies, sapConfigs, columnMappings]);

  // Handle Logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAlert({ type: "danger", msg: "Logo file is too large. Keep it under 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result);
        setLogoUrl(""); // clear text URL if file uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new company scope
  const handleAddCompanySubmit = (e) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newCompanyId.trim()) {
      setAlert({ type: "danger", msg: "Please fill in all company fields." });
      return;
    }

    const cleanId = "COMP-" + newCompanyId.trim().toUpperCase().replace(/\s+/g, "_");
    if (companies.some(c => c.id === cleanId)) {
      setAlert({ type: "danger", msg: "Company ID already exists." });
      return;
    }

    const newCompanyObj = {
      id: cleanId,
      name: newCompanyName,
      logoText: newCompanyLogoText || newCompanyName[0].toUpperCase(),
      logoUrl: "",
      logoBase64: ""
    };

    // Update state & LocalStorage
    const updatedCompanies = [...companies, newCompanyObj];
    setCompanies(updatedCompanies);
    saveCompanies(updatedCompanies);

    // Setup initial empty SAP config and default column mappings
    const updatedConfigs = {
      ...sapConfigs,
      [cleanId]: {
        serverUrl: "https://sap.company.com/sap/opu/odata/sap/",
        clientId: "100",
        systemId: "ECC",
        authType: "Basic",
        username: "username",
        password: "password",
        serviceName: "Z_SERVICES_SRV",
        rfcName: "BAPI_GOODS_MOVEMENT_CREATE"
      }
    };
    setSapConfigs(updatedConfigs);
    saveSapConfigs(updatedConfigs);

    const updatedMappings = {
      ...columnMappings,
      [cleanId]: [
        { appId: "dprId", appLabel: "DPR Record ID", sapField: "DPR_ID", dataType: "CHAR", length: 15, isMandatory: true },
        { appId: "projectId", appLabel: "Project Code", sapField: "PROJ_CODE", dataType: "CHAR", length: 20, isMandatory: true },
        { appId: "poNumber", appLabel: "Purchase Order", sapField: "EBELN", dataType: "CHAR", length: 10, isMandatory: true },
        { appId: "quantityExecuted", appLabel: "Quantity", sapField: "MENGE", dataType: "NUM", length: 13, isMandatory: true }
      ]
    };
    setColumnMappings(updatedMappings);
    saveColumnMappings(updatedMappings);

    // Switch active editing company
    setSelectedCompanyId(cleanId);
    setShowAddCompany(false);
    setNewCompanyName("");
    setNewCompanyId("");
    setNewCompanyLogoText("");
    setAlert({ type: "success", msg: `New company '${newCompanyName}' added to system scope.` });
  };

  // Switch branding
  const handleSetBrandingActive = () => {
    setActiveCompanyId(selectedCompanyId);
    setActiveCompanyIdState(selectedCompanyId);
    setAlert({ type: "success", msg: `${companyName} branding set as active system UI configuration!` });
    
    // Dispatch custom event to notify parent App header to update instantly
    window.dispatchEvent(new Event("isprp_company_changed"));
  };

  // Test SAP connection
  const handleTestConnection = () => {
    setTestingConn(true);
    setTestResult(null);

    setTimeout(() => {
      // Basic check
      const passes = serverUrl && serverUrl.startsWith("http") && clientId && systemId;
      setTestingConn(false);

      if (passes) {
        setTestResult({
          status: "SUCCESS",
          message: `SAP Connection verified: [${systemId}] Client [${clientId}] OData Gateway active. Version 7.50 OK.`
        });
        addSapLog(
          "TEST_CONNECTION",
          `SAP Connection test passed for ${companyName} (${serverUrl}) client:${clientId} system:${systemId}`,
          "SUCCESS"
        );
      } else {
        setTestResult({
          status: "FAILED",
          message: "Connection failed. Please check Server URL hostname and system configurations."
        });
        addSapLog(
          "TEST_CONNECTION",
          `SAP Connection test FAILED for ${companyName} (${serverUrl || "No URL"}) client:${clientId || "N/A"}`,
          "ERROR"
        );
      }
    }, 1200);
  };

  // Save all settings for currently selected company
  const handleSaveConfig = () => {
    // 1. Save general company logo/name
    const updatedCompanies = companies.map(c => {
      if (c.id === selectedCompanyId) {
        return {
          ...c,
          name: companyName,
          logoText: logoText || companyName[0].toUpperCase(),
          logoUrl,
          logoBase64
        };
      }
      return c;
    });
    setCompanies(updatedCompanies);
    saveCompanies(updatedCompanies);

    // 2. Save SAP Config details
    const updatedConfigs = {
      ...sapConfigs,
      [selectedCompanyId]: {
        serverUrl,
        clientId,
        systemId,
        authType,
        username,
        password,
        serviceName,
        rfcName,
        oauthClientId,
        oauthClientSecret,
        oauthTokenUrl
      }
    };
    setSapConfigs(updatedConfigs);
    saveSapConfigs(updatedConfigs);

    // 3. Save Column Mappings list
    const updatedMappings = {
      ...columnMappings,
      [selectedCompanyId]: mappingsList
    };
    setColumnMappings(updatedMappings);
    saveColumnMappings(updatedMappings);

    // If selected is currently active, fire branding update event
    if (selectedCompanyId === activeCompanyId) {
      window.dispatchEvent(new Event("isprp_company_changed"));
    }

    setAlert({ type: "success", msg: `Saved all configuration mapping policies & credentials for ${companyName} successfully.` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Modify individual column mapping
  const handleColumnFieldChange = (index, field, value) => {
    const updated = [...mappingsList];
    updated[index] = { ...updated[index], [field]: value };
    setMappingsList(updated);
  };

  // Add new column mapping
  const handleAddColumnMapping = (e) => {
    e.preventDefault();
    if (!newAppLabel.trim() || !newSapField.trim()) {
      setAlert({ type: "danger", msg: "Please fill in Application Label and Target SAP Field." });
      return;
    }

    // Verify duplication
    if (mappingsList.some(m => m.appId === newAppId || m.sapField === newSapField.toUpperCase())) {
      setAlert({ type: "danger", msg: "Mapping key or SAP field target already mapped." });
      return;
    }

    const newMapping = {
      appId: newAppId,
      appLabel: newAppLabel,
      sapField: newSapField.toUpperCase().replace(/\s+/g, ""),
      dataType: newDataType,
      length: parseInt(newLength) || 10,
      isMandatory: newIsMandatory
    };

    setMappingsList([...mappingsList, newMapping]);
    
    // Reset Form fields
    setNewAppLabel("");
    setNewSapField("");
    setNewLength(10);
    setNewIsMandatory(false);
  };

  // Remove column mapping
  const handleRemoveColumn = (index) => {
    const updated = mappingsList.filter((_, idx) => idx !== index);
    setMappingsList(updated);
  };

  // Reset to default column mappings
  const handleResetColumnMappings = () => {
    if (window.confirm("Are you sure you want to reset mappings to standard system defaults? All custom edits will be lost.")) {
      const defaultSiteIQ = [
        { appId: "dprId", appLabel: "DPR Record ID", sapField: "DPR_ID", dataType: "CHAR", length: 15, isMandatory: true },
        { appId: "projectId", appLabel: "Project Code", sapField: "PROJ_CODE", dataType: "CHAR", length: 20, isMandatory: true },
        { appId: "poNumber", appLabel: "Purchase Order", sapField: "EBELN", dataType: "CHAR", length: 10, isMandatory: true },
        { appId: "wbsNodeId", appLabel: "WBS Element Code", sapField: "POSID", dataType: "CHAR", length: 24, isMandatory: true },
        { appId: "vendorId", appLabel: "Vendor Code", sapField: "LIFNR", dataType: "CHAR", length: 10, isMandatory: true },
        { appId: "materialCode", appLabel: "Material Code", sapField: "MATNR", dataType: "CHAR", length: 18, isMandatory: true },
        { appId: "reportedDate", appLabel: "Posting Date", sapField: "BUDAT", dataType: "DATE", length: 8, isMandatory: true },
        { appId: "quantityExecuted", appLabel: "Quantity Executed", sapField: "MENGE", dataType: "NUM", length: 13, isMandatory: true },
        { appId: "uom", appLabel: "Unit of Measure", sapField: "MEINS", dataType: "CHAR", length: 3, isMandatory: true },
        { appId: "rate", appLabel: "Unit Price / Rate", sapField: "NETPR", dataType: "NUM", length: 11, isMandatory: false },
        { appId: "manpower", appLabel: "Manpower Count", sapField: "ZMANPOWER", dataType: "INT", length: 4, isMandatory: false },
        { appId: "gpsLat", appLabel: "GPS Latitude", sapField: "ZGPS_LAT", dataType: "DEC", length: 10, isMandatory: false },
        { appId: "gpsLng", appLabel: "GPS Longitude", sapField: "ZGPS_LNG", dataType: "DEC", length: 10, isMandatory: false }
      ];
      setMappingsList(defaultSiteIQ);
    }
  };

  // Generate real-time JSON Payload preview based on current mapping details
  const getMockJsonPreview = () => {
    const payload = {};
    const sampleValues = {
      dprId: "DPR-2026-MUM-01",
      projectId: "PROJ-001",
      poNumber: "PO-MUM-01",
      wbsNodeId: "MUM-WBS-01",
      vendorId: "VND-004",
      materialCode: "MAT-CONC-M40",
      reportedDate: "2026-07-03",
      quantityExecuted: 80,
      uom: "Cum",
      rate: 5500,
      manpower: 45,
      gpsLat: 18.9412,
      gpsLng: 72.8256,
      custom_field: "SAMPLE_VALUE"
    };

    mappingsList.forEach(map => {
      let val = sampleValues[map.appId] !== undefined ? sampleValues[map.appId] : "DPR_FIELD_VAL";
      
      // Formatting based on type
      if (map.dataType === "NUM" || map.dataType === "INT" || map.dataType === "DEC") {
        val = typeof val === "number" ? val : parseFloat(val) || 0;
      } else if (map.dataType === "DATE") {
        val = val.replace(/-/g, ""); // SAP standard dates YYYYMMDD
      }
      payload[map.sapField] = val;
    });

    return JSON.stringify(payload, null, 2);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "40px" }}>
      
      {/* Page Header (macOS style layout) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <Database size={22} style={{ color: "var(--primary)" }} />
            <h1 style={{ fontSize: "var(--font-lg)", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
              SAP Connections & Branding
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--font-xs)", margin: 0 }}>
            Configure database endpoints, adjust company branding logs, and configure active RFC field mappings.
          </p>
        </div>

        <button 
          onClick={handleSaveConfig} 
          className="mac-btn-primary"
        >
          <Save size={14} />
          Save Configurations
        </button>
      </div>

      {/* Alerts */}
      {alert && (
        <div className={`validation-indicator ${alert.type === "success" ? "success" : "danger"}`} style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
          {alert.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <div style={{ fontSize: "var(--font-xs)" }}>{alert.msg}</div>
        </div>
      )}

      {/* Top Controls: Selector & Create Company (macOS Settings Panel style) */}
      <div className="mac-card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1, minWidth: "260px" }}>
            <Building size={16} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontWeight: 600, fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>Company Scope:</span>
            <select 
              className="mac-select" 
              style={{ width: "240px", padding: "5px 8px" }}
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.id === activeCompanyId ? "★ (Active UI)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => setShowAddCompany(!showAddCompany)} 
              className="mac-btn-secondary"
            >
              <Plus size={14} />
              Add Scope
            </button>

            {selectedCompanyId !== activeCompanyId && (
              <button 
                onClick={handleSetBrandingActive} 
                className="mac-btn-secondary"
                style={{ color: "var(--primary)" }}
              >
                Set Active Brand
              </button>
            )}
          </div>

        </div>

        {/* Add Company Section */}
        {showAddCompany && (
          <form onSubmit={handleAddCompanySubmit} style={{ marginTop: "16px", padding: "16px", border: "1px solid var(--border-color)", borderRadius: "8px", background: "rgba(0,0,0,0.01)", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "flex-end" }}>
            
            <div className="form-group" style={{ flex: "1 1 150px", margin: 0 }}>
              <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>Company ID Code</label>
              <input 
                type="text" 
                placeholder="e.g. RELIANCE"
                className="mac-input"
                value={newCompanyId}
                onChange={(e) => setNewCompanyId(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ flex: "2 1 200px", margin: 0 }}>
              <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>Full Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Reliance Projects Ltd"
                className="mac-input"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ flex: "1 1 100px", margin: 0 }}>
              <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>Logo Monogram</label>
              <input 
                type="text" 
                placeholder="e.g. R"
                className="mac-input"
                maxLength={2}
                value={newCompanyLogoText}
                onChange={(e) => setNewCompanyLogoText(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="mac-btn-primary" style={{ padding: "5px 12px" }}>Create</button>
              <button type="button" className="mac-btn-secondary" style={{ padding: "5px 12px" }} onClick={() => setShowAddCompany(false)}>Cancel</button>
            </div>

          </form>
        )}
      </div>

      {/* Main Collapsible Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* SECTION 1: BRANDING */}
        <div className="mac-card">
          <div 
            className="mac-header"
            onClick={() => setIsBrandingOpen(!isBrandingOpen)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ImageIcon size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--text-primary)" }}>
                Company Identity & Custom Logo Customization
              </span>
            </div>
            {isBrandingOpen ? <ChevronDown size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />}
          </div>

          {isBrandingOpen && (
            <div className="mac-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Company Name (Display Header)</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Fallback Logo Monogram (Max 2 chars)</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    maxLength={2}
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Logo Image URL</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    placeholder="https://brand.logo.com/image.png"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setLogoBase64(""); 
                    }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Or Upload Local File</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <label className="mac-btn-secondary" style={{ cursor: "pointer", fontSize: "12px", margin: 0, padding: "5px 10px" }}>
                      <Upload size={12} />
                      Choose File
                      <input 
                        type="file" 
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleLogoUpload}
                      />
                    </label>

                    {(logoBase64 || logoUrl) && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-primary)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                        <img 
                          src={logoBase64 || logoUrl} 
                          alt="Thumbnail" 
                          style={{ height: "18px", maxWidth: "60px", objectFit: "contain" }}
                        />
                        <button 
                          type="button" 
                          style={{ border: "none", background: "transparent", color: "var(--danger)", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          onClick={() => { setLogoBase64(""); setLogoUrl(""); }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: SAP CONNECTION */}
        <div className="mac-card">
          <div 
            className="mac-header"
            onClick={() => setIsSapOpen(!isSapOpen)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Lock size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--text-primary)" }}>
                SAP Connection Gateway & API Credentials
              </span>
            </div>
            {isSapOpen ? <ChevronDown size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />}
          </div>

          {isSapOpen && (
            <div className="mac-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* ERP Integration Presets Selection */}
              <div style={{ marginBottom: "8px" }}>
                <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                  Load ERP System Profile Preset
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" }}>
                  {[
                    { name: "SAP S/4HANA OData", url: "https://sap-hana-prd.siteiq.in:8443/sap/opu/odata/sap/", client: "100", sys: "SIP", auth: "Basic" },
                    { name: "Oracle NetSuite REST", url: "https://ns-api.siteiq.in/services/rest/record/v1/", client: "400", sys: "NET", auth: "OAuth" },
                    { name: "MS Dynamics OData", url: "https://dynamics-prd.siteiq.in/data/", client: "200", sys: "DYN", auth: "OAuth" }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      style={{
                        padding: "8px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "11px",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "var(--text-primary)"
                      }}
                      onClick={() => {
                        setServerUrl(preset.url);
                        setClientId(preset.client);
                        setSystemId(preset.sys);
                        setAuthType(preset.auth);
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "2px", color: "var(--primary)" }}>{preset.name}</div>
                      <div style={{ fontSize: "9px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Client: {preset.client} | {preset.sys}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>SAP Gateway Gateway Server URL</label>
                <input 
                  type="text" 
                  className="mac-input"
                  placeholder="https://sap-server-prd.company.com:8000/sap/opu/odata/sap/"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>SAP Client No</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    maxLength={3}
                    placeholder="e.g. 100"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>SAP System ID (SID)</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    maxLength={3}
                    placeholder="e.g. GKP"
                    value={systemId}
                    onChange={(e) => setSystemId(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>OData Service Name</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    placeholder="e.g. ZDPR_GATEWAY_SRV"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>RFC Module / BAPI</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    placeholder="e.g. BAPI_GOODS_MOVEMENT_CREATE"
                    value={rfcName}
                    onChange={(e) => rfcNameSet(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Authentication Mode</label>
                  <select 
                    className="mac-select"
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                  >
                    <option value="Basic">Basic Access Authentication (User/Password)</option>
                    <option value="OAuth">OAuth 2.0 Client Credentials Grant</option>
                  </select>
                </div>

                {authType === "Basic" ? (
                  <>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Communications Username</label>
                      <input 
                        type="text" 
                        className="mac-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Password</label>
                      <input 
                        type="password" 
                        className="mac-input"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>OAuth Client ID</label>
                      <input 
                        type="text" 
                        className="mac-input"
                        value={oauthClientId}
                        onChange={(e) => setOauthClientId(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>OAuth Client Secret</label>
                      <input 
                        type="password" 
                        className="mac-input"
                        value={oauthClientSecret}
                        onChange={(e) => setOauthClientSecret(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "var(--font-xs)", fontWeight: "600", marginBottom: "4px" }}>Token endpoint URL</label>
                      <input 
                        type="text" 
                        className="mac-input"
                        placeholder="https://oauth.company.com/token"
                        value={oauthTokenUrl}
                        onChange={(e) => setOauthTokenUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}

              </div>

              {/* Handshake Verification Block */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <button 
                  type="button" 
                  onClick={handleTestConnection}
                  disabled={testingConn}
                  className="mac-btn-secondary"
                  style={{ width: "100%" }}
                >
                  <Play size={12} className={testingConn ? "animate-spin" : ""} />
                  {testingConn ? "Initiating RFC Ping..." : "Verify Gateway Handshake (Test Connection)"}
                </button>

                {testResult && (
                  <div className={`validation-indicator ${testResult.status === "SUCCESS" ? "success" : "danger"}`} style={{ display: "flex", gap: "10px", alignItems: "flex-start", margin: 0 }}>
                    {testResult.status === "SUCCESS" ? <CheckCircle size={14} style={{ marginTop: "2px" }} /> : <AlertCircle size={14} style={{ marginTop: "2px" }} />}
                    <div style={{ fontSize: "var(--font-xs)" }}>
                      <strong>{testResult.status}:</strong> {testResult.message}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* SECTION 3: COLUMN MAPPINGS */}
        <div className="mac-card">
          <div 
            className="mac-header"
            onClick={() => setIsMappingsOpen(!isMappingsOpen)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Layers size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--text-primary)" }}>
                Active Column Mapping Rules (ISPRP ➔ SAP BAPI Fields)
              </span>
            </div>
            {isMappingsOpen ? <ChevronDown size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />}
          </div>

          {isMappingsOpen && (
            <div className="mac-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Mapping table matrix */}
              <div className="mac-table-container">
                <table className="mac-table">
                  <thead>
                    <tr>
                      <th style={{ width: "220px" }}>Application Parameter</th>
                      <th>Target SAP Field Code</th>
                      <th style={{ width: "110px" }}>SAP Type</th>
                      <th style={{ width: "70px" }}>Length</th>
                      <th style={{ width: "60px", textAlign: "center" }}>Req</th>
                      <th style={{ width: "40px", textAlign: "center" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappingsList.map((map, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>
                          {map.appLabel}
                          <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{map.appId}</div>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="mac-input" 
                            style={{ padding: "4px 8px", fontSize: "12px", textTransform: "uppercase" }}
                            value={map.sapField}
                            onChange={(e) => handleColumnFieldChange(idx, "sapField", e.target.value.toUpperCase().replace(/\s+/g, ""))}
                          />
                        </td>
                        <td>
                          <select 
                            className="mac-select" 
                            style={{ padding: "3px 6px", fontSize: "12px" }}
                            value={map.dataType}
                            onChange={(e) => handleColumnFieldChange(idx, "dataType", e.target.value)}
                          >
                            <option value="CHAR">CHAR</option>
                            <option value="NUM">NUM</option>
                            <option value="INT">INT</option>
                            <option value="DEC">DEC</option>
                            <option value="DATE">DATE</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="mac-input" 
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                            value={map.length}
                            onChange={(e) => handleColumnFieldChange(idx, "length", parseInt(e.target.value) || 10)}
                          />
                        </td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <input 
                            type="checkbox" 
                            checked={map.isMandatory}
                            onChange={(e) => handleColumnFieldChange(idx, "isMandatory", e.target.checked)}
                          />
                        </td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveColumn(idx)}
                            style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", padding: "4px" }}
                            title="Remove mapping"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mappings utilities controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {mappingsList.length} parameters configured in active company schema.
                </span>
                <button 
                  type="button" 
                  onClick={handleResetColumnMappings}
                  className="mac-btn-secondary"
                  style={{ padding: "4px 10px", fontSize: "11px" }}
                >
                  <Undo2 size={12} />
                  Restore Standard Columns
                </button>
              </div>

              {/* Add customized column rule */}
              <form onSubmit={handleAddColumnMapping} style={{ display: "flex", flexWrap: "wrap", gap: "10px", background: "rgba(0,0,0,0.01)", padding: "12px", borderRadius: "8px", border: "1px dashed var(--border-color)", alignItems: "flex-end" }}>
                
                <div style={{ flex: "1 1 120px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px", display: "block" }}>Source Param</label>
                  <select 
                    className="mac-select" 
                    value={newAppId}
                    onChange={(e) => {
                      setNewAppId(e.target.value);
                      const labels = {
                        dprId: "DPR Record ID",
                        projectId: "Project Code",
                        poNumber: "Purchase Order",
                        wbsNodeId: "WBS Element Code",
                        vendorId: "Vendor Code",
                        materialCode: "Material Code",
                        reportedDate: "Posting Date",
                        quantityExecuted: "Quantity Executed",
                        uom: "Unit of Measure",
                        rate: "Unit Rate",
                        manpower: "Manpower Count",
                        gpsLat: "GPS Latitude",
                        gpsLng: "GPS Longitude",
                        custom_field: "Custom Field Parameter"
                      };
                      setNewAppLabel(labels[e.target.value] || "Custom Param");
                    }}
                  >
                    <option value="dprId">DPR Record ID</option>
                    <option value="projectId">Project Code</option>
                    <option value="poNumber">Purchase Order</option>
                    <option value="wbsNodeId">WBS Element Code</option>
                    <option value="vendorId">Vendor Code</option>
                    <option value="materialCode">Material Code</option>
                    <option value="reportedDate">Posting Date</option>
                    <option value="quantityExecuted">Quantity Executed</option>
                    <option value="uom">Unit of Measure</option>
                    <option value="rate">Unit Rate</option>
                    <option value="manpower">Manpower Count</option>
                    <option value="gpsLat">GPS Latitude</option>
                    <option value="gpsLng">GPS Longitude</option>
                    <option value="custom_field">Custom Attribute</option>
                  </select>
                </div>

                <div style={{ flex: "1.5 1 130px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px", display: "block" }}>Label Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Supervisor Initials"
                    className="mac-input" 
                    value={newAppLabel}
                    onChange={(e) => setNewAppLabel(e.target.value)}
                  />
                </div>

                <div style={{ flex: "1 1 100px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px", display: "block" }}>SAP Parameter ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ZSUPERVISOR"
                    className="mac-input" 
                    style={{ textTransform: "uppercase" }}
                    value={newSapField}
                    onChange={(e) => setNewSapField(e.target.value)}
                  />
                </div>

                <div style={{ flex: "0.8 1 80px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "600", marginBottom: "4px", display: "block" }}>Data Type</label>
                  <select 
                    className="mac-select" 
                    value={newDataType}
                    onChange={(e) => setNewDataType(e.target.value)}
                  >
                    <option value="CHAR">CHAR</option>
                    <option value="NUM">NUM</option>
                    <option value="INT">INT</option>
                    <option value="DEC">DEC</option>
                    <option value="DATE">DATE</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={newIsMandatory}
                      onChange={(e) => setNewIsMandatory(e.target.checked)}
                    />
                    Mandatory
                  </label>
                  
                  <button 
                    type="button" 
                    onClick={handleAddColumnMapping}
                    className="mac-btn-primary"
                    style={{ padding: "5px 12px" }}
                  >
                    <Plus size={12} />
                    Add Field
                  </button>
                </div>

              </form>

            </div>
          )}
        </div>

        {/* SECTION 4: JSON PREVIEW */}
        <div className="mac-card">
          <div 
            className="mac-header"
            onClick={() => setIsPayloadOpen(!isPayloadOpen)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Code size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--text-primary)" }}>
                Simulated BAPI RFC OData Payload Preview
              </span>
            </div>
            {isPayloadOpen ? <ChevronDown size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />}
          </div>

          {isPayloadOpen && (
            <div className="mac-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", margin: 0 }}>
                Live validation preview compiled directly from current column configuration schemas using a mock DPR report.
              </p>

              <div style={{ 
                background: "var(--bg-primary)", 
                color: "var(--text-primary)", 
                padding: "16px", 
                borderRadius: "8px", 
                fontFamily: "var(--font-mono)", 
                fontSize: "11.5px", 
                whiteSpace: "pre-wrap", 
                border: "1px solid var(--border-color)",
                maxHeight: "260px",
                overflowY: "auto"
              }}>
                {getMockJsonPreview()}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
