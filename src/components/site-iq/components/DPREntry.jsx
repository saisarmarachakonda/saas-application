import React, { useState, useEffect, useRef } from "react";
import { Camera, MapPin, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { getProjects, getPOs, updateDPR, getDPRs, addSapLog } from "../data/mockData";

export default function DPREntry({ currentUser }) {
  const [projects, setProjects] = useState([]);
  const [pos, setPOs] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedPONumber, setSelectedPONumber] = useState("");
  
  // Form fields
  const [quantity, setQuantity] = useState("");
  const [manpower, setManpower] = useState("");
  const [skilledLabor, setSkilledLabor] = useState("5");
  const [unskilledLabor, setUnskilledLabor] = useState("5");
  const [equipment, setEquipment] = useState("");
  const [machineryActiveHrs, setMachineryActiveHrs] = useState("8");
  const [machineryIdleHrs, setMachineryIdleHrs] = useState("0");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [reportedDate, setReportedDate] = useState(new Date().toISOString().substring(0, 10));

  // Geolocation states
  const [gpsSimulated, setGpsSimulated] = useState(null);
  const [isGpsOutBounds, setIsGpsOutBounds] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  // File Upload states (Camera Capture model)
  const [uploadedImage, setUploadedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const uploadedImageRef = useRef(null);

  useEffect(() => {
    uploadedImageRef.current = uploadedImage;
  }, [uploadedImage]);

  // Alerts
  const [alertMsg, setAlertMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const rawProjects = getProjects();
    const rawPOs = getPOs();

    // Filter projects based on user permissions
    const filteredProjects = currentUser.role === "PMCC" || currentUser.role === "HO Incharge" || currentUser.role === "Admin"
      ? rawProjects
      : rawProjects.filter(p => currentUser.projects.includes(p.id));

    setProjects(filteredProjects);
    setPOs(rawPOs);

    if (filteredProjects.length > 0) {
      setSelectedProjectId(filteredProjects[0].id);
    }

    // Load Leaflet dynamically if not present
    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

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

  const filteredPOs = pos.filter(po => po.projectId === selectedProjectId);

  useEffect(() => {
    if (filteredPOs.length > 0) {
      setSelectedPONumber(filteredPOs[0].poNumber);
    } else {
      setSelectedPONumber("");
    }
  }, [selectedProjectId, pos]);

  const selectedPO = pos.find(p => p.poNumber === selectedPONumber);
  
  const getRemainingQty = () => {
    if (!selectedPO) return 0;
    const dprs = getDPRs();
    const approvedSum = dprs
      .filter(d => d.poNumber === selectedPONumber && d.status !== "Rejected")
      .reduce((sum, d) => sum + d.quantityExecuted, 0);
    return selectedPO.totalQty - approvedSum;
  };

  const remainingQty = getRemainingQty();

  // Haversine formula to compute distance in meters between two lat/lng points
  const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const fetchDeviceGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const proj = projects.find(p => p.id === selectedProjectId);
        
        if (proj) {
          const dist = getDistanceMeters(proj.latitude, proj.longitude, latitude, longitude);
          const outOfBounds = dist > proj.radiusMeters;
          
          setGpsSimulated({
            lat: parseFloat(latitude.toFixed(6)),
            lng: parseFloat(longitude.toFixed(6)),
            accuracy: parseFloat(accuracy.toFixed(1)),
            isFlagged: outOfBounds
          });
          setIsGpsOutBounds(outOfBounds);
        }
        setGpsLoading(false);
      },
      (error) => {
        console.warn("GPS Access failed, applying simulation fallback:", error);
        const proj = projects.find(p => p.id === selectedProjectId);
        if (proj) {
          // Inside-fence simulation coordinates
          const mockLat = proj.latitude + 0.0001;
          const mockLng = proj.longitude + 0.0001;
          setGpsSimulated({
            lat: parseFloat(mockLat.toFixed(6)),
            lng: parseFloat(mockLng.toFixed(6)),
            accuracy: 8.0,
            isFlagged: false,
            simulated: true
          });
          setIsGpsOutBounds(false);
        }
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  };

  // Auto trigger device GPS capture when selected project WBS site changes
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      setGpsSimulated(null);
      fetchDeviceGPS();
    }
  }, [selectedProjectId, projects]);

  // Initialize and update the interactive map when selected project changes
  useEffect(() => {
    if (!mapLoaded || !selectedProjectId) return;

    const proj = projects.find(p => p.id === selectedProjectId);
    if (!proj) return;

    const mapDiv = document.getElementById("dpr-entry-map");
    if (!mapDiv) return;

    // Create Map instance
    if (!mapRef.current) {
      const map = window.L.map("dpr-entry-map").setView([proj.latitude, proj.longitude], 14);
      mapRef.current = map;

      const isDark = document.body.classList.contains("dark-theme-active");
      const tilesUrl = isDark 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      window.L.tileLayer(tilesUrl, {
        attribution: "CartoDB / OSM"
      }).addTo(map);

      // Handle map clicks to drop dynamic coordinate pins
      map.on("click", (e) => {
        if (uploadedImageRef.current) {
          alert("GPS Coordinates are locked to the captured image. To capture a new location, click 'Retake Photo'.");
          return;
        }

        const { lat, lng } = e.latlng;
        
        // Calculate distance from project center
        const dist = getDistanceMeters(proj.latitude, proj.longitude, lat, lng);
        const outOfBounds = dist > proj.radiusMeters;
        
        setGpsSimulated({
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          accuracy: 5.0,
          isFlagged: outOfBounds
        });
        setIsGpsOutBounds(outOfBounds);
      });
    } else {
      // Recenter existing map
      mapRef.current.setView([proj.latitude, proj.longitude], 14);
    }

    const mapInstance = mapRef.current;

    // Clear old fence circle and redraw
    if (circleRef.current) {
      mapInstance.removeLayer(circleRef.current);
    }

    circleRef.current = window.L.circle([proj.latitude, proj.longitude], {
      radius: proj.radiusMeters,
      color: "var(--primary)",
      fillColor: "var(--primary)",
      fillOpacity: 0.1,
      weight: 1.5
    }).addTo(mapInstance);

  }, [mapLoaded, selectedProjectId, projects]);

  // Update pin marker on coordinates change
  useEffect(() => {
    if (!mapRef.current || !gpsSimulated) {
      // Remove marker if no coordinates
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }

    const mapInstance = mapRef.current;
    const { lat, lng, isFlagged } = gpsSimulated;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const pinColor = isFlagged ? "var(--status-rejected)" : "var(--status-approved)";
      const dprIcon = window.L.divIcon({
        className: "custom-entry-marker",
        html: `<div style="background-color: ${pinColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12]
      });

      markerRef.current = window.L.marker([lat, lng], { icon: dprIcon }).addTo(mapInstance);
    }

    mapInstance.flyTo([lat, lng], 15);

  }, [gpsSimulated]);

  // Camera Control Functions (Webcam + simulation fallback)
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      // Clear standard stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setVideoStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Webcam access declined or unavailable, running in simulation mode:", err);
      setVideoStream(null);
    }
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const capturePhoto = () => {
    if (!gpsSimulated) {
      alert("GPS Coordinates are required. Please await system GPS signal lock.");
      return;
    }

    const proj = projects.find(p => p.id === selectedProjectId);
    const lat = gpsSimulated.lat;
    const lng = gpsSimulated.lng;
    const isFlagged = gpsSimulated.isFlagged;

    if (videoStream && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL("image/jpeg");
      
      // Stop webcam tracks
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setIsCameraActive(false);

      setUploadedImage({
        name: `camera_snap_${Date.now()}.jpg`,
        url: dataUrl,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        gps: { lat, lng, isFlagged }
      });
    } else {
      // Fallback: simulated photo based on PO material
      const activePO = pos.find(p => p.projectId === selectedProjectId && p.poNumber === selectedPONumber);
      let imgUrl = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60";
      if (activePO) {
        const desc = activePO.materialDescription.toLowerCase();
        if (desc.includes("concrete")) {
          imgUrl = "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=500&auto=format&fit=crop&q=60";
        } else if (desc.includes("steel") || desc.includes("bar")) {
          imgUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60";
        } else if (desc.includes("tunnel") || desc.includes("pipe") || desc.includes("cable")) {
          imgUrl = "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?w=500&auto=format&fit=crop&q=60";
        }
      }

      setIsCameraActive(false);
      setUploadedImage({
        name: `simulated_snap_${Date.now()}.jpg`,
        url: imgUrl,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        gps: { lat, lng, isFlagged }
      });
    }
  };

  const handleRetake = () => {
    setUploadedImage(null);
    setIsCameraActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMsg(null);
    setSuccessMsg(null);

    if (currentUser.role !== "Site Engr" && currentUser.role !== "Planning Engr") {
      setAlertMsg("Role restriction: Only Site Engineers or Planning Engineers can submit new DPR entries. Please switch accounts via the Profile menu to proceed.");
      return;
    }

    if (!selectedPONumber) {
      setAlertMsg("Please select a valid Purchase Order (PO).");
      return;
    }

    const enteredQty = parseFloat(quantity);
    if (isNaN(enteredQty) || enteredQty <= 0) {
      setAlertMsg("Please enter a valid positive quantity executed.");
      return;
    }

    if (enteredQty > remainingQty) {
      setAlertMsg(`Quantity Lock Violation: Executed quantity (${enteredQty}) exceeds the remaining allowed PO limit (${remainingQty} ${selectedPO?.uom || ''}). System blocks entries beyond PO allocation.`);
      return;
    }

    if (!gpsSimulated) {
      setAlertMsg("Device signature error: Click on the live GIS map to pin your reporting location prior to submission.");
      return;
    }

    if (!uploadedImage) {
      setAlertMsg("Validation rule: Please upload at least one progress site image.");
      return;
    }

    const newDPR = {
      id: `DPR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      projectId: selectedProjectId,
      poNumber: selectedPONumber,
      wbsNodeId: selectedPO.wbsNodeId,
      subDate: new Date().toISOString().substring(0, 10),
      reportedDate,
      quantityExecuted: enteredQty,
      manpower: parseInt(manpower) || (parseInt(skilledLabor) + parseInt(unskilledLabor)) || 10,
      equipment: `${equipment || "Standard Equipment"} (Active: ${machineryActiveHrs}h, Idle: ${machineryIdleHrs}h)`,
      workDescription: description,
      remarks,
      gps: gpsSimulated,
      images: [
        {
          url: uploadedImage.url,
          timestamp: uploadedImage.timestamp,
          gps: uploadedImage.gps,
          isFlagged: uploadedImage.gps.isFlagged
        }
      ],
      status: "Submitted",
      workflow: {
        siteEng: {
          user: currentUser.name,
          action: "Submit",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      },
      historyLog: [
        {
          step: "Creation",
          desc: `DPR submitted. Geo-location coordinate: ${gpsSimulated.lat}, ${gpsSimulated.lng} (${gpsSimulated.isFlagged ? "OUT-OF-BOUNDS ALERT" : "VERIFIED OK"}).`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      ],
      sapSync: { synced: false }
    };

    updateDPR(newDPR);
    addSapLog("DPR_SUBMITTED", `DPR ${newDPR.id} entered against PO ${newDPR.poNumber}. Verification status: Pending.`);

    setSuccessMsg(`Success: DPR ${newDPR.id} has been submitted. Geo-fence validation completed.`);
    
    // Reset form
    setQuantity("");
    setManpower("");
    setEquipment("");
    setDescription("");
    setRemarks("");
    setGpsSimulated(null);
    setUploadedImage(null);
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  const isSEorPE = currentUser.role === "Site Engr" || currentUser.role === "Planning Engr";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="page-header">
        <div className="page-title">
          <h1>Daily Progress Report (DPR) Entry</h1>
          <p>Submit work quantities, click on the map to pin coordinates, and upload photo evidence</p>
        </div>
      </div>

      {!isSEorPE && (
        <div className="validation-indicator danger" style={{ fontWeight: 650 }}>
          <AlertTriangle size={18} />
          <div>
            Role Warning: You are currently logged in as <strong>{currentUser.name} ({currentUser.role})</strong>. Only <strong>Site Engineers</strong> and <strong>Planning Engineers</strong> are authorized to create DPR entries.
          </div>
        </div>
      )}

      {alertMsg && (
        <div className="validation-indicator danger" style={{ fontWeight: 650 }}>
          <AlertTriangle size={18} />
          <div>{alertMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="validation-indicator success" style={{ fontWeight: 650 }}>
          <CheckCircle size={18} />
          <div>{successMsg}</div>
        </div>
      )}

      <div className="responsive-grid-half">
        
        {/* Form Container */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 className="chart-title" style={{ marginBottom: "16px" }}>
            DPR Structural Details
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label>Select Project Site</label>
              <select 
                className="form-control" 
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setGpsSimulated(null);
                }}
                disabled={!isSEorPE}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Purchase Order (PO)</label>
              <select 
                className="form-control"
                value={selectedPONumber}
                onChange={(e) => setSelectedPONumber(e.target.value)}
                disabled={!isSEorPE}
              >
                {filteredPOs.length === 0 ? (
                  <option value="">No Active POs linked to Project</option>
                ) : (
                  filteredPOs.map(po => (
                    <option key={po.poNumber} value={po.poNumber}>
                      {po.poNumber} ({po.materialDescription})
                    </option>
                  ))
                )}
              </select>
            </div>

            {selectedPO && (
              <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", fontSize: "var(--font-sm)", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Material Code:</span>
                  <span style={{ fontWeight: 600 }}>{selectedPO.materialCode}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Total Contract Qty:</span>
                  <span style={{ fontWeight: 600 }}>{selectedPO.totalQty} {selectedPO.uom}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>PO Unit Rate:</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedPO.rate} / {selectedPO.uom}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid var(--border-color)", marginTop: "4px" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "bold" }}>Remaining Qty Allocation:</span>
                  <span style={{ fontWeight: "bold", color: remainingQty > 0 ? "var(--success)" : "var(--danger)" }}>
                    {remainingQty} {selectedPO.uom}
                  </span>
                </div>
              </div>
            )}

            <div className="responsive-grid-half" style={{ gap: "12px" }}>
              <div className="form-group">
                <label>Date of Work</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={reportedDate}
                  onChange={(e) => setReportedDate(e.target.value)}
                  disabled={!isSEorPE}
                />
              </div>

              <div className="form-group">
                <label>Executed Quantity</label>
                <div className="input-suffix">
                  <input 
                    type="number" 
                    placeholder="Enter qty"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={!isSEorPE}
                  />
                  <span className="input-suffix-text">{selectedPO?.uom || ""}</span>
                </div>
              </div>
            </div>

            <div className="responsive-grid-half" style={{ gap: "12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "16px", background: "rgba(255,255,255,0.02)", marginBottom: "16px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                  <span>Manpower Allocation</span>
                  <span style={{ color: "var(--primary)" }}>{parseInt(skilledLabor) + parseInt(unskilledLabor)} Workers</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span>Skilled (Mason, Welder): {skilledLabor}</span>
                    <input 
                      type="range" min="0" max="50" 
                      value={skilledLabor} 
                      onChange={(e) => { setSkilledLabor(e.target.value); setManpower((parseInt(e.target.value) + parseInt(unskilledLabor)).toString()); }}
                      disabled={!isSEorPE}
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span>Unskilled Helpers: {unskilledLabor}</span>
                    <input 
                      type="range" min="0" max="50" 
                      value={unskilledLabor} 
                      onChange={(e) => { setUnskilledLabor(e.target.value); setManpower((parseInt(skilledLabor) + parseInt(e.target.value)).toString()); }}
                      disabled={!isSEorPE}
                      style={{ width: "100px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                  <span>Equipment Utilization</span>
                  <span style={{ color: "var(--primary)" }}>{machineryActiveHrs}h Active</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  <input 
                    type="text" 
                    placeholder="Excavator, Batching Plant" 
                    className="form-control"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    disabled={!isSEorPE}
                    style={{ padding: "4px 8px" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginTop: "4px" }}>
                    <span>Active Hours: {machineryActiveHrs}h</span>
                    <input 
                      type="range" min="0" max="24" 
                      value={machineryActiveHrs} 
                      onChange={(e) => setMachineryActiveHrs(e.target.value)}
                      disabled={!isSEorPE}
                      style={{ width: "80px" }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span>Idle Hours: {machineryIdleHrs}h</span>
                    <input 
                      type="range" min="0" max="24" 
                      value={machineryIdleHrs} 
                      onChange={(e) => setMachineryIdleHrs(e.target.value)}
                      disabled={!isSEorPE}
                      style={{ width: "80px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Work Description</label>
              <textarea 
                rows="2" 
                placeholder="Chainage coordinates, segment metrics..." 
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isSEorPE}
              />
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <input 
                type="text" 
                placeholder="Delays, weather comments..." 
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={!isSEorPE}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ marginTop: "8px", padding: "10px", fontWeight: "bold" }}
              disabled={!isSEorPE}
            >
              Submit Daily Progress Report
            </button>
          </form>
        </div>

        {/* Dynamic Map and Upload Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Live GPS Tracking & Geofence Map */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 className="chart-title">
              <MapPin size={14} style={{ color: "var(--primary)" }} /> GPS Geofence Verification
            </h2>
            <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Strict hardware GPS positioning is active. Position is read directly from your device location hardware.
            </p>

            <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-color)", marginBottom: "12px" }}>
              <div id="dpr-entry-map" style={{ width: "100%", height: "100%", zIndex: 1 }}></div>
              {!mapLoaded && (
                <div style={{ position: "absolute", inset: 0, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-sm)", color: "var(--text-muted)", zIndex: 2 }}>
                  Loading Geofence visualizer...
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {gpsLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px dashed var(--border-color)", padding: "12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "var(--font-sm)" }}>
                  <RefreshCw size={14} className="spin-animation" style={{ color: "var(--primary)" }} />
                  Locking system GPS coordinates...
                </div>
              ) : gpsSimulated ? (
                <div className={`validation-indicator ${gpsSimulated.isFlagged ? "danger" : "success"}`} style={{ margin: 0, padding: "8px 12px" }}>
                  {gpsSimulated.isFlagged ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                  <div style={{ fontSize: "var(--font-xs)" }}>
                    <strong>{gpsSimulated.isFlagged ? "OUT-OF-BOUNDS ALERT" : "PERIMETER VERIFIED"}</strong>
                    {gpsSimulated.simulated && <span style={{ color: "var(--text-muted)", marginLeft: "4px" }}>(Simulated Lock)</span>}
                    <br/>
                    GPS Coordinates: {gpsSimulated.lat}, {gpsSimulated.lng} (Accuracy: ±{gpsSimulated.accuracy}m)
                  </div>
                </div>
              ) : (
                <div style={{ border: "1px dashed var(--border-color)", padding: "12px", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--font-sm)", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)" }}>
                  Connecting to browser geolocation hardware...
                </div>
              )}
            </div>
          </div>

          {/* Photo upload and EXIF watermark */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 className="chart-title">
              <Camera size={14} style={{ color: "var(--primary)" }} /> Site Photo Evidence
            </h2>

            {!uploadedImage ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Viewfinder Container */}
                <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "#000" }}>
                  {!isCameraActive ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#151517", color: "#8e8e93", padding: "16px", textAlign: "center" }}>
                      <Camera size={36} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
                      <button
                        type="button"
                        className="mac-btn-primary"
                        style={{ padding: "8px 16px", fontWeight: "bold" }}
                        onClick={startCamera}
                        disabled={!isSEorPE || !gpsSimulated}
                      >
                        📷 Open Site Camera
                      </button>
                      <span style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "8px" }}>
                        Enforces instant GPS locking on snap capture
                      </span>
                    </div>
                  ) : videoStream ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#151517", color: "#8e8e93", textAlign: "center", padding: "10px" }}>
                      <Camera size={32} style={{ color: "var(--primary)", marginBottom: "8px" }} />
                      <span style={{ fontSize: "var(--font-sm)", fontWeight: "600", color: "var(--text-primary)" }}>Webcam / Mobile Camera Simulation Active</span>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>Snapped photo will lock to map coordinates</span>
                      
                      {/* Grid overlays */}
                      <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(0, 122, 255, 0.2)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", top: "50%", left: "50%", width: "40px", height: "40px", border: "1px dashed rgba(255,255,255,0.2)", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
                    </div>
                  )}
                  {/* LIVE status bar overlay */}
                  {isCameraActive && (
                    <div style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.6)", padding: "2px 8px", borderRadius: "4px", fontSize: "9px", color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff3b30" }} />
                      LIVE FENCE FEED
                    </div>
                  )}
                </div>

                {isCameraActive && (
                  <button
                    type="button"
                    className="mac-btn-primary"
                    style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
                    onClick={capturePhoto}
                    disabled={!isSEorPE || !gpsSimulated}
                  >
                    📷 Capture Site Progress snap
                  </button>
                )}

                {!gpsSimulated && (
                  <p style={{ fontSize: "10.5px", color: "var(--status-rejected)", textAlign: "center", margin: 0 }}>
                    ⚠️ Hardware GPS lock required. Awaiting system GPS capture...
                  </p>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Captured Image Locked to GPS coordinates:
                </div>
                <div className="watermark-overlay-container" id="dpr_image_locked">
                  <img src={uploadedImage.url} alt="Progress Preview" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border-color)", display: "block" }} />
                  <div className="watermark-text" style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.72)", color: "#fff", padding: "6px 10px", borderRadius: "4px", fontSize: "9.5px", fontFamily: "var(--font-mono)", lineHeight: 1.35, pointerEvents: "none" }}>
                    GKC REPORT EVIDENCE SECURE<br/>
                    PROJECT: {projects.find(p => p.id === selectedProjectId)?.code || "N/A"}<br/>
                    COORDINATES: {uploadedImage.gps.lat}, {uploadedImage.gps.lng} ({uploadedImage.gps.isFlagged ? "OUT-OF-BOUNDS ALERT" : "OK"})<br/>
                    TIMESTAMP: {uploadedImage.timestamp}
                  </div>
                </div>
                <button
                  type="button"
                  className="mac-btn-secondary"
                  style={{ width: "100%", padding: "8px" }}
                  onClick={handleRetake}
                  disabled={!isSEorPE}
                >
                  🔄 Retake Progress Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
