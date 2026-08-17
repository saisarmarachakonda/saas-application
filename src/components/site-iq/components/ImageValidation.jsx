import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, AlertTriangle, Info, Clock, Copy, MapPin } from "lucide-react";
import { getDPRs, getProjects } from "../data/mockData";

export default function ImageValidation({ currentUser }) {
  const [dprs, setDPRs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedImageInfo, setSelectedImageInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    const rawDprs = getDPRs();
    const rawProjects = getProjects();

    // Filter projects based on user permissions
    const filteredProjects = currentUser.role === "PMCC" || currentUser.role === "HO Incharge" || currentUser.role === "Admin"
      ? rawProjects
      : rawProjects.filter(p => currentUser.projects.includes(p.id));

    const projectIds = filteredProjects.map(p => p.id);
    const filteredDprs = rawDprs.filter(d => projectIds.includes(d.projectId));

    setDPRs(filteredDprs);
    setProjects(filteredProjects);

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

  // Handle map updates on image selection
  useEffect(() => {
    if (!mapLoaded || !selectedImageInfo) return;

    const mapContainer = document.getElementById("audit-exif-map");
    if (!mapContainer) return;

    // Initialize Map if not present
    if (!mapRef.current) {
      const map = window.L.map("audit-exif-map").setView([selectedImageInfo.gps.lat, selectedImageInfo.gps.lng], 13);
      mapRef.current = map;

      const isDark = document.body.classList.contains("dark-theme-active");
      const tilesUrl = isDark 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      window.L.tileLayer(tilesUrl, {
        attribution: "CartoDB / OSM"
      }).addTo(map);
    }

    const mapInstance = mapRef.current;

    // Clear old elements
    elementsRef.current.forEach(el => mapInstance.removeLayer(el));
    elementsRef.current = [];

    const { lat, lng, isFlagged } = selectedImageInfo.gps;
    mapInstance.setView([lat, lng], 13);

    const proj = projects.find(p => p.id === selectedImageInfo.projectId);
    if (proj) {
      // Circle fence
      const fenceCircle = window.L.circle([proj.latitude, proj.longitude], {
        radius: proj.radiusMeters,
        color: "var(--primary)",
        fillColor: "var(--primary)",
        fillOpacity: 0.05,
        weight: 1
      }).addTo(mapInstance);
      elementsRef.current.push(fenceCircle);

      // Project Center Marker
      const projIcon = window.L.divIcon({
        className: "custom-proj-audit-marker",
        html: `<div style="background-color: var(--primary); width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid white;"></div>`,
        iconSize: [10, 10]
      });
      const projMarker = window.L.marker([proj.latitude, proj.longitude], { icon: projIcon })
        .addTo(mapInstance)
        .bindPopup(`<strong>Project Site Bounds</strong><br/>${proj.name}`);
      elementsRef.current.push(projMarker);

      // Photo Pin Marker
      const photoColor = isFlagged ? "var(--status-rejected)" : "var(--status-approved)";
      const pulseClass = isFlagged ? "pulse-red" : "";
      const photoIcon = window.L.divIcon({
        className: "custom-photo-audit-marker",
        html: `<div class="${pulseClass}" style="background-color: ${photoColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.35);"></div>`,
        iconSize: [12, 12]
      });
      const photoMarker = window.L.marker([lat, lng], { icon: photoIcon })
        .addTo(mapInstance)
        .bindPopup(`<strong>Photo Pin: ${selectedImageInfo.dprId}</strong><br/>Captured: ${selectedImageInfo.timestamp}`);
      elementsRef.current.push(photoMarker);

      // Connect with dotted line if flagged out of bounds
      if (isFlagged) {
        const polyline = window.L.polyline([
          [proj.latitude, proj.longitude],
          [lat, lng]
        ], {
          color: "var(--status-rejected)",
          weight: 1.5,
          dashArray: "4, 6"
        }).addTo(mapInstance);
        elementsRef.current.push(polyline);
      }
    }

  }, [mapLoaded, selectedImageInfo, projects]);

  const allImages = [];
  dprs.forEach(d => {
    if (d.images && d.images.length > 0) {
      d.images.forEach((img, index) => {
        allImages.push({
          ...img,
          dprId: d.id,
          projectId: d.projectId,
          reportedDate: d.reportedDate,
          subDate: d.subDate,
          id: `${d.id}-img-${index}`
        });
      });
    }
  });

  const checkDuplicate = (url, currentDprId) => {
    const matches = dprs.filter(d => d.id !== currentDprId && d.images && d.images.some(img => img.url === url));
    return matches.length > 0 ? { isDuplicate: true, firstDprId: matches[0].id } : { isDuplicate: false };
  };

  const checkTimeMismatch = (imgTime, dprSubTime) => {
    const imgDate = imgTime.substring(0, 10);
    const subDate = dprSubTime.substring(0, 10);
    return imgDate !== subDate;
  };

  const handleSelectImage = (img) => {
    const proj = projects.find(p => p.id === img.projectId);
    const duplicateStatus = checkDuplicate(img.url, img.dprId);
    const timeMismatch = checkTimeMismatch(img.timestamp, img.subDate);
    
    const cameraMocks = [
      { camera: "Apple iPhone 15 Pro", lens: "24mm f/1.78", exposure: "1/250s ISO 64" },
      { camera: "Samsung Galaxy S24 Ultra", lens: "23mm f/1.7", exposure: "1/320s ISO 50" },
      { camera: "DJI Mavic Pro 3 Drone", lens: "24mm f/2.8", exposure: "1/400s ISO 100" }
    ];
    const cameraIdx = img.url.length % cameraMocks.length;
    const exifCamera = cameraMocks[cameraIdx];

    setSelectedImageInfo({
      ...img,
      projectCode: proj?.code,
      projectName: proj?.name,
      camera: exifCamera.camera,
      lens: exifCamera.lens,
      exposure: exifCamera.exposure,
      resolution: "4032 × 3024 (12.2 MP)",
      fileSize: "2.4 MB",
      duplicateStatus,
      timeMismatch
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Geo-tagged Image Validation</h1>
          <p>Audit site photos, check dynamic coordinates offsets, and run duplicate file fraud filters</p>
        </div>
      </div>

      <div className="responsive-grid-equal">
        
        {/* Photo Gallery Grid */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title">
            Site Image Stream ({allImages.length})
          </h2>

          {allImages.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--font-sm)" }}>
              No images uploaded yet. Create and submit a DPR to see images here.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "12px", maxHeight: "550px", overflowY: "auto", paddingRight: "4px" }}>
              {allImages.map(img => {
                const isSelected = selectedImageInfo?.id === img.id;
                const isFlagged = img.gps?.isFlagged || checkDuplicate(img.url, img.dprId).isDuplicate;
                
                return (
                  <div 
                    key={img.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: "6px", 
                      cursor: "pointer", 
                      borderColor: isSelected ? "var(--primary)" : "var(--border-color)",
                      borderWidth: isSelected ? "2px" : "1px"
                    }}
                    onClick={() => handleSelectImage(img)}
                  >
                    <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: "var(--radius-sm)" }}>
                      <img src={img.url} alt="Site attachment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: "var(--font-xs)", marginTop: "6px", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                      <span>{img.dprId}</span>
                      {isFlagged && (
                        <span style={{ color: "var(--danger)" }}>⚠️ Alert</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Inspector Panel */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h2 className="chart-title">
            EXIF & Verification Inspector
          </h2>

          {selectedImageInfo ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Photo Display with Watermark */}
              <div className="watermark-overlay-container" style={{ marginBottom: "12px" }}>
                <img src={selectedImageInfo.url} alt="Selected Audit" />
                <div className="watermark-text">
                  ISPRP GEO-VALIDATOR DATA<br/>
                  PROJECT: {selectedImageInfo.projectCode}<br/>
                  EXIF TIME: {selectedImageInfo.timestamp}<br/>
                  GPS TAGS: {selectedImageInfo.gps.lat}, {selectedImageInfo.gps.lng}
                </div>
              </div>

              {/* Status validation checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div className={`validation-indicator ${selectedImageInfo.gps.isFlagged ? "danger" : "success"}`} style={{ margin: 0, padding: "8px 12px" }}>
                  {selectedImageInfo.gps.isFlagged ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  <div style={{ fontSize: "var(--font-sm)" }}>
                    <strong>Boundary Check:</strong> {selectedImageInfo.gps.isFlagged ? "Flagged: Outside site boundary!" : "Verified: Within site boundary (Pass)"}
                  </div>
                </div>

                <div className={`validation-indicator ${selectedImageInfo.duplicateStatus.isDuplicate ? "danger" : "success"}`} style={{ margin: 0, padding: "8px 12px" }}>
                  {selectedImageInfo.duplicateStatus.isDuplicate ? <Copy size={14} /> : <ShieldCheck size={14} />}
                  <div style={{ fontSize: "var(--font-sm)" }}>
                    <strong>Fraud Check:</strong> {selectedImageInfo.duplicateStatus.isDuplicate ? `Alert: Reused photo from ${selectedImageInfo.duplicateStatus.firstDprId}` : "Verified: Unique image token (Pass)"}
                  </div>
                </div>

                <div className={`validation-indicator ${selectedImageInfo.timeMismatch ? "warning" : "success"}`} style={{ margin: 0, padding: "8px 12px" }}>
                  {selectedImageInfo.timeMismatch ? <Clock size={14} /> : <ShieldCheck size={14} />}
                  <div style={{ fontSize: "var(--font-sm)" }}>
                    <strong>Timestamp Check:</strong> {selectedImageInfo.timeMismatch ? "Warning: Photo time deviates from entry date" : "Verified: Timestamps align (Pass)"}
                  </div>
                </div>
              </div>

              {/* Live Geotag Map for Selected Image */}
              <div>
                <div style={{ fontSize: "var(--font-xs)", fontWeight: "bold", color: "var(--text-secondary)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={12} style={{ color: "var(--primary)" }} /> Dynamic Geotag Location Map
                </div>
                <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                  <div id="audit-exif-map" style={{ width: "100%", height: "100%", zIndex: 1 }}></div>
                  {!mapLoaded && (
                    <div style={{ position: "absolute", inset: 0, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-sm)", color: "var(--text-muted)", zIndex: 2 }}>
                      Loading audit map...
                    </div>
                  )}
                </div>
              </div>

              {/* EXIF Data Panel */}
              <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", fontSize: "var(--font-sm)" }}>
                <h3 style={{ fontWeight: "bold", color: "var(--primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "4px", marginBottom: "8px" }}>
                  Image File EXIF Data
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Camera Brand:</span>
                    <span style={{ fontWeight: 600 }}>{selectedImageInfo.camera}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Lens Parameter:</span>
                    <span style={{ fontWeight: 600 }}>{selectedImageInfo.lens}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Exposure Rate:</span>
                    <span style={{ fontWeight: 600 }}>{selectedImageInfo.exposure}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Dimension:</span>
                    <span style={{ fontWeight: 600 }}>{selectedImageInfo.resolution}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>File Size:</span>
                    <span style={{ fontWeight: 600 }}>{selectedImageInfo.fileSize}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px", borderTop: "1px solid var(--border-color)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Linked Project:</span>
                    <span style={{ fontWeight: 600 }}>{selectedImageInfo.projectName}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "100px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--font-sm)" }}>
              <ShieldCheck size={36} style={{ margin: "0 auto 10px auto", opacity: 0.4 }} />
              <p>Select any thumbnail image from the stream to inspect detailed EXIF tags, GPS metadata, and security validation flags.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
