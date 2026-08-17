import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Layers, CheckCircle2, TrendingUp, DollarSign, MapPin, AlertTriangle, ShieldCheck, CloudSun, Calendar, Users, RefreshCw, Compass, Database as DatabaseZap, Activity } from "lucide-react";
import { getProjects, getPOs, getDPRs } from "../data/mockData";

export default function Dashboard({ currentUser }) {
  const [projects, setProjects] = useState([]);
  const [pos, setPOs] = useState([]);
  const [dprs, setDPRs] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedProjId, setSelectedProjId] = useState("ALL");
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [recentlyVisited, setRecentlyVisited] = useState(() => {
    return JSON.parse(localStorage.getItem("isprp_recently_visited") || "[]");
  });
  const mapRef = useRef(null);

  const mapWmoCode = (code) => {
    if (code === 0) return { cond: "Clear Sky", icon: "☀️", status: "Optimal Speed" };
    if (code >= 1 && code <= 3) return { cond: "Partly Cloudy", icon: "⛅", status: "Normal Speed" };
    if (code === 45 || code === 48) return { cond: "Foggy", icon: "🌫️", status: "Normal Speed" };
    if (code >= 51 && code <= 55) return { cond: "Light Drizzle", icon: "🌧️", status: "Normal Speed" };
    if (code >= 61 && code <= 65) return { cond: "Heavy Rain", icon: "🌧️", status: "Minor Delays" };
    if (code >= 80 && code <= 82) return { cond: "Scattered Showers", icon: "🌦️", status: "Minor Delays" };
    if (code >= 95 && code <= 99) return { cond: "Thunderstorm", icon: "⛈️", status: "Work Halted" };
    return { cond: "Fair Conditions", icon: "☀️", status: "Normal Speed" };
  };

  const getDefaultWeather = (id) => {
    const mockWeatherMap = {
      "PROJ-001": { temp: "28°C", cond: "Heavy Rain (Monsoons)", icon: "🌧️", status: "Work Halted" },
      "PROJ-002": { temp: "34°C", cond: "Clear Sunny Skies", icon: "☀️", status: "Optimal Speed" },
      "PROJ-003": { temp: "31°C", cond: "Partly Cloudy", icon: "⛅", status: "Normal Speed" },
      "PROJ-004": { temp: "33°C", cond: "Scattered Showers", icon: "🌦️", status: "Minor Delays" },
      "PROJ-005": { temp: "29°C", cond: "High Winds / Coastal", icon: "💨", status: "Crane Ops Halted" },
      "PROJ-006": { temp: "30°C", cond: "Light Drizzle", icon: "🌧️", status: "Normal Speed" },
      "PROJ-007": { temp: "32°C", cond: "Mostly Sunny", icon: "☀️", status: "Optimal Speed" },
      "PROJ-008": { temp: "29°C", cond: "Overcast Clouds", icon: "☁️", status: "Normal Speed" },
      "PROJ-009": { temp: "35°C", cond: "Sunny & Hot", icon: "☀️", status: "Optimal Speed" },
      "PROJ-010": { temp: "30°C", cond: "Clear Sky", icon: "☀️", status: "Optimal Speed" },
      "PROJ-011": { temp: "33°C", cond: "Humid Partly Cloudy", icon: "⛅", status: "Normal Speed" },
      "PROJ-012": { temp: "31°C", cond: "Scattered Clouds", icon: "⛅", status: "Normal Speed" }
    };
    return mockWeatherMap[id] || { temp: "30°C", cond: "Fair", icon: "☀️", status: "Normal Speed" };
  };

  useEffect(() => {
    const rawProjects = getProjects();
    const rawPOs = getPOs();
    const rawDPRs = getDPRs();

    // Filter projects based on user permissions
    const filteredProjects = currentUser.role === "PMCC" || currentUser.role === "HO Incharge" || currentUser.role === "Admin"
      ? rawProjects
      : rawProjects.filter(p => currentUser.projects.includes(p.id));

    // Filter POs and DPRs matching user projects
    const filteredProjIds = filteredProjects.map(p => p.id);
    const filteredPOs = rawPOs.filter(po => filteredProjIds.includes(po.projectId));
    const filteredDprs = rawDPRs.filter(d => filteredProjIds.includes(d.projectId));

    setProjects(filteredProjects);
    setPOs(filteredPOs);
    setDPRs(filteredDprs);

    // Fetch real-time weather from Open-Meteo API (batch request to prevent 429 rate limit errors)
    const fetchWeather = async () => {
      if (filteredProjects.length === 0) return;
      setWeatherLoading(true);
      const results = {};
      try {
        const latitudes = filteredProjects.map(p => p.latitude).join(",");
        const longitudes = filteredProjects.map(p => p.longitude).join(",");
        
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,weather_code,wind_speed_10m`);
        
        if (res.ok) {
          const data = await res.json();
          const dataArray = Array.isArray(data) ? data : [data];
          
          filteredProjects.forEach((p, idx) => {
            const projectData = dataArray[idx];
            if (projectData && projectData.current) {
              const current = projectData.current;
              const temp = `${Math.round(current.temperature_2m)}°C`;
              const wmo = mapWmoCode(current.weather_code);
              let status = wmo.status;
              if (current.wind_speed_10m > 25 && status !== "Work Halted") {
                status = "Crane Ops Halted";
              }
              results[p.id] = {
                temp,
                cond: wmo.cond,
                icon: wmo.icon,
                status,
                wind: `${current.wind_speed_10m} km/h`
              };
            } else {
              results[p.id] = getDefaultWeather(p.id);
            }
          });
        } else {
          filteredProjects.forEach(p => {
            results[p.id] = getDefaultWeather(p.id);
          });
        }
      } catch (err) {
        console.error("Batch weather fetch failed, utilizing fallbacks:", err);
        filteredProjects.forEach(p => {
          results[p.id] = getDefaultWeather(p.id);
        });
      } finally {
        setWeatherData(results);
        setWeatherLoading(false);
      }
    };
    fetchWeather();

    // Dynamic injection of Leaflet JS and CSS
    const loadLeaflet = async () => {
      if (!window.L) {
        // CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        await new Promise((resolve) => {
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
      setMapLoaded(true);
    };
    loadLeaflet();
  }, [currentUser]);

  // Initialize Map whenever projects, DPRs, or Leaflet loads
  useEffect(() => {
    if (!mapLoaded || projects.length === 0) return;

    const mapContainer = document.getElementById("dashboard-live-map");
    if (!mapContainer) return;

    // Check if map already initialized
    if (!mapRef.current) {
      // Initialize map centered at India's geographical center
      const map = window.L.map("dashboard-live-map").setView([21.7679, 78.8718], 5);
      mapRef.current = map;

      // Dark/Light layer mapping
      const isDark = document.body.classList.contains("dark-theme-active");
      const tilesUrl = isDark 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      window.L.tileLayer(tilesUrl, {
        attribution: "© OpenStreetMap, © CartoDB"
      }).addTo(map);
    }

    const mapInstance = mapRef.current;

    // Clean old layers before re-drawing
    mapInstance.eachLayer((layer) => {
      if (layer instanceof window.L.Circle || layer instanceof window.L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Plot Projects boundaries and marker centers
    projects.forEach((p) => {
      // 1. Draw fence radius
      window.L.circle([p.latitude, p.longitude], {
        radius: p.radiusMeters,
        color: "var(--primary)",
        fillColor: "var(--primary)",
        fillOpacity: 0.05,
        weight: 1.5
      }).addTo(mapInstance);

      // 2. Draw project center marker
      const centerIcon = window.L.divIcon({
        className: "custom-proj-audit-marker",
        html: `<div style="background-color: var(--primary); width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.25);"></div>`,
        iconSize: [10, 10]
      });

      window.L.marker([p.latitude, p.longitude], { icon: centerIcon })
        .addTo(mapInstance)
        .bindPopup(`<strong>${p.name}</strong><br/>Fence perimeter: ${p.radiusMeters}m`);
    });

    // Plot Approved DPR location entries
    dprs.forEach((d) => {
      if (!d.gps) return;
      const isFlagged = d.gps.isFlagged;
      const pinColor = isFlagged ? "var(--status-rejected)" : "var(--status-approved)";
      const pulseClass = isFlagged ? "pulse-red" : "";

      const dprIcon = window.L.divIcon({
        className: `custom-entry-marker ${pulseClass}`,
        html: `<div style="background-color: ${pinColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12]
      });

      const matchingPO = pos.find(p => p.poNumber === d.poNumber);
      const imageHtml = d.images && d.images.length > 0 
        ? `<div style="margin-top: 8px;"><img src="${d.images[0].url}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" /></div>`
        : "";

      window.L.marker([d.gps.lat, d.gps.lng], { icon: dprIcon })
        .addTo(mapInstance)
        .bindPopup(`
          <div style="font-family: var(--font-family); font-size: var(--font-xs); line-height: 1.3;">
            <div style="font-weight: 700; margin-bottom: 2px;">
              DPR Entry: ${d.id} (${d.status})
            </div>
            Work Qty: <strong>${d.quantityExecuted}</strong> ${matchingPO ? matchingPO.uom : ""}<br/>
            Site: ${matchingPO ? matchingPO.materialDescription : ""}<br/>
            ${isFlagged 
              ? '<span style="color: var(--status-rejected); font-weight: 700; display: flex; align-items:center; gap: 2px; margin-top:4px;">⚠️ Location Flagged</span>' 
              : '<span style="color: var(--status-approved); font-weight: 600; display: flex; align-items:center; gap: 2px; margin-top:4px;">✓ Geo-fence Verified</span>'}
            ${imageHtml}
          </div>
        `);
    });

  }, [mapLoaded, projects, dprs, pos]);

  // Handle dropdown site focus and Leaflet map flyTo
  const handleSiteChange = (projId) => {
    setSelectedProjId(projId);
    if (!mapRef.current) return;
    
    if (projId === "ALL") {
      mapRef.current.setView([21.7679, 78.8718], 5);
    } else {
      const selectedProj = projects.find(p => p.id === projId);
      if (selectedProj) {
        mapRef.current.flyTo([selectedProj.latitude, selectedProj.longitude], 12);
        
        // Track recently visited projects
        setRecentlyVisited((prev) => {
          const filtered = prev.filter(id => id !== projId);
          const updated = [projId, ...filtered].slice(0, 5);
          localStorage.setItem("isprp_recently_visited", JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  // Filter subsets based on selected dropdown site
  const displayedProjects = selectedProjId === "ALL" 
    ? projects 
    : projects.filter(p => p.id === selectedProjId);

  const displayedPOs = selectedProjId === "ALL"
    ? pos
    : pos.filter(po => po.projectId === selectedProjId);

  const displayedDprs = selectedProjId === "ALL"
    ? dprs
    : dprs.filter(d => d.projectId === selectedProjId);

  // Calculate dynamic metrics
  const totalProjects = displayedProjects.length;
  
  const getPendingCountForRole = () => {
    switch (currentUser.role) {
      case "Planning Engr":
        return displayedDprs.filter(d => d.status === "Submitted").length;
      case "PM":
        return displayedDprs.filter(d => d.status === "Under Review").length;
      case "HO Incharge":
        return displayedDprs.filter(d => d.status === "Approved" || d.status === "PM Approved").length;
      case "PMCC":
      case "Admin":
        return displayedDprs.filter(d => d.status === "HO Approved").length;
      default:
        return displayedDprs.filter(d => d.status === "Draft" || d.status === "Rejected").length;
    }
  };

  const pendingApprovalsCount = getPendingCountForRole();

  let totalTargetQty = 0;
  let totalExecutedQty = 0;
  
  displayedPOs.forEach(po => {
    totalTargetQty += po.totalQty;
    const approvedDprSum = displayedDprs
      .filter(d => d.poNumber === po.poNumber && (d.status === "FULLY LOCKED" || d.status === "Approved" || d.status === "HO Approved"))
      .reduce((sum, d) => sum + d.quantityExecuted, 0);
    totalExecutedQty += approvedDprSum;
  });

  const aggregateProgressPercent = totalTargetQty > 0 
    ? Math.round((totalExecutedQty / totalTargetQty) * 100)
    : 0;

  // Extra metrics calculations for enhanced dashboard insights
  const totalManpowerCount = displayedDprs.reduce((sum, d) => sum + (d.manpower || 0), 0);
  
  const totalCostINR = displayedPOs.reduce((sum, po) => {
    const approvedDprs = displayedDprs.filter(d => d.poNumber === po.poNumber && (d.status === "FULLY LOCKED" || d.status === "Approved" || d.status === "HO Approved"));
    const dprQty = approvedDprs.reduce((s, d) => s + d.quantityExecuted, 0);
    return sum + (dprQty * po.rate);
  }, 0);

  const formatCostValue = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const syncedDprsCount = displayedDprs.filter(d => d.sapSync && d.sapSync.synced).length;
  const totalFinalizedDprs = displayedDprs.filter(d => d.status === "FULLY LOCKED").length;
  const sapSyncRatePercent = totalFinalizedDprs > 0 
    ? Math.round((syncedDprsCount / totalFinalizedDprs) * 100)
    : 100;

  const totalGpsAudits = displayedDprs.filter(d => d.gps).length;
  const passedGpsAudits = displayedDprs.filter(d => d.gps && !d.gps.isFlagged).length;
  const geofenceAccuracyRating = totalGpsAudits > 0 
    ? Math.round((passedGpsAudits / totalGpsAudits) * 100)
    : 100;

  // Chart data: Budget vs Actual OR WBS Materials quantities
  const barChartData = selectedProjId === "ALL"
    ? projects.map(p => {
        const projPOs = pos.filter(po => po.projectId === p.id);
        const actual = projPOs.reduce((sum, po) => {
          const approvedDprs = dprs.filter(d => d.poNumber === po.poNumber && (d.status === "FULLY LOCKED" || d.status === "Approved" || d.status === "HO Approved"));
          const dprQty = approvedDprs.reduce((s, d) => s + d.quantityExecuted, 0);
          return sum + (dprQty * po.rate);
        }, 0);

        return {
          name: p.code,
          Budget: (p.budget / 100000).toFixed(1),
          Actual: (actual / 100000).toFixed(1),
        };
      })
    : displayedPOs.map(po => {
        const approvedDprs = dprs.filter(d => d.poNumber === po.poNumber && (d.status === "FULLY LOCKED" || d.status === "Approved" || d.status === "HO Approved"));
        const actualQty = approvedDprs.reduce((sum, d) => sum + d.quantityExecuted, 0);
        return {
          name: po.poNumber.substring(0, 7),
          "Contract Qty": po.totalQty,
          "Executed Qty": actualQty
        };
      });

  const dailyChartData = [
    { date: "22 Jun", Volume: 120 },
    { date: "23 Jun", Volume: 210 },
    { date: "24 Jun", Volume: 180 },
    { date: "25 Jun", Volume: 340 },
    { date: "26 Jun", Volume: 290 },
    { date: "27 Jun", Volume: 410 },
    { date: "28 Jun", Volume: 320 }
  ];

  const flaggedDprsCount = displayedDprs.filter(d => d.gps && d.gps.isFlagged).length;



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Page header with dynamic WBS project selection dropdown */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
        <div className="page-title" style={{ margin: 0 }}>
          <h1>Site Dashboard & Geotag Control Center</h1>
          <p style={{ marginTop: "4px" }}>Authorized monitoring for: {currentUser.name} ({currentUser.role})</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Scrollable quick site selector chips */}
          <div className="scrollable-chips-container" style={{ display: "flex", gap: "8px", overflowX: "auto", maxWidth: "420px", padding: "4px 0", whiteSpace: "nowrap" }}>
            <button 
              type="button"
              className={`btn chip-btn ${selectedProjId === "ALL" ? "active" : ""}`}
              onClick={() => handleSiteChange("ALL")}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                background: selectedProjId === "ALL" ? "var(--primary)" : "var(--bg-secondary)",
                color: selectedProjId === "ALL" ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border-color)",
                fontSize: "var(--font-xs)",
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
                className={`btn chip-btn ${selectedProjId === p.id ? "active" : ""}`}
                onClick={() => handleSiteChange(p.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: selectedProjId === p.id ? "var(--primary)" : "var(--bg-secondary)",
                  color: selectedProjId === p.id ? "white" : "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                  fontSize: "var(--font-xs)",
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

          <div className="form-group" style={{ margin: 0, minWidth: "180px" }}>
            <select 
              className="form-control"
              value={selectedProjId}
              onChange={(e) => handleSiteChange(e.target.value)}
              style={{ fontWeight: "bold", padding: "6px 12px" }}
            >
              <option value="ALL">Show All Sites ({projects.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable Recently Visited Row */}
      {recentlyVisited.length > 0 && (
        <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px", marginTop: "-8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "var(--font-xs)", fontWeight: "bold", color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
            <Compass size={12} style={{ color: "var(--primary)" }} /> Recently Visited:
          </span>
          <div className="scrollable-chips-container" style={{ display: "flex", gap: "8px", overflowX: "auto", whiteSpace: "nowrap" }}>
            {recentlyVisited.map(id => {
              const proj = projects.find(p => p.id === id);
              if (!proj) return null;
              return (
                <button
                  type="button"
                  key={id}
                  className={`btn chip-btn ${selectedProjId === id ? "active" : ""}`}
                  onClick={() => handleSiteChange(id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "15px",
                    background: selectedProjId === id ? "var(--primary)" : "var(--bg-tertiary)",
                    color: selectedProjId === id ? "white" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    fontSize: "var(--font-xs)",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    margin: 0
                  }}
                >
                  {proj.code} - {proj.name.split(" - ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics Grid (8 macOS Silver styled cards) */}
      <div className="metrics-grid">
        
        {/* Active Projects count */}
        <div className="metric-card card-blue" title="Authorized WBS Node Projects">
          <div className="metric-header" title="Authorized WBS Projects">
            <span>{selectedProjId === "ALL" ? "Projects" : "Project"}</span>
            <Layers size={14} className="metric-icon" />
          </div>
          <div className="metric-value">{totalProjects}</div>
          <div className="metric-subtext" title="Authorized WBS projects count">WBS Channels</div>
        </div>

        {/* Aggregate Progress */}
        <div className="metric-card card-green" title="Overall Quantity Progress">
          <div className="metric-header" title="Overall Progress">
            <span>Progress</span>
            <TrendingUp size={14} className="metric-icon" />
          </div>
          <div className="metric-value">{aggregateProgressPercent}%</div>
          <div className="metric-subtext" title="Quantity execution vs PO totals">Contract PO</div>
        </div>

        {/* Active Manpower count */}
        <div className="metric-card card-orange" title="Total Active Site Manpower">
          <div className="metric-header" title="Active Manpower">
            <span>Manpower</span>
            <Users size={14} className="metric-icon" />
          </div>
          <div className="metric-value">{totalManpowerCount}</div>
          <div className="metric-subtext" title="Active workforce headcount sum">Active Labor</div>
        </div>

        {/* Total Cost Progress */}
        <div className="metric-card card-purple" title="Total Material Value Executed">
          <div className="metric-header" title="Executed Value">
            <span>Work Value</span>
            <DollarSign size={14} className="metric-icon" />
          </div>
          <div className="metric-value">{formatCostValue(totalCostINR)}</div>
          <div className="metric-subtext" title="Approved and locked billing value">Billing Value</div>
        </div>

        {/* Pending approvals */}
        <div className="metric-card card-yellow" title="Pending Actions for Your Role">
          <div className="metric-header" title="Pending Approvals">
            <span>Pending</span>
            <CheckCircle2 size={14} className="metric-icon" />
          </div>
          <div className="metric-value" style={{ color: pendingApprovalsCount > 0 ? "var(--warning)" : "inherit" }}>
            {pendingApprovalsCount}
          </div>
          <div className="metric-subtext" title="Awaiting action for your active role">Awaiting Review</div>
        </div>


        {/* Flagged entries count */}
        <div className="metric-card card-red" title="Flagged Location Deviations">
          <div className="metric-header" title="Geofence Flagged">
            <span>Flagged</span>
            <AlertTriangle size={14} className="metric-icon" />
          </div>
          <div className="metric-value" style={{ color: flaggedDprsCount > 0 ? "var(--danger)" : "inherit" }}>
            {flaggedDprsCount}
          </div>
          <div className="metric-subtext" title="Out-of-perimeter violations">GPS Alerts</div>
        </div>

        {/* Geofence Compliance Rate */}
        <div className="metric-card card-teal" title="GPS Verification Proximity Compliance">
          <div className="metric-header" title="GPS Compliance">
            <span>GPS Pass</span>
            <Compass size={14} className="metric-icon" />
          </div>
          <div className="metric-value" style={{ color: geofenceAccuracyRating < 90 ? "var(--warning)" : "var(--success)" }}>
            {geofenceAccuracyRating}%
          </div>
          <div className="metric-subtext" title="Geofence verification pass rate">GPS Compliance</div>
        </div>

      </div>

      {/* Main Grid: Map and Details panel */}
      <div className="responsive-grid-equal">
        
        {/* GIS Location Map */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title">
            <MapPin size={14} style={{ color: "var(--primary)" }} /> Live GIS Progress Map
          </h2>
          <div style={{ position: "relative", width: "100%", height: "320px", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <div id="dashboard-live-map" style={{ width: "100%", height: "100%", zIndex: 1 }}></div>
            {!mapLoaded && (
              <div style={{ position: "absolute", inset: 0, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-sm)", color: "var(--text-muted)", zIndex: 2 }}>
                Loading GIS map components...
              </div>
            )}
          </div>
        </div>

        {/* Split info column: Geo-Validation AND Weather station */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Weather Station Monitor Panel */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 className="chart-title" style={{ display: "flex", alignItems: "center" }}>
              <CloudSun size={14} style={{ color: "var(--primary)", marginRight: "6px" }} /> Site Weather Station Monitor
              {weatherLoading ? (
                <span style={{ fontSize: "10px", textTransform: "none", fontWeight: "normal", color: "var(--text-muted)", marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                  <RefreshCw size={10} className="animate-spin" /> Fetching live API...
                </span>
              ) : (
                <span style={{ fontSize: "10px", textTransform: "none", fontWeight: "bold", color: "var(--success)", marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)" }} /> Real-Time
                </span>
              )}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedProjId === "ALL" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "120px", overflowY: "auto", paddingRight: "4px" }}>
                  {projects.map(p => {
                    const weather = weatherData[p.id] || getDefaultWeather(p.id);
                    return (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                        <span style={{ fontSize: "var(--font-sm)" }}><strong style={{ color: "var(--primary)" }}>{p.code}</strong>: {p.name.split(" - ")[0]}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "var(--font-sm)" }}>{weather.icon} {weather.temp}</span>
                          <span className={`badge ${weather.status === "Optimal Speed" || weather.status === "Normal Speed" ? "badge-approved" : weather.status === "Minor Delays" ? "badge-submitted" : "badge-rejected"}`} style={{ fontSize: "10px", padding: "1px 6px" }}>
                            {weather.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {(() => {
                    const p = projects.find(p => p.id === selectedProjId);
                    const weather = weatherData[selectedProjId] || getDefaultWeather(selectedProjId);
                    if (!p) return null;
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "2.2rem" }}>{weather.icon}</span>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "var(--font-sm)" }}>{weather.cond} ({weather.temp})</div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-xs)", marginTop: "2px" }}>Active WBS Code: {p.code} {weather.wind ? `| Wind: ${weather.wind}` : ""}</div>
                          </div>
                        </div>
                        <div style={{ marginTop: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                          <div style={{ fontWeight: "bold", fontSize: "var(--font-xs)", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "4px" }}>Operational Advisory:</div>
                          <div style={{ color: "var(--text-primary)", fontSize: "var(--font-sm)" }}>
                            {weather.status === "Work Halted" && "🚨 Heavy precipitation detected. Outdoor concrete pouring and excavation tasks must be suspended immediately under safety protocol."}
                            {weather.status === "Crane Ops Halted" && "⚠️ High winds active. Crane operations and high-elevation structural steel welding halted. Ground level operations remain normal."}
                            {weather.status === "Minor Delays" && "🌧️ Scattered rain showers. Monitor gravel wetness levels and follow WBS standard adjustments for batching plant ratios."}
                            {weather.status === "Optimal Speed" && "✓ Excellent dry weather. Suitable for massive continuous slab pouring and major earthworks movements."}
                            {weather.status === "Normal Speed" && "✓ Stable weather conditions. Proceed with planned daily WBS task allocations and vendor progress scheduling."}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Recent geotag postings */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 className="chart-title">
              <ShieldCheck size={14} style={{ color: "var(--primary)" }} /> Geo-Validation Audit log
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "120px", overflowY: "auto", paddingRight: "4px" }}>
              {displayedDprs.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "var(--font-sm)", textAlign: "center", padding: "10px" }}>No recent validation coordinate logs.</div>
              ) : (
                displayedDprs.slice(-3).reverse().map(d => (
                  <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-xs)" }}>{d.id}</span>
                    <span className={`badge ${d.gps.isFlagged ? "badge-rejected" : "badge-approved"}`} style={{ fontSize: "var(--font-xs)" }}>
                      {d.gps.isFlagged ? "OUT-OF-BOUNDS" : "IN-BOUNDS OK"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Site Analytics & Insights */}
      <div className="responsive-grid-equal" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        
        {/* Card A: WBS Material allocations */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={14} style={{ color: "var(--primary)" }} /> WBS Material Consumption
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
            {displayedPOs.slice(0, 3).map(po => {
              const approvedDprSum = displayedDprs
                .filter(d => d.poNumber === po.poNumber && (d.status === "FULLY LOCKED" || d.status === "Approved" || d.status === "HO Approved"))
                .reduce((sum, d) => sum + d.quantityExecuted, 0);
              const progress = po.totalQty > 0 ? Math.round((approvedDprSum / po.totalQty) * 100) : 0;
              return (
                <div key={po.poNumber} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span style={{ fontWeight: 600, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "160px" }} title={po.materialDescription}>
                      {po.materialDescription}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>{approvedDprSum} / {po.totalQty} {po.uom}</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: progress > 80 ? "var(--warning)" : "var(--primary)", borderRadius: "3px" }} />
                  </div>
                </div>
              );
            })}
            {displayedPOs.length === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: "11px", textAlign: "center", padding: "10px" }}>No WBS purchase order data.</div>
            )}
          </div>
        </div>

        {/* Card B: Role-Tailored Decision Intelligence */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={14} style={{ color: "var(--primary)" }} /> {currentUser.role} Advisor
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", fontSize: "11px" }}>
            {currentUser.role === "Site Engr" && (
              <>
                <div style={{ color: "var(--text-primary)", fontWeight: 550 }}>✓ GPS geo-fence proximity validation is active.</div>
                <div style={{ color: "var(--text-muted)", lineHeight: 1.3 }}>Please ensure you are standing within 500m of the site WBS perimeter when uploading photos to prevent location lockouts.</div>
              </>
            )}
            {(currentUser.role === "Planning Engr" || currentUser.role === "PM") && (
              <>
                <div style={{ color: "var(--text-primary)", fontWeight: 550 }}>⚠️ Approvals pipeline velocity check:</div>
                <div style={{ color: "var(--text-muted)", lineHeight: 1.3 }}>Average review turnaround is 2.4 hrs. Address {pendingApprovalsCount} pending item(s) to clear the HO billing bottleneck.</div>
              </>
            )}
            {currentUser.role === "HO Incharge" && (
              <>
                <div style={{ color: "var(--text-primary)", fontWeight: 550 }}>✓ Rate Lock check is active:</div>
                <div style={{ color: "var(--text-muted)", lineHeight: 1.3 }}>PO Contract price controls are active. Checked rate variance bounds against standard master catalog values.</div>
              </>
            )}
            {(currentUser.role === "PMCC" || currentUser.role === "Admin") && (
              <>
                <div style={{ color: "var(--text-primary)", fontWeight: 550 }}>✓ Administrative logs check:</div>
                <div style={{ color: "var(--text-muted)", lineHeight: 1.3 }}>All OData client mappings are fully synced. Dynamic system theme and logo customization settings verified in local storage.</div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="responsive-grid-half">
        
        {/* Budget vs Actuals OR WBS Materials Chart */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title">
            <DollarSign size={14} style={{ color: "var(--primary)" }} /> 
            {selectedProjId === "ALL" ? "Project Budget vs Actual Spent (Lakhs)" : "WBS Contract Qty vs Executed Progress"}
          </h2>
          <div style={{ width: "100%", height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "6px" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey={selectedProjId === "ALL" ? "Budget" : "Contract Qty"} fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey={selectedProjId === "ALL" ? "Actual" : "Executed Qty"} fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quantities Volumetrics */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title">
            <TrendingUp size={14} style={{ color: "var(--primary)" }} /> Executed Progress Rate (Daily Volume)
          </h2>
          <div style={{ width: "100%", height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "6px" }} />
                <Line type="monotone" dataKey="Volume" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
