// Mock Database for Integrated Site Progress Reporting Platform (ISPRP)

const DEFAULT_PROJECTS = [
  {
    id: "PROJ-001",
    name: "Mumbai Metro Line 3",
    code: "MUM-MET-03",
    location: "Colaba-Bandra-SEEPZ, Mumbai",
    latitude: 18.9400,
    longitude: 72.8250,
    radiusMeters: 500, // Geo-fence radius
    budget: 230000000, // 23 Cr
    wbsNodes: [
      { id: "MUM-WBS-01", name: "Tunneling Segment A", budget: 120000000 },
      { id: "MUM-WBS-02", name: "Station Box Construction", budget: 80000000 },
      { id: "MUM-WBS-03", name: "Track Laying & Electrification", budget: 30000000 }
    ]
  },
  {
    id: "PROJ-002",
    name: "Bangalore Airport Terminal 2",
    code: "BLR-APT-02",
    location: "Devanahalli, Bangalore",
    latitude: 13.2008,
    longitude: 77.7088,
    radiusMeters: 1000,
    budget: 450000000, // 45 Cr
    wbsNodes: [
      { id: "BLR-WBS-01", name: "Piling & Foundation Works", budget: 150000000 },
      { id: "BLR-WBS-02", name: "Glass Facade & Structure", budget: 200000000 },
      { id: "BLR-WBS-03", name: "HVAC & Fit-outs", budget: 100000000 }
    ]
  },
  {
    id: "PROJ-003",
    name: "Delhi-Vadodara Expressway Link",
    code: "DEL-VAD-EX",
    location: "Section 4, Rajasthan Border",
    latitude: 26.9124,
    longitude: 75.7873,
    radiusMeters: 2000,
    budget: 380000000,
    wbsNodes: [
      { id: "DVE-WBS-01", name: "Earthwork & Embankment", budget: 100000000 },
      { id: "DVE-WBS-02", name: "Granular Sub-base (GSB)", budget: 120000000 },
      { id: "DVE-WBS-03", name: "Asphalt Laying & Paving", budget: 160000000 }
    ]
  },
  {
    id: "PROJ-004",
    name: "Vizag Port Modernization",
    code: "VZG-PRT-MOD",
    location: "Outer Harbour, Visakhapatnam",
    latitude: 17.6868,
    longitude: 83.2185,
    radiusMeters: 800,
    budget: 180000000,
    wbsNodes: [
      { id: "VZG-WBS-01", name: "Jetty Extension Concrete Work", budget: 90000000 },
      { id: "VZG-WBS-02", name: "Dredging Operations", budget: 50000000 },
      { id: "VZG-WBS-03", name: "Crane Rail System Grouting", budget: 40000000 }
    ]
  },
  {
    id: "PROJ-005",
    name: "Kochi Smart City Infra",
    code: "KOC-SMC-INF",
    location: "Kakkanad, Kochi",
    latitude: 9.9816,
    longitude: 76.2999,
    radiusMeters: 600,
    budget: 120000000,
    wbsNodes: [
      { id: "KOC-WBS-01", name: "Utility Ducts Trenching", budget: 40000000 },
      { id: "KOC-WBS-02", name: "Smart Pole Erection", budget: 30000000 },
      { id: "KOC-WBS-03", name: "11KV Substation SiteIQ", budget: 50000000 }
    ]
  },
  {
    id: "PROJ-006",
    name: "Chennai Desalination Plant",
    code: "CHN-DES-PLT",
    location: "Nemmeli, Chennai",
    latitude: 12.7028,
    longitude: 80.2213,
    radiusMeters: 400,
    budget: 290000000,
    wbsNodes: [
      { id: "CHN-WBS-01", name: "Marine Intake Pipe Laying", budget: 110000000 },
      { id: "CHN-WBS-02", name: "RO Building Construction", budget: 120000000 },
      { id: "CHN-WBS-03", name: "Product Water Tanks (2 Nos)", budget: 60000000 }
    ]
  },
  {
    id: "PROJ-007",
    name: "Hyderabad Ring Road Flyover",
    code: "HYD-RRD-FL",
    location: "Gachibowli, Hyderabad",
    latitude: 17.4483,
    longitude: 78.3741,
    radiusMeters: 1200,
    budget: 310000000,
    wbsNodes: [
      { id: "HYD-WBS-01", name: "Pillar Pier Erection", budget: 140000000 },
      { id: "HYD-WBS-02", name: "Precast Girder Launching", budget: 110000000 },
      { id: "HYD-WBS-03", name: "Deck Slab Concrete & Finish", budget: 60000000 }
    ]
  },
  {
    id: "PROJ-008",
    name: "Kolkata Metro Extension EW",
    code: "KOL-MET-EW",
    location: "Salt Lake Sector V, Kolkata",
    latitude: 22.5735,
    longitude: 88.4331,
    radiusMeters: 750,
    budget: 420000000,
    wbsNodes: [
      { id: "KOL-WBS-01", name: "Tunnel Boring Machine Segment", budget: 230000000 },
      { id: "KOL-WBS-02", name: "Underground Station Civil Works", budget: 130000000 },
      { id: "KOL-WBS-03", name: "Track Bed Concrete & Rails", budget: 60000000 }
    ]
  },
  {
    id: "PROJ-009",
    name: "Ahmedabad Bullet Train Station",
    code: "AHM-BLT-STN",
    location: "Kalupur Area, Ahmedabad",
    latitude: 23.0298,
    longitude: 72.6001,
    radiusMeters: 1500,
    budget: 550000000,
    wbsNodes: [
      { id: "AHM-WBS-01", name: "Substructure & Piling Base", budget: 200000000 },
      { id: "AHM-WBS-02", name: "Steel Girder Framework", budget: 220000000 },
      { id: "AHM-WBS-03", name: "Platform Deck Slab & Glazing", budget: 130000000 }
    ]
  },
  {
    id: "PROJ-010",
    name: "Pune Ring Road Section 2",
    code: "PUN-RRD-02",
    location: "Hinjewadi Link, Pune",
    latitude: 18.5913,
    longitude: 73.7389,
    radiusMeters: 1500,
    budget: 260000000,
    wbsNodes: [
      { id: "PUN-WBS-01", name: "Excavation & Rock Cutting", budget: 90000000 },
      { id: "PUN-WBS-02", name: "Subgrade & Base Stabilization", budget: 110000000 },
      { id: "PUN-WBS-03", name: "Retaining Wall RCC Support", budget: 60000000 }
    ]
  },
  {
    id: "PROJ-011",
    name: "Patna Ganga Path Corridor",
    code: "PAT-GAN-EC",
    location: "Digha-Kanganghat, Patna",
    latitude: 25.6267,
    longitude: 85.1011,
    radiusMeters: 2500,
    budget: 190000000,
    wbsNodes: [
      { id: "PAT-WBS-01", name: "Marine Piles in River Bed", budget: 100000000 },
      { id: "PAT-WBS-02", name: "Pier Cap RCC Castings", budget: 50000000 },
      { id: "PAT-WBS-03", name: "Superstructure Segment Assembly", budget: 40000000 }
    ]
  },
  {
    id: "PROJ-012",
    name: "Lucknow Smart Sewerage Net",
    code: "LKO-SWR-NET",
    location: "Gomti Nagar, Lucknow",
    latitude: 26.8504,
    longitude: 80.9992,
    radiusMeters: 900,
    budget: 150000000,
    wbsNodes: [
      { id: "LKO-WBS-01", name: "Microtunneling & Pipe Jacking", budget: 80000000 },
      { id: "LKO-WBS-02", name: "Sewerage Treatment Units", budget: 40000000 },
      { id: "LKO-WBS-03", name: "Manhole RCC Precast Erection", budget: 30000000 }
    ]
  }
];

const DEFAULT_USERS = [
  { id: "USR-001", name: "Amit Sharma", username: "amit.sharma", email: "amit.sharma@siteiq.com", role: "Site Engr", projects: ["PROJ-001", "PROJ-006", "PROJ-007"] },
  { id: "USR-002", name: "Priya Patel", username: "priya.patel", email: "priya.patel@siteiq.com", role: "Site Engr", projects: ["PROJ-002", "PROJ-005", "PROJ-008"] },
  { id: "USR-003", name: "Rahul Verma", username: "rahul.verma", email: "rahul.verma@siteiq.com", role: "Site Engr", projects: ["PROJ-003", "PROJ-004", "PROJ-009"] },
  { id: "USR-004", name: "Vikram Malhotra", username: "vikram.malhotra", email: "vikram.malhotra@siteiq.com", role: "Planning Engr", projects: ["PROJ-001", "PROJ-004", "PROJ-007", "PROJ-010"] },
  { id: "USR-005", name: "Ananya Roy", username: "ananya.roy", email: "ananya.roy@siteiq.com", role: "Planning Engr", projects: ["PROJ-002", "PROJ-003", "PROJ-005", "PROJ-006", "PROJ-008", "PROJ-009", "PROJ-011", "PROJ-012"] },
  { id: "USR-006", name: "Rajesh Iyer", username: "rajesh.iyer", email: "rajesh.iyer@siteiq.com", role: "PM", projects: ["PROJ-001", "PROJ-006", "PROJ-007", "PROJ-012"] },
  { id: "USR-007", name: "Sanjay Dutt", username: "sanjay.dutt", email: "sanjay.dutt@siteiq.com", role: "PM", projects: ["PROJ-002", "PROJ-005", "PROJ-008", "PROJ-011"] },
  { id: "USR-008", name: "Neha Sen", username: "neha.sen", email: "neha.sen@siteiq.com", role: "PM", projects: ["PROJ-003", "PROJ-004", "PROJ-009", "PROJ-010"] },
  { id: "USR-009", name: "Harish Rao", username: "harish.rao", email: "harish.rao@siteiq.com", role: "HO Incharge", projects: ["PROJ-001", "PROJ-002", "PROJ-003", "PROJ-004", "PROJ-005", "PROJ-006", "PROJ-007", "PROJ-008", "PROJ-009", "PROJ-010", "PROJ-011", "PROJ-012"] },
  { id: "USR-010", name: "K. Chandrasekhar", username: "k.chandrasekhar", email: "k.chandrasekhar@siteiq.com", role: "PMCC", projects: ["PROJ-001", "PROJ-002", "PROJ-003", "PROJ-004", "PROJ-005", "PROJ-006", "PROJ-007", "PROJ-008", "PROJ-009", "PROJ-010", "PROJ-011", "PROJ-012"] },
  { id: "USR-011", name: "S. Srinivasan", username: "srinivasan", email: "admin@siteiq.com", role: "Admin", projects: ["PROJ-001", "PROJ-002", "PROJ-003", "PROJ-004", "PROJ-005", "PROJ-006", "PROJ-007", "PROJ-008", "PROJ-009", "PROJ-010", "PROJ-011", "PROJ-012"] },
  { id: "USR-012", name: "Ketan Mehta", username: "ketan.mehta", email: "ketan.mehta@siteiq.com", role: "Site Engr", projects: ["PROJ-010", "PROJ-011", "PROJ-012"] },
  { id: "USR-013", name: "Meera Nair", username: "meera.nair", email: "meera.nair@siteiq.com", role: "Planning Engr", projects: ["PROJ-001", "PROJ-006", "PROJ-007", "PROJ-010"] }
];

const DEFAULT_VENDORS = [
  { id: "VND-001", name: "L&T Infrastructure Ltd", type: "External" },
  { id: "VND-002", name: "Tata Projects & Co", type: "External" },
  { id: "VND-003", name: "JSW Steel Works", type: "External" },
  { id: "VND-004", name: "SiteIQ Internal Excavation Team", type: "Internal" },
  { id: "VND-005", name: "Alpha Electricals & Co", type: "External" },
  { id: "VND-006", name: "SiteIQ Concrete Sub-division", type: "Internal" },
  { id: "VND-007", name: "Shapoorji Pallonji Infra", type: "External" },
  { id: "VND-008", name: "HCC Limited", type: "External" }
];

const DEFAULT_POS = [
  // Mumbai Metro POs
  {
    poNumber: "PO-MUM-01",
    projectId: "PROJ-001",
    wbsNodeId: "MUM-WBS-01",
    vendorId: "VND-004",
    materialCode: "MAT-CONC-M40",
    materialDescription: "M40 Concrete Grade Lining Segment",
    uom: "Cum",
    totalQty: 2500,
    rate: 5500, // Qty lock & rate freeze reference
    currency: "INR"
  },
  {
    poNumber: "PO-MUM-02",
    projectId: "PROJ-001",
    wbsNodeId: "MUM-WBS-02",
    vendorId: "VND-001",
    materialCode: "MAT-REBAR-32",
    materialDescription: "TMT Reinforcement Steel bars 32mm",
    uom: "MT",
    totalQty: 600,
    rate: 68000,
    currency: "INR"
  },
  // Bangalore Airport POs
  {
    poNumber: "PO-BLR-01",
    projectId: "PROJ-002",
    wbsNodeId: "BLR-WBS-01",
    vendorId: "VND-002",
    materialCode: "MAT-PILE-600",
    materialDescription: "Piling Bored Concrete Cast-in-situ 600mm",
    uom: "Mtr",
    totalQty: 8000,
    rate: 4200,
    currency: "INR"
  },
  {
    poNumber: "PO-BLR-02",
    projectId: "PROJ-002",
    wbsNodeId: "BLR-WBS-02",
    vendorId: "VND-003",
    materialCode: "MAT-GLZ-FACADE",
    materialDescription: "Double Glazed Structural Facade Paneling",
    uom: "Sqm",
    totalQty: 4500,
    rate: 15500,
    currency: "INR"
  },
  // Delhi Expressway POs
  {
    poNumber: "PO-DEL-01",
    projectId: "PROJ-003",
    wbsNodeId: "DVE-WBS-01",
    vendorId: "VND-004",
    materialCode: "MAT-EXCAV-SOIL",
    materialDescription: "Soil Excavation & Embankment Dressing",
    uom: "Cum",
    totalQty: 50000,
    rate: 180,
    currency: "INR"
  },
  {
    poNumber: "PO-DEL-02",
    projectId: "PROJ-003",
    wbsNodeId: "DVE-WBS-03",
    vendorId: "VND-001",
    materialCode: "MAT-ASPH-BC",
    materialDescription: "Asphalt Bituminous Concrete Layer (40mm)",
    uom: "Sqm",
    totalQty: 95000,
    rate: 850,
    currency: "INR"
  },
  // Vizag Port POs
  {
    poNumber: "PO-VZG-01",
    projectId: "PROJ-004",
    wbsNodeId: "VZG-WBS-01",
    vendorId: "VND-002",
    materialCode: "MAT-CONC-M50",
    materialDescription: "High-grade Marine M50 Concrete",
    uom: "Cum",
    totalQty: 4000,
    rate: 7200,
    currency: "INR"
  },
  // Kochi Smart City POs
  {
    poNumber: "PO-KOC-01",
    projectId: "PROJ-005",
    wbsNodeId: "KOC-WBS-02",
    vendorId: "VND-005",
    materialCode: "MAT-POLE-12M",
    materialDescription: "Galvanized Octagonal Smart Pole 12m",
    uom: "Nos",
    totalQty: 150,
    rate: 45000,
    currency: "INR"
  },
  // Chennai Desalination POs
  {
    poNumber: "PO-CHN-01",
    projectId: "PROJ-006",
    wbsNodeId: "CHN-WBS-01",
    vendorId: "VND-001",
    materialCode: "MAT-HDPE-1600",
    materialDescription: "High Density Polyethylene Intake Pipe 1600mm",
    uom: "Mtr",
    totalQty: 1800,
    rate: 34000,
    currency: "INR"
  },
  // Hyderabad POs
  {
    poNumber: "PO-HYD-01",
    projectId: "PROJ-007",
    wbsNodeId: "HYD-WBS-01",
    vendorId: "VND-001",
    materialCode: "MAT-PIER-1200",
    materialDescription: "Reinforced Concrete Pier Erection 1200mm",
    uom: "Nos",
    totalQty: 80,
    rate: 280000,
    currency: "INR"
  },
  {
    poNumber: "PO-HYD-02",
    projectId: "PROJ-007",
    wbsNodeId: "HYD-WBS-02",
    vendorId: "VND-007",
    materialCode: "MAT-PRE-GIRD",
    materialDescription: "Precast Concrete Segmental Girder",
    uom: "Nos",
    totalQty: 240,
    rate: 180000,
    currency: "INR"
  },
  // Kolkata Metro POs
  {
    poNumber: "PO-KOL-01",
    projectId: "PROJ-008",
    wbsNodeId: "KOL-WBS-01",
    vendorId: "VND-008",
    materialCode: "MAT-TUN-SEG",
    materialDescription: "Concrete Precast Tunnel Segment Lining",
    uom: "Cum",
    totalQty: 4500,
    rate: 6500,
    currency: "INR"
  },
  // Ahmedabad Bullet Train POs
  {
    poNumber: "PO-AHM-01",
    projectId: "PROJ-009",
    wbsNodeId: "AHM-WBS-02",
    vendorId: "VND-003",
    materialCode: "MAT-H-STEEL",
    materialDescription: "Structural H-Beams and Steel Girder Truss",
    uom: "MT",
    totalQty: 1200,
    rate: 85000,
    currency: "INR"
  },
  // Pune Ring Road POs
  {
    poNumber: "PO-PUN-01",
    projectId: "PROJ-010",
    wbsNodeId: "PUN-WBS-01",
    vendorId: "VND-004",
    materialCode: "MAT-ROCK-CUT",
    materialDescription: "Heavy Excavator Assisted Rock Blasting & Cleaving",
    uom: "Cum",
    totalQty: 12000,
    rate: 450,
    currency: "INR"
  },
  // Patna Corridor POs
  {
    poNumber: "PO-PAT-01",
    projectId: "PROJ-011",
    wbsNodeId: "PAT-WBS-01",
    vendorId: "VND-002",
    materialCode: "MAT-MAR-PILE",
    materialDescription: "Marine Bored Piles casting under bentonite",
    uom: "Mtr",
    totalQty: 6000,
    rate: 9800,
    currency: "INR"
  },
  // Lucknow Sewerage POs
  {
    poNumber: "PO-LKO-01",
    projectId: "PROJ-012",
    wbsNodeId: "LKO-WBS-01",
    vendorId: "VND-006",
    materialCode: "MAT-CONC-PIPE",
    materialDescription: "RCC Spun Pipe Jacking Segment Class NP4",
    uom: "Mtr",
    totalQty: 3000,
    rate: 12000,
    currency: "INR"
  }
];

// Seed initial DPR reports for historical views, approval simulation, and analytics
const DEFAULT_DPRS = [
  {
    id: "DPR-2026-001",
    projectId: "PROJ-001",
    poNumber: "PO-MUM-01",
    wbsNodeId: "MUM-WBS-01",
    subDate: "2026-06-25",
    reportedDate: "2026-06-25",
    quantityExecuted: 80,
    manpower: 45,
    equipment: "TBM Segment Launcher, Crane 50T",
    workDescription: "Successful rings erection from Ring 240 to 252 inside Tunnel A. Concrete alignment inspected.",
    remarks: "Work completed ahead of schedule. Water seepage controlled.",
    gps: { lat: 18.9412, lng: 72.8256, accuracy: 5.2, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-25 14:32:10",
        gps: { lat: 18.9412, lng: 72.8256 },
        isFlagged: false
      }
    ],
    status: "FULLY LOCKED", // Finalized by PMCC
    workflow: {
      siteEng: { user: "Amit Sharma", action: "Submit", timestamp: "2026-06-25 18:10:00" },
      planningEng: { user: "Vikram Malhotra", action: "Accept", timestamp: "2026-06-25 19:40:00" },
      pm: { user: "Rajesh Iyer", action: "Approve", timestamp: "2026-06-26 09:15:00", comment: "PO rate match verified." },
      ho: { user: "Harish Rao", action: "Approve", timestamp: "2026-06-26 12:30:00" },
      pmcc: { user: "K. Chandrasekhar", action: "Final Approve", timestamp: "2026-06-26 16:50:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Amit Sharma", timestamp: "2026-06-25 17:50:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Amit Sharma)", timestamp: "2026-06-25 18:10:00" },
      { step: "Planning Check", desc: "Planning Engineer random validation passed & accepted (Vikram Malhotra)", timestamp: "2026-06-25 19:40:00" },
      { step: "PM Review", desc: "Project Manager rate and PO validation complete. Rate Frozen. Qty & Rate locked. (Rajesh Iyer)", timestamp: "2026-06-26 09:15:00" },
      { step: "HO Approval", desc: "HO Incharge review completed. (Harish Rao)", timestamp: "2026-06-26 12:30:00" },
      { step: "PMCC Sign-off", desc: "Final PMCC approval. Entry Fully Locked. Posting sent to SAP. (K. Chandrasekhar)", timestamp: "2026-06-26 16:50:00" }
    ],
    sapSync: {
      synced: true,
      grDocument: "5002938101",
      syncTimestamp: "2026-06-26 16:50:12"
    }
  },
  {
    id: "DPR-2026-002",
    projectId: "PROJ-001",
    poNumber: "PO-MUM-01",
    wbsNodeId: "MUM-WBS-01",
    subDate: "2026-06-26",
    reportedDate: "2026-06-26",
    quantityExecuted: 75,
    manpower: 48,
    equipment: "TBM Segment Launcher, Crane 50T",
    workDescription: "Ring 253 to Ring 264 erected. Shifting work commenced.",
    remarks: "Progress steady.",
    gps: { lat: 18.9405, lng: 72.8248, accuracy: 4.8, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-26 15:10:20",
        gps: { lat: 18.9405, lng: 72.8248 },
        isFlagged: false
      }
    ],
    status: "HO Approved", // Waiting for PMCC
    workflow: {
      siteEng: { user: "Amit Sharma", action: "Submit", timestamp: "2026-06-26 18:05:00" },
      planningEng: { user: "Vikram Malhotra", action: "Accept", timestamp: "2026-06-26 20:10:00" },
      pm: { user: "Rajesh Iyer", action: "Approve", timestamp: "2026-06-27 10:20:00", comment: "PO limit is well within margins." },
      ho: { user: "Harish Rao", action: "Approve", timestamp: "2026-06-27 15:40:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Amit Sharma", timestamp: "2026-06-26 17:40:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Amit Sharma)", timestamp: "2026-06-26 18:05:00" },
      { step: "Planning Check", desc: "Planning Engineer accepted (Vikram Malhotra)", timestamp: "2026-06-26 20:10:00" },
      { step: "PM Review", desc: "PM Approved. Qty & Rate locked. (Rajesh Iyer)", timestamp: "2026-06-27 10:20:00" },
      { step: "HO Approval", desc: "HO Incharge review completed. (Harish Rao)", timestamp: "2026-06-27 15:40:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-003",
    projectId: "PROJ-002",
    poNumber: "PO-BLR-01",
    wbsNodeId: "BLR-WBS-01",
    subDate: "2026-06-27",
    reportedDate: "2026-06-27",
    quantityExecuted: 320,
    manpower: 60,
    equipment: "Hydraulic Piling Rig (Mait), Transit Mixer (4 Nos)",
    workDescription: "Boring and casting of 4 piles completed. Total depth achieved 320 meters.",
    remarks: "Bentonite slurry recycling unit functional.",
    gps: { lat: 13.2015, lng: 77.7102, accuracy: 8.5, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-27 11:22:45",
        gps: { lat: 13.2015, lng: 77.7102 },
        isFlagged: false
      }
    ],
    status: "Under Review", // Awaiting PM review (already Planning Engineer accepted)
    workflow: {
      siteEng: { user: "Priya Patel", action: "Submit", timestamp: "2026-06-27 17:30:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-06-27 19:15:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Priya Patel", timestamp: "2026-06-27 17:00:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Priya Patel)", timestamp: "2026-06-27 17:30:00" },
      { step: "Planning Check", desc: "Planning Engineer check and acceptance (Ananya Roy)", timestamp: "2026-06-27 19:15:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-004",
    projectId: "PROJ-002",
    poNumber: "PO-BLR-02",
    wbsNodeId: "BLR-WBS-02",
    subDate: "2026-06-28",
    reportedDate: "2026-06-28",
    quantityExecuted: 120,
    manpower: 32,
    equipment: "Boom Lift, Glass Suction Lifter",
    workDescription: "Installation of 12 glazed panels on East Face, Grid A12-A15.",
    remarks: "Wind speed high in afternoon; works paused for 2 hours.",
    gps: { lat: 13.1950, lng: 77.7150, accuracy: 65.0, isFlagged: true }, // Out of geo-fence radius! Flagged.
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-28 10:15:00",
        gps: { lat: 13.1950, lng: 77.7150 }, // Out of project geo-bounds
        isFlagged: true
      }
    ],
    status: "Submitted", // Awaiting Planning Engr review
    workflow: {
      siteEng: { user: "Priya Patel", action: "Submit", timestamp: "2026-06-28 17:45:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Priya Patel", timestamp: "2026-06-28 17:10:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Priya Patel). Geo-validation alert generated: Location outside project site radius.", timestamp: "2026-06-28 17:45:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-005",
    projectId: "PROJ-003",
    poNumber: "PO-DEL-01",
    wbsNodeId: "DVE-WBS-01",
    subDate: "2026-06-28",
    reportedDate: "2026-06-28",
    quantityExecuted: 3800,
    manpower: 28,
    equipment: "Excavator CAT 320D (3 Nos), Soil Compactor (2 Nos), Dumper (12 Nos)",
    workDescription: "Embankment filling, watering, and compaction at Chainage 24+200 to 24+500.",
    remarks: "Compaction test reports attached to site folder.",
    gps: { lat: 26.9130, lng: 75.7865, accuracy: 9.0, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-28 14:05:30",
        gps: { lat: 26.9130, lng: 75.7865 },
        isFlagged: false
      }
    ],
    status: "Draft", // Site engineer is still drafting it
    workflow: {},
    historyLog: [
      { step: "Creation", desc: "DPR Draft initialized by Rahul Verma", timestamp: "2026-06-28 16:30:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-006",
    projectId: "PROJ-004",
    poNumber: "PO-VZG-01",
    wbsNodeId: "VZG-WBS-01",
    subDate: "2026-06-28",
    reportedDate: "2026-06-28",
    quantityExecuted: 220,
    manpower: 40,
    equipment: "Concrete Batching Plant, Transit Mixers, Concrete Pump",
    workDescription: "Pouring of M50 grade concrete for the Extension Segment A of Jetty 2.",
    remarks: "Excellent weather conditions, target cube strength achieves standard limit.",
    gps: { lat: 17.6872, lng: 83.2190, accuracy: 6.2, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-28 11:45:00",
        gps: { lat: 17.6872, lng: 83.2190 },
        isFlagged: false
      }
    ],
    status: "FULLY LOCKED",
    workflow: {
      siteEng: { user: "Rahul Verma", action: "Submit", timestamp: "2026-06-28 17:50:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-06-28 19:30:00" },
      pm: { user: "Neha Sen", action: "Approve", timestamp: "2026-06-29 10:10:00", comment: "Concrete pour volume verified." },
      ho: { user: "Harish Rao", action: "Approve", timestamp: "2026-06-29 14:00:00" },
      pmcc: { user: "K. Chandrasekhar", action: "Final Approve", timestamp: "2026-06-29 16:30:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Rahul Verma", timestamp: "2026-06-28 16:45:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Rahul Verma)", timestamp: "2026-06-28 17:50:00" },
      { step: "Planning Check", desc: "Planning check passed & accepted (Ananya Roy)", timestamp: "2026-06-28 19:30:00" },
      { step: "PM Review", desc: "PM Approved & Rate locked (Neha Sen)", timestamp: "2026-06-29 10:10:00" },
      { step: "HO Approval", desc: "HO Incharge review completed. (Harish Rao)", timestamp: "2026-06-29 14:00:00" },
      { step: "PMCC Sign-off", desc: "Entry fully locked. Sent OData to SAP. (K. Chandrasekhar)", timestamp: "2026-06-29 16:30:00" }
    ],
    sapSync: {
      synced: true,
      grDocument: "5002938102",
      syncTimestamp: "2026-06-29 16:30:15"
    }
  },
  {
    id: "DPR-2026-007",
    projectId: "PROJ-005",
    poNumber: "PO-KOC-01",
    wbsNodeId: "KOC-WBS-02",
    subDate: "2026-06-29",
    reportedDate: "2026-06-29",
    quantityExecuted: 15,
    manpower: 18,
    equipment: "Mobile Crane 20T, Hydraulic Ladder Truck",
    workDescription: "Erection and leveling of 15 galvanized smart poles with IoT node brackets.",
    remarks: "Solar bracket alignment and cabling terminated successfully.",
    gps: { lat: 9.9820, lng: 76.3005, accuracy: 4.1, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-29 13:20:10",
        gps: { lat: 9.9820, lng: 76.3005 },
        isFlagged: false
      }
    ],
    status: "Approved",
    workflow: {
      siteEng: { user: "Priya Patel", action: "Submit", timestamp: "2026-06-29 18:00:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-06-29 20:00:00" },
      pm: { user: "Sanjay Dutt", action: "Approve", timestamp: "2026-06-30 09:30:00", comment: "Verified count against PO limit." }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Priya Patel", timestamp: "2026-06-29 17:15:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Priya Patel)", timestamp: "2026-06-29 18:00:00" },
      { step: "Planning Check", desc: "Accepted (Ananya Roy)", timestamp: "2026-06-29 20:00:00" },
      { step: "PM Review", desc: "Project Manager approved. Qty locked. (Sanjay Dutt)", timestamp: "2026-06-30 09:30:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-008",
    projectId: "PROJ-006",
    poNumber: "PO-CHN-01",
    wbsNodeId: "CHN-WBS-01",
    subDate: "2026-06-29",
    reportedDate: "2026-06-29",
    quantityExecuted: 80,
    manpower: 34,
    equipment: "Pipe Fusion Welding Machine, Crane 80T, Excavator CAT 320D",
    workDescription: "Fusion welding and excavation for laying 80 meters of 1600mm HDPE pipe.",
    remarks: "Light drizzle throughout the day. Ground slippery, speeds normal.",
    gps: { lat: 12.7032, lng: 80.2220, accuracy: 5.5, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-29 10:30:40",
        gps: { lat: 12.7032, lng: 80.2220 },
        isFlagged: false
      }
    ],
    status: "Under Review",
    workflow: {
      siteEng: { user: "Amit Sharma", action: "Submit", timestamp: "2026-06-29 17:40:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-06-29 19:50:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Amit Sharma", timestamp: "2026-06-29 17:00:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Amit Sharma)", timestamp: "2026-06-29 17:40:00" },
      { step: "Planning Check", desc: "Planning Engineer check passed (Ananya Roy)", timestamp: "2026-06-29 19:50:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-009",
    projectId: "PROJ-001",
    poNumber: "PO-MUM-01",
    wbsNodeId: "MUM-WBS-01",
    subDate: "2026-06-30",
    reportedDate: "2026-06-30",
    quantityExecuted: 65,
    manpower: 42,
    equipment: "TBM Segment Launcher, Grout Pump",
    workDescription: "Segmental lining rings 265 to 274 erected. Dynamic grouting works completed.",
    remarks: "Alert: Reused image check demonstration. Re-uploading photo from DPR-2026-001.",
    gps: { lat: 18.9408, lng: 72.8252, accuracy: 4.5, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-30 11:20:15",
        gps: { lat: 18.9408, lng: 72.8252 },
        isFlagged: false
      }
    ],
    status: "Submitted",
    workflow: {
      siteEng: { user: "Amit Sharma", action: "Submit", timestamp: "2026-06-30 17:30:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Amit Sharma", timestamp: "2026-06-30 16:50:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Amit Sharma). Fraud filter alert generated: Image matches pre-existing DPR-2026-001.", timestamp: "2026-06-30 17:30:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-010",
    projectId: "PROJ-002",
    poNumber: "PO-BLR-01",
    wbsNodeId: "BLR-WBS-01",
    subDate: "2026-06-30",
    reportedDate: "2026-06-30",
    quantityExecuted: 140,
    manpower: 58,
    equipment: "Hydraulic Piling Rig (Mait), Transit Mixers",
    workDescription: "Cast-in-situ concrete boring of 2 standard terminal support piles (No 42 & 43).",
    remarks: "Alert: EXIF Time deviation check. Captured metadata is 10 days older.",
    gps: { lat: 13.2010, lng: 77.7092, accuracy: 6.8, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-06-20 09:15:22",
        gps: { lat: 13.2010, lng: 77.7092 },
        isFlagged: false
      }
    ],
    status: "Under Review",
    workflow: {
      siteEng: { user: "Priya Patel", action: "Submit", timestamp: "2026-06-30 18:15:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-06-30 20:30:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Priya Patel", timestamp: "2026-06-30 17:40:00" },
      { step: "Submission", desc: "DPR submitted. EXIF Time Audit Alert generated: Photo timestamp (2026-06-20) does not align with submission date.", timestamp: "2026-06-30 18:15:00" },
      { step: "Planning Check", desc: "Warning flagged but accepted for PM audit (Ananya Roy)", timestamp: "2026-06-30 20:30:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-011",
    projectId: "PROJ-007",
    poNumber: "PO-HYD-01",
    wbsNodeId: "HYD-WBS-01",
    subDate: "2026-07-01",
    reportedDate: "2026-07-01",
    quantityExecuted: 4,
    manpower: 26,
    equipment: "Concrete Transit Mixers, Steel Cage Jig, Pile Driver",
    workDescription: "Casting and structural rebar cages lowering completed for piers P-12, P-13, P-14, P-15.",
    remarks: "Concrete curing checks scheduled for next morning.",
    gps: { lat: 17.4485, lng: 78.3746, accuracy: 4.9, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1545624446-43a9cc99abc0?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-07-01 14:10:00",
        gps: { lat: 17.4485, lng: 78.3746 },
        isFlagged: false
      }
    ],
    status: "FULLY LOCKED",
    workflow: {
      siteEng: { user: "Amit Sharma", action: "Submit", timestamp: "2026-07-01 17:50:00" },
      planningEng: { user: "Vikram Malhotra", action: "Accept", timestamp: "2026-07-01 19:10:00" },
      pm: { user: "Rajesh Iyer", action: "Approve", timestamp: "2026-07-02 09:20:00", comment: "Concrete volumes match SAP limits." },
      ho: { user: "Harish Rao", action: "Approve", timestamp: "2026-07-02 12:40:00" },
      pmcc: { user: "K. Chandrasekhar", action: "Final Approve", timestamp: "2026-07-02 16:15:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Amit Sharma", timestamp: "2026-07-01 17:10:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Amit Sharma)", timestamp: "2026-07-01 17:50:00" },
      { step: "Planning Check", desc: "Accepted (Vikram Malhotra)", timestamp: "2026-07-01 19:10:00" },
      { step: "PM Review", desc: "PM Approved. Rate lock code validated. (Rajesh Iyer)", timestamp: "2026-07-02 09:20:00" },
      { step: "HO Approval", desc: "HO Incharge review completed. (Harish Rao)", timestamp: "2026-07-02 12:40:00" },
      { step: "PMCC Sign-off", desc: "Final PMCC approval. Posted GR doc 5002938103 into SAP. (K. Chandrasekhar)", timestamp: "2026-07-02 16:15:00" }
    ],
    sapSync: {
      synced: true,
      grDocument: "5002938103",
      syncTimestamp: "2026-07-02 16:15:20"
    }
  },
  {
    id: "DPR-2026-012",
    projectId: "PROJ-008",
    poNumber: "PO-KOL-01",
    wbsNodeId: "KOL-WBS-01",
    subDate: "2026-07-01",
    reportedDate: "2026-07-01",
    quantityExecuted: 110,
    manpower: 52,
    equipment: "Tunnel Boring Machine (TBM) - Ganga Link, Muck Car",
    workDescription: "Drilled and placed precast segment lining for ring 1102 to 1115.",
    remarks: "Water inflows from riverbed ceiling controlled by dynamic chemical grouting.",
    gps: { lat: 22.5738, lng: 88.4328, accuracy: 6.1, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-07-01 15:35:12",
        gps: { lat: 22.5738, lng: 88.4328 },
        isFlagged: false
      }
    ],
    status: "HO Approved",
    workflow: {
      siteEng: { user: "Priya Patel", action: "Submit", timestamp: "2026-07-01 18:20:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-07-01 20:10:00" },
      pm: { user: "Sanjay Dutt", action: "Approve", timestamp: "2026-07-02 10:45:00", comment: "TBM progress conforms to schedule." },
      ho: { user: "Harish Rao", action: "Approve", timestamp: "2026-07-02 15:10:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Priya Patel", timestamp: "2026-07-01 17:50:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Priya Patel)", timestamp: "2026-07-01 18:20:00" },
      { step: "Planning Check", desc: "Accepted (Ananya Roy)", timestamp: "2026-07-01 20:10:00" },
      { step: "PM Review", desc: "PM Approved (Sanjay Dutt)", timestamp: "2026-07-02 10:45:00" },
      { step: "HO Approval", desc: "HO Incharge review completed. (Harish Rao)", timestamp: "2026-07-02 15:10:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-013",
    projectId: "PROJ-009",
    poNumber: "PO-AHM-01",
    wbsNodeId: "AHM-WBS-02",
    vendorId: "VND-003",
    subDate: "2026-07-02",
    reportedDate: "2026-07-02",
    quantityExecuted: 45,
    manpower: 30,
    equipment: "Heavy Crawler Crane 250T, Welders, Torque Wrenches",
    workDescription: "Erection of 3 heavy H-steel trusses on Grid B-8. High strength torque tightening completed.",
    remarks: "Excellent wind speeds for heavy lift. Welding ultrasonic tests passed.",
    gps: { lat: 23.0302, lng: 72.6006, accuracy: 5.0, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-07-02 11:10:00",
        gps: { lat: 23.0302, lng: 72.6006 },
        isFlagged: false
      }
    ],
    status: "Approved",
    workflow: {
      siteEng: { user: "Rahul Verma", action: "Submit", timestamp: "2026-07-02 17:40:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-07-02 19:40:00" },
      pm: { user: "Neha Sen", action: "Approve", timestamp: "2026-07-03 09:10:00", comment: "Ultrasonic welding NDT report verified." }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Rahul Verma", timestamp: "2026-07-02 17:00:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Rahul Verma)", timestamp: "2026-07-02 17:40:00" },
      { step: "Planning Check", desc: "Accepted (Ananya Roy)", timestamp: "2026-07-02 19:40:00" },
      { step: "PM Review", desc: "PM Approved. Material weights locked. (Neha Sen)", timestamp: "2026-07-03 09:10:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-014",
    projectId: "PROJ-010",
    poNumber: "PO-PUN-01",
    wbsNodeId: "PUN-WBS-01",
    subDate: "2026-07-02",
    reportedDate: "2026-07-02",
    quantityExecuted: 850,
    manpower: 16,
    equipment: "Jackhammers, Rock Breakers, Dumptrucks",
    workDescription: "Drilling and blasting of rock face at Section 2 chainage 12+800. Shifting of 850 cum muck.",
    remarks: "Alert: Geo-fence deviation check. Site engineer submitted this from Hinjewadi center (about 12km out).",
    gps: { lat: 18.6500, lng: 73.9500, accuracy: 80.0, isFlagged: true },
    images: [
      {
        url: "https://images.unsplash.com/photo-1579847259944-59e51e9389bd?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-07-02 16:30:00",
        gps: { lat: 18.6500, lng: 73.9500 },
        isFlagged: true
      }
    ],
    status: "Submitted",
    workflow: {
      siteEng: { user: "Ketan Mehta", action: "Submit", timestamp: "2026-07-02 18:30:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Ketan Mehta", timestamp: "2026-07-02 18:00:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Ketan Mehta). Geofence alert triggered: Coordinates outside Hinjewadi Link circle.", timestamp: "2026-07-02 18:30:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-015",
    projectId: "PROJ-011",
    poNumber: "PO-PAT-01",
    wbsNodeId: "PAT-WBS-01",
    subDate: "2026-07-03",
    reportedDate: "2026-07-03",
    quantityExecuted: 120,
    manpower: 44,
    equipment: "Barge-mounted Piling Rig, Concrete Pump",
    workDescription: "Completed bored marine pile P-22 casing concrete pour. Total depth 45m achieved.",
    remarks: "Bentonite suspension density monitored to keep borehole walls stable.",
    gps: { lat: 25.6272, lng: 85.1018, accuracy: 7.2, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-07-03 12:10:00",
        gps: { lat: 25.6272, lng: 85.1018 },
        isFlagged: false
      }
    ],
    status: "Draft",
    workflow: {},
    historyLog: [
      { step: "Creation", desc: "DPR Draft initialized by Ketan Mehta", timestamp: "2026-07-03 15:40:00" }
    ],
    sapSync: {
      synced: false
    }
  },
  {
    id: "DPR-2026-016",
    projectId: "PROJ-012",
    poNumber: "PO-LKO-01",
    wbsNodeId: "LKO-WBS-01",
    subDate: "2026-07-03",
    reportedDate: "2026-07-03",
    quantityExecuted: 36,
    manpower: 24,
    equipment: "Pipe Jacking Herrenknecht AVN800, Slurry Separation Plant",
    workDescription: "Microtunneling AVN excavation progress of 36 meters pipe jacking under high-traffic corridor.",
    remarks: "No settlement detected on road surface. Laser alignment verified.",
    gps: { lat: 26.8509, lng: 80.9996, accuracy: 4.8, isFlagged: false },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=60",
        timestamp: "2026-07-03 14:22:15",
        gps: { lat: 26.8509, lng: 80.9996 },
        isFlagged: false
      }
    ],
    status: "FULLY LOCKED",
    workflow: {
      siteEng: { user: "Ketan Mehta", action: "Submit", timestamp: "2026-07-03 17:15:00" },
      planningEng: { user: "Ananya Roy", action: "Accept", timestamp: "2026-07-03 18:30:00" },
      pm: { user: "Rajesh Iyer", action: "Approve", timestamp: "2026-07-03 19:40:00", comment: "Microtunneling jacking log sheet checked." },
      ho: { user: "Harish Rao", action: "Approve", timestamp: "2026-07-03 20:50:00" },
      pmcc: { user: "K. Chandrasekhar", action: "Final Approve", timestamp: "2026-07-03 21:30:00" }
    },
    historyLog: [
      { step: "Creation", desc: "DPR Draft created by Ketan Mehta", timestamp: "2026-07-03 16:30:00" },
      { step: "Submission", desc: "DPR submitted to Planning Engineer (Ketan Mehta)", timestamp: "2026-07-03 17:15:00" },
      { step: "Planning Check", desc: "Accepted (Ananya Roy)", timestamp: "2026-07-03 18:30:00" },
      { step: "PM Review", desc: "PM Approved. Rate lock verified (Rajesh Iyer)", timestamp: "2026-07-03 19:40:00" },
      { step: "HO Approval", desc: "HO Incharge review completed. (Harish Rao)", timestamp: "2026-07-03 20:50:00" },
      { step: "PMCC Sign-off", desc: "Final PMCC approval. Posted GR doc 5002938108. (K. Chandrasekhar)", timestamp: "2026-07-03 21:30:00" }
    ],
    sapSync: {
      synced: true,
      grDocument: "5002938108",
      syncTimestamp: "2026-07-03 21:30:30"
    }
  }
];

// LocalStorage helpers to simulate a persistent backend DB
const DEFAULT_COMPANIES = [
  { id: "COMP-SITEIQ", name: "SiteIQ", logoText: "S", logoUrl: "" },
  { id: "COMP-TATA", name: "Tata Projects & Co", logoText: "T", logoUrl: "" },
  { id: "COMP-LT", name: "L&T Infrastructure Ltd", logoText: "L", logoUrl: "" }
];

const DEFAULT_SAP_CONFIGS = {
  "COMP-SITEIQ": {
    serverUrl: "https://sap-prd.siteiq.in:8000/sap/opu/odata/sap/",
    clientId: "100",
    systemId: "SIP",
    authType: "Basic",
    username: "sap_siteiq_sync",
    password: "Password123",
    serviceName: "ZSITEIQ_DPR_POST_SRV",
    rfcName: "ZRFQ_DPR_GOODS_RECEIPT"
  },
  "COMP-TATA": {
    serverUrl: "https://tata-projects-sap.tata.com/sap/bc/srt/rfc/",
    clientId: "200",
    systemId: "TPE",
    authType: "Basic",
    username: "tata_admin",
    password: "TataPassword!56",
    serviceName: "ZTATA_DPR_SRV",
    rfcName: "BAPI_GOODS_MOVEMENT_CREATE"
  },
  "COMP-LT": {
    serverUrl: "https://lt-infra-gateway.lt.com/sap/opu/odata/",
    clientId: "300",
    systemId: "LTE",
    authType: "OAuth",
    username: "lt_oauth_user",
    password: "",
    oauthClientId: "lt-isprp-client-id-abc123xyz",
    oauthClientSecret: "lt-secret-key-98765",
    oauthTokenUrl: "https://auth.lt.com/oauth/token",
    serviceName: "ZLT_GOODS_REC_SRV",
    rfcName: "ZLT_BAPI_GR_POST"
  }
};

const DEFAULT_COLUMN_MAPPINGS = {
  "COMP-SITEIQ": [
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
  ],
  "COMP-TATA": [
    { appId: "dprId", appLabel: "DPR Record ID", sapField: "DPRID", dataType: "CHAR", length: 20, isMandatory: true },
    { appId: "projectId", appLabel: "Project Code", sapField: "PROJECT_ID", dataType: "CHAR", length: 20, isMandatory: true },
    { appId: "poNumber", appLabel: "Purchase Order", sapField: "PO_NUM", dataType: "CHAR", length: 10, isMandatory: true },
    { appId: "quantityExecuted", appLabel: "Quantity Executed", sapField: "QTY_EXEC", dataType: "NUM", length: 13, isMandatory: true },
    { appId: "reportedDate", appLabel: "Posting Date", sapField: "POST_DATE", dataType: "DATE", length: 8, isMandatory: true }
  ],
  "COMP-LT": [
    { appId: "dprId", appLabel: "DPR Record ID", sapField: "DPR_NO", dataType: "CHAR", length: 15, isMandatory: true },
    { appId: "projectId", appLabel: "Project Code", sapField: "PRJ_ID", dataType: "CHAR", length: 20, isMandatory: true },
    { appId: "poNumber", appLabel: "Purchase Order", sapField: "PO_NO", dataType: "CHAR", length: 10, isMandatory: true },
    { appId: "wbsNodeId", appLabel: "WBS Element Code", sapField: "WBS_CODE", dataType: "CHAR", length: 24, isMandatory: true },
    { appId: "quantityExecuted", appLabel: "Quantity Executed", sapField: "EXEC_QTY", dataType: "NUM", length: 13, isMandatory: true }
  ]
};

export const initializeDB = () => {
  if (!localStorage.getItem("isprp_projects") || JSON.parse(localStorage.getItem("isprp_projects")).length < DEFAULT_PROJECTS.length) {
    localStorage.setItem("isprp_projects", JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem("isprp_users") || JSON.parse(localStorage.getItem("isprp_users")).length < DEFAULT_USERS.length) {
    localStorage.setItem("isprp_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("isprp_vendors") || JSON.parse(localStorage.getItem("isprp_vendors")).length < DEFAULT_VENDORS.length) {
    localStorage.setItem("isprp_vendors", JSON.stringify(DEFAULT_VENDORS));
  }
  if (!localStorage.getItem("isprp_pos") || JSON.parse(localStorage.getItem("isprp_pos")).length < DEFAULT_POS.length) {
    localStorage.setItem("isprp_pos", JSON.stringify(DEFAULT_POS));
  }
  if (!localStorage.getItem("isprp_dprs") || JSON.parse(localStorage.getItem("isprp_dprs")).length < DEFAULT_DPRS.length) {
    localStorage.setItem("isprp_dprs", JSON.stringify(DEFAULT_DPRS));
  }
  if (!localStorage.getItem("isprp_sap_logs")) {
    localStorage.setItem("isprp_sap_logs", JSON.stringify([
      { id: "LOG-001", timestamp: "2026-06-26 16:50:12", type: "GR_POSTING", payload: "DPR-2026-001 Milestone approved. Sent GR doc 5002938101", status: "SUCCESS" },
      { id: "LOG-002", timestamp: "2026-06-27 10:20:00", type: "QTY_LOCK_STATUS", payload: "PO-MUM-01 locked qty count update to 155 Cum.", status: "SUCCESS" }
    ]));
  }
  // Migration block to reset old company cache to SiteIQ
  const storedCompanies = localStorage.getItem("isprp_companies");
  const isOldVersion = !storedCompanies || storedCompanies.includes("SiteIQ Projects") || storedCompanies.includes("COMP-GKC");
  if (isOldVersion || localStorage.getItem("isprp_active_company") === "COMP-GKC" || !localStorage.getItem("isprp_active_company")) {
    localStorage.removeItem("isprp_companies");
    localStorage.removeItem("isprp_sap_configs");
    localStorage.removeItem("isprp_column_mappings");
    localStorage.setItem("isprp_active_company", "COMP-SITEIQ");
  }
  if (!localStorage.getItem("isprp_companies")) {
    localStorage.setItem("isprp_companies", JSON.stringify(DEFAULT_COMPANIES));
  }
  if (!localStorage.getItem("isprp_active_company")) {
    localStorage.setItem("isprp_active_company", "COMP-SITEIQ");
  }
  if (!localStorage.getItem("isprp_sap_configs")) {
    localStorage.setItem("isprp_sap_configs", JSON.stringify(DEFAULT_SAP_CONFIGS));
  }
  if (!localStorage.getItem("isprp_column_mappings")) {
    localStorage.setItem("isprp_column_mappings", JSON.stringify(DEFAULT_COLUMN_MAPPINGS));
  }
};

export const getData = (key) => {
  initializeDB();
  return JSON.parse(localStorage.getItem(`isprp_${key}`));
};

export const saveData = (key, data) => {
  localStorage.setItem(`isprp_${key}`, JSON.stringify(data));
};

// Custom helpers for application workflows
export const getProjects = () => getData("projects");
export const getUsers = () => getData("users");
export const getVendors = () => getData("vendors");
export const getPOs = () => getData("pos");
export const getDPRs = () => getData("dprs");
export const getSapLogs = () => getData("sap_logs");

// Company, Logo & SAP config helpers
export const getCompanies = () => getData("companies");
export const saveCompanies = (companies) => saveData("companies", companies);

export const getActiveCompanyId = () => {
  initializeDB();
  return localStorage.getItem("isprp_active_company") || "COMP-SITEIQ";
};

export const setActiveCompanyId = (id) => {
  localStorage.setItem("isprp_active_company", id);
};

export const getSapConfigs = () => getData("sap_configs");
export const saveSapConfigs = (configs) => saveData("sap_configs", configs);

export const getColumnMappings = () => getData("column_mappings");
export const saveColumnMappings = (mappings) => saveData("column_mappings", mappings);

export const updateDPR = (dpr) => {
  const dprs = getDPRs();
  const index = dprs.findIndex(d => d.id === dpr.id);
  if (index !== -1) {
    dprs[index] = dpr;
  } else {
    dprs.push(dpr);
  }
  saveData("dprs", dprs);
  return dprs;
};

export const updatePO = (po) => {
  const pos = getPOs();
  const index = pos.findIndex(p => p.poNumber === po.poNumber);
  if (index !== -1) {
    pos[index] = po;
    saveData("pos", pos);
  }
};

export const addSapLog = (type, payload, status = "SUCCESS") => {
  const logs = getSapLogs();
  const newLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    type,
    payload,
    status
  };
  logs.unshift(newLog); // prepend
  saveData("sap_logs", logs);
  return logs;
};
