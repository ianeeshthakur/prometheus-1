// G-VISTA Mock Data
// Gujarat Video Intelligence & Surveillance Technology Architecture
// All data is simulated for demonstration purposes

import {
  Camera, CameraCluster, NormalizedEvent, TrackedVehicle,
  WatchlistEntry, WatchlistMatch, Alert, Investigation,
  SystemHealth, TelemetryStat, CameraSighting, TimelineEvent, RelatedEntity, EvidenceItem
} from './types';

// ---------- GUJARAT DISTRICTS & GEOGRAPHY ----------
export const GUJARAT_REGIONS = [
  { region: 'North Gujarat', districts: ['Mehsana', 'Patan', 'Banaskantha', 'Sabarkantha', 'Aravalli'], lat: 23.8, lng: 72.3 },
  { region: 'Central Gujarat', districts: ['Ahmedabad', 'Gandhinagar', 'Anand', 'Kheda', 'Panchmahal', 'Dahod', 'Vadodara'], lat: 22.9, lng: 73.0 },
  { region: 'South Gujarat', districts: ['Surat', 'Bharuch', 'Narmada', 'Tapi', 'Navsari', 'Valsad', 'Dang'], lat: 21.5, lng: 73.1 },
  { region: 'Saurashtra', districts: ['Rajkot', 'Jamnagar', 'Bhavnagar', 'Junagadh', 'Amreli', 'Porbandar', 'Gir Somnath', 'Devbhoomi Dwarka', 'Morbi', 'Botad'], lat: 22.0, lng: 71.0 },
  { region: 'Kutch', districts: ['Kutch'], lat: 23.7, lng: 70.2 },
];

export const DISTRICT_DATA: Record<string, { lat: number; lng: number; cameras: number }> = {
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, cameras: 18420 },
  'Surat': { lat: 21.1702, lng: 72.8311, cameras: 14820 },
  'Vadodara': { lat: 22.3072, lng: 73.1812, cameras: 7650 },
  'Rajkot': { lat: 22.3039, lng: 70.8022, cameras: 5420 },
  'Gandhinagar': { lat: 23.2156, lng: 72.6369, cameras: 4800 },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519, cameras: 3240 },
  'Junagadh': { lat: 21.5222, lng: 70.4579, cameras: 2180 },
  'Jamnagar': { lat: 22.4707, lng: 70.0577, cameras: 2890 },
  'Mehsana': { lat: 23.5880, lng: 72.3693, cameras: 1980 },
  'Anand': { lat: 22.5645, lng: 72.9289, cameras: 1560 },
  'Bharuch': { lat: 21.7051, lng: 72.9959, cameras: 1420 },
  'Kheda': { lat: 22.7509, lng: 72.6936, cameras: 1180 },
  'Navsari': { lat: 20.9467, lng: 72.9520, cameras: 1050 },
  'Banaskantha': { lat: 24.1688, lng: 72.4366, cameras: 920 },
  'Patan': { lat: 23.8493, lng: 72.1266, cameras: 840 },
  'Morbi': { lat: 22.8173, lng: 70.8376, cameras: 760 },
  'Kutch': { lat: 23.7337, lng: 70.2086, cameras: 1420 },
  'Amreli': { lat: 21.6031, lng: 71.2214, cameras: 680 },
  'Porbandar': { lat: 21.6424, lng: 69.6293, cameras: 580 },
  'Gir Somnath': { lat: 20.9023, lng: 70.3706, cameras: 490 },
  'Sabarkantha': { lat: 23.3500, lng: 73.0167, cameras: 720 },
  'Aravalli': { lat: 23.7000, lng: 73.0200, cameras: 540 },
  'Tapi': { lat: 21.1197, lng: 73.4173, cameras: 420 },
  'Dang': { lat: 20.7539, lng: 73.7205, cameras: 280 },
  'Valsad': { lat: 20.5992, lng: 72.9342, cameras: 780 },
  'Narmada': { lat: 21.8750, lng: 73.4960, cameras: 380 },
  'Panchmahal': { lat: 22.7642, lng: 73.5226, cameras: 640 },
  'Dahod': { lat: 22.8355, lng: 74.2578, cameras: 560 },
  'Devbhoomi Dwarka': { lat: 22.2394, lng: 68.9678, cameras: 420 },
  'Botad': { lat: 22.1680, lng: 71.6672, cameras: 380 },
};

// ---------- CAMERA CLUSTERS ----------
export const CAMERA_CLUSTERS: CameraCluster[] = Object.entries(DISTRICT_DATA).map(([district, data]) => ({
  district,
  lat: data.lat,
  lng: data.lng,
  total: data.cameras,
  online: Math.floor(data.cameras * 0.974),
  offline: Math.floor(data.cameras * 0.015),
  degraded: Math.floor(data.cameras * 0.011),
  hasActiveAlert: ['Surat', 'Ahmedabad', 'Rajkot'].includes(district),
}));

// ---------- CAMERA REGISTRY ----------
export const CAMERAS: Camera[] = [
  { id: 'CAM-GJ-SRT-00421', name: 'Surat Ring Road NE-1', location: 'Surat Ring Road, NH-53 Junction', district: 'Surat', department: 'Traffic Police', vendor: 'Hikvision', model: 'DS-2CD2T47G2-L', integration: 'RTSP', vms: 'iVMS-4200', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Person Detection'], fps: 25, resolution: '1080p', healthScore: 98.4, lastHeartbeat: '2026-09-08T22:23:18+05:30', lat: 21.2021, lng: 72.8473 },
  { id: 'CAM-GJ-SRT-00044', name: 'Surat City Entry - Sachin', location: 'Sachin GIDC Entry, Surat', district: 'Surat', department: 'City Police', vendor: 'Dahua', model: 'IPC-HDW5831R', integration: 'ONVIF', vms: 'SmartPSS', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection'], fps: 30, resolution: '4MP', healthScore: 96.2, lastHeartbeat: '2026-09-08T22:23:10+05:30', lat: 21.0823, lng: 72.8891 },
  { id: 'CAM-GJ-KHD-00031', name: 'NH-48 Kheda Checkpoint', location: 'NH-48, Nadiad Bypass, Kheda', district: 'Kheda', department: 'Highway Police', vendor: 'Axis', model: 'P1448-LE', integration: 'ONVIF', vms: 'Axis Camera Station', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Speed Estimation'], fps: 30, resolution: '4K', healthScore: 99.1, lastHeartbeat: '2026-09-08T22:23:20+05:30', lat: 22.6921, lng: 72.8513 },
  { id: 'CAM-GJ-AHM-00017', name: 'Ahmedabad SP Ring Road W', location: 'SP Ring Road, Bopal Junction, Ahmedabad', district: 'Ahmedabad', department: 'Traffic Police', vendor: 'Hikvision', model: 'DS-2CD2T87G2-L', integration: 'RTSP', vms: 'iVMS-4200', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Person Detection', 'Crowd Analytics'], fps: 25, resolution: '8MP', healthScore: 97.8, lastHeartbeat: '2026-09-08T22:23:15+05:30', lat: 23.0074, lng: 72.4614 },
  { id: 'CAM-GJ-AHM-00127', name: 'Ahmedabad Ring Road E-Gate', location: 'Ahmedabad Ring Road, NH-48 Interchange', district: 'Ahmedabad', department: 'City Police', vendor: 'Bosch', model: 'FLEXIDOME 5100i', integration: 'VMS_API', vms: 'Bosch VMS', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Object Detection'], fps: 25, resolution: '1080p', healthScore: 94.5, lastHeartbeat: '2026-09-08T22:22:58+05:30', lat: 23.0513, lng: 72.6391 },
  { id: 'CAM-GJ-GDN-00089', name: 'Gandhinagar Secretariat Gate', location: 'Civil Secretariat, Sector-10, Gandhinagar', district: 'Gandhinagar', department: 'State Government Security', vendor: 'Pelco', model: 'Esprit 2', integration: 'VENDOR_SDK', vms: 'Pelco VideoXpert', status: 'ONLINE', aiCapabilities: ['Person Detection', 'Access Control', 'Perimeter Security'], fps: 25, resolution: '1080p', healthScore: 99.7, lastHeartbeat: '2026-09-08T22:23:22+05:30', lat: 23.2156, lng: 72.6369 },
  { id: 'CAM-GJ-RJK-00212', name: 'Rajkot Gondal Road Toll', location: 'Gondal Road Toll Plaza, Rajkot', district: 'Rajkot', department: 'NHAI', vendor: 'Dahua', model: 'IPC-HFW5842H', integration: 'RTSP', vms: 'DSS Pro', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Toll Monitoring'], fps: 30, resolution: '8MP', healthScore: 98.9, lastHeartbeat: '2026-09-08T22:23:19+05:30', lat: 22.2736, lng: 70.7339 },
  { id: 'CAM-GJ-SRT-00033', name: 'Surat Varachha Market', location: 'Varachha Road, Main Market, Surat', district: 'Surat', department: 'City Police', vendor: 'Hikvision', model: 'DS-2CD2T47G2-L', integration: 'RTSP', vms: 'iVMS-4200', status: 'DEGRADED', aiCapabilities: ['Person Detection', 'Crowd Analytics'], fps: 12, resolution: '1080p', healthScore: 62.1, lastHeartbeat: '2026-09-08T22:20:31+05:30', lat: 21.2172, lng: 72.8681 },
  { id: 'CAM-GJ-BHV-00108', name: 'Bhavnagar Port Gate', location: 'Bhavnagar Port Entry, Alang Road', district: 'Bhavnagar', department: 'Port Authority', vendor: 'Axis', model: 'Q6135-LE', integration: 'ONVIF', vms: 'Axis Camera Station', status: 'ONLINE', aiCapabilities: ['Vehicle Detection', 'ANPR', 'Maritime Monitoring'], fps: 30, resolution: '2MP', healthScore: 95.3, lastHeartbeat: '2026-09-08T22:23:12+05:30', lat: 21.7645, lng: 72.1519 },
  { id: 'CAM-GJ-AHM-00291', name: 'Ahmedabad Airport Road', location: 'Sardar Vallabhbhai Patel Intl Airport, Approach', district: 'Ahmedabad', department: 'AAI / Police', vendor: 'Sony', model: 'SNC-EM641', integration: 'VMS_API', vms: 'Genetec Security Center', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Person Detection', 'Face Detection'], fps: 25, resolution: '4MP', healthScore: 99.2, lastHeartbeat: '2026-09-08T22:23:21+05:30', lat: 23.0669, lng: 72.6178 },
  { id: 'CAM-GJ-KTC-00041', name: 'Kutch Border Checkpoint', location: 'Bhuj-Bhachau Highway, District Entry', district: 'Kutch', department: 'Border Police', vendor: 'Axis', model: 'P1448-LE', integration: 'RTSP', vms: 'Axis Camera Station', status: 'ONLINE', aiCapabilities: ['ANPR', 'Vehicle Detection', 'Person Detection'], fps: 25, resolution: '4K', healthScore: 97.6, lastHeartbeat: '2026-09-08T22:23:17+05:30', lat: 23.2419, lng: 69.6694 },
  { id: 'CAM-GJ-VDB-00074', name: 'Vadodara Sayajigunj Junction', location: 'Sayajigunj Crossroad, Vadodara', district: 'Vadodara', department: 'Traffic Police', vendor: 'Dahua', model: 'IPC-HFW5442H', integration: 'ONVIF', vms: 'SmartPSS', status: 'OFFLINE', aiCapabilities: ['ANPR', 'Vehicle Detection'], fps: 0, resolution: '4MP', healthScore: 0, lastHeartbeat: '2026-09-08T19:41:02+05:30', lat: 22.3122, lng: 73.1875 },
];

// ---------- THE DEMO VEHICLE ----------
export const DEMO_VEHICLE: TrackedVehicle = {
  objectId: 'VEH-8821',
  plate: 'GJ05XX7821',
  type: 'Sedan',
  color: 'White',
  make: 'Honda',
  model: 'City',
  firstSeen: '2026-09-08T21:31:12+05:30',
  lastSeen: '2026-09-08T21:43:18+05:30',
  sightings: [
    { sightingId: 'SIG-001', cameraId: 'CAM-GJ-AHM-00017', cameraLocation: 'SP Ring Road, Bopal Junction, Ahmedabad', timestamp: '2026-09-08T21:31:12+05:30', lat: 23.0074, lng: 72.4614, confidence: 96.2, district: 'Ahmedabad', direction: 'South', snapshotId: 'SNAP-001' },
    { sightingId: 'SIG-002', cameraId: 'CAM-GJ-AHM-00127', cameraLocation: 'Ahmedabad Ring Road, NH-48 Interchange', timestamp: '2026-09-08T21:34:47+05:30', lat: 23.0513, lng: 72.6391, confidence: 94.1, district: 'Ahmedabad', direction: 'South', snapshotId: 'SNAP-002' },
    { sightingId: 'SIG-003', cameraId: 'CAM-GJ-KHD-00031', cameraLocation: 'NH-48, Nadiad Bypass, Kheda', timestamp: '2026-09-08T21:37:44+05:30', lat: 22.6921, lng: 72.8513, confidence: 97.8, district: 'Kheda', direction: 'South', snapshotId: 'SNAP-003' },
    { sightingId: 'SIG-004', cameraId: 'CAM-GJ-SRT-00044', cameraLocation: 'Sachin GIDC Entry, Surat', timestamp: '2026-09-08T21:41:03+05:30', lat: 21.0823, lng: 72.8891, confidence: 95.3, district: 'Surat', direction: 'North-East', snapshotId: 'SNAP-004' },
    { sightingId: 'SIG-005', cameraId: 'CAM-GJ-SRT-00421', cameraLocation: 'Surat Ring Road, NH-53 Junction', timestamp: '2026-09-08T21:43:18+05:30', lat: 21.2021, lng: 72.8473, confidence: 98.1, district: 'Surat', direction: 'North-East', snapshotId: 'SNAP-005' },
  ],
  watchlistMatch: {
    matchId: 'WM-20260908-001',
    entryId: 'WL-SV-00291',
    category: 'STOLEN_VEHICLE',
    identifier: 'GJ05XX7821',
    confidence: 97.4,
    source: 'Gujarat Police Stolen Vehicle Database',
    detectedAt: '2026-09-08T21:43:18+05:30',
    cameraId: 'CAM-GJ-SRT-00421',
    cameraLocation: 'Surat Ring Road, NH-53 Junction',
    riskLevel: 'CRITICAL',
  },
};

// ---------- NORMALIZED EVENTS ----------
export const NORMALIZED_EVENTS: NormalizedEvent[] = [
  { eventId: 'EVT-928381', type: 'VEHICLE_DETECTED', cameraId: 'CAM-GJ-SRT-00421', cameraLocation: 'Surat Ring Road', timestamp: '2026-09-08T21:43:18+05:30', objectId: 'VEH-8821', plate: 'GJ05XX7821', vehicleType: 'Sedan', vehicleColor: 'White', confidence: 0.96, lat: 21.2021, lng: 72.8473, district: 'Surat' },
  { eventId: 'EVT-928382', type: 'PLATE_RECOGNIZED', cameraId: 'CAM-GJ-SRT-00421', cameraLocation: 'Surat Ring Road', timestamp: '2026-09-08T21:43:18+05:30', objectId: 'VEH-8821', plate: 'GJ05XX7821', confidence: 0.94, lat: 21.2021, lng: 72.8473, district: 'Surat' },
  { eventId: 'EVT-928383', type: 'WATCHLIST_MATCH', cameraId: 'CAM-GJ-SRT-00421', cameraLocation: 'Surat Ring Road', timestamp: '2026-09-08T21:43:21+05:30', objectId: 'VEH-8821', plate: 'GJ05XX7821', confidence: 0.974, lat: 21.2021, lng: 72.8473, district: 'Surat' },
  { eventId: 'EVT-928301', type: 'VEHICLE_DETECTED', cameraId: 'CAM-GJ-AHM-00017', cameraLocation: 'SP Ring Road, Ahmedabad', timestamp: '2026-09-08T21:31:12+05:30', objectId: 'VEH-8821', plate: 'GJ05XX7821', vehicleType: 'Sedan', vehicleColor: 'White', confidence: 0.962, lat: 23.0074, lng: 72.4614, district: 'Ahmedabad' },
  { eventId: 'EVT-928020', type: 'PERSON_DETECTED', cameraId: 'CAM-GJ-AHM-00127', cameraLocation: 'Ahmedabad Ring Road', timestamp: '2026-09-08T21:22:05+05:30', objectId: 'PRS-3341', confidence: 0.88, lat: 23.0513, lng: 72.6391, district: 'Ahmedabad', personAttributes: { clothingTop: 'Blue shirt', clothingBottom: 'Dark jeans', direction: 'South', heightEstimate: '5\'8"-5\'10"' } },
  { eventId: 'EVT-927910', type: 'SUSPICIOUS_ACTIVITY', cameraId: 'CAM-GJ-RJK-00212', cameraLocation: 'Gondal Road Toll, Rajkot', timestamp: '2026-09-08T21:15:33+05:30', objectId: 'VEH-7712', plate: 'GJ03KK4421', confidence: 0.82, lat: 22.2736, lng: 70.7339, district: 'Rajkot' },
  { eventId: 'EVT-927850', type: 'VEHICLE_DETECTED', cameraId: 'CAM-GJ-KTC-00041', cameraLocation: 'Kutch Border Checkpoint', timestamp: '2026-09-08T21:12:41+05:30', objectId: 'VEH-6921', plate: 'GJ12MN2291', vehicleType: 'SUV', vehicleColor: 'Black', confidence: 0.971, lat: 23.2419, lng: 69.6694, district: 'Kutch' },
];

// ---------- ALERTS ----------
export const ALERTS: Alert[] = [
  {
    alertId: 'ALT-20260908-001',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    type: 'WATCHLIST_MATCH',
    title: 'STOLEN VEHICLE DETECTED',
    description: 'Vehicle matching stolen vehicle watchlist entry detected at Surat Ring Road. Vehicle was reported stolen on 2026-09-05 from Ahmedabad.',
    entityId: 'VEH-8821',
    entityType: 'VEHICLE',
    entityDescription: 'GJ05XX7821 — White Honda City Sedan',
    cameraId: 'CAM-GJ-SRT-00421',
    cameraLocation: 'Surat Ring Road, NH-53 Junction',
    district: 'Surat',
    lat: 21.2021,
    lng: 72.8473,
    timestamp: '2026-09-08T21:43:21+05:30',
    actionButtons: ['VIEW_LIVE', 'TRACE_VEHICLE', 'OPEN_INVESTIGATION'],
    relatedEvents: ['EVT-928381', 'EVT-928382', 'EVT-928383'],
    investigationId: 'INV-2026-00482',
  },
  {
    alertId: 'ALT-20260908-002',
    severity: 'HIGH',
    status: 'ACKNOWLEDGED',
    type: 'SUSPICIOUS_ACTIVITY',
    title: 'SUSPICIOUS VEHICLE LOITERING',
    description: 'Vehicle observed making multiple slow passes near restricted zone.',
    entityId: 'VEH-7712',
    entityType: 'VEHICLE',
    entityDescription: 'GJ03KK4421 — Dark Blue SUV',
    cameraId: 'CAM-GJ-RJK-00212',
    cameraLocation: 'Gondal Road Toll, Rajkot',
    district: 'Rajkot',
    lat: 22.2736,
    lng: 70.7339,
    timestamp: '2026-09-08T21:18:44+05:30',
    acknowledgedBy: 'D.K. Sharma, Inspector',
    actionButtons: ['VIEW_LIVE', 'TRACE_VEHICLE', 'OPEN_INVESTIGATION'],
  },
  {
    alertId: 'ALT-20260908-003',
    severity: 'HIGH',
    status: 'ACTIVE',
    type: 'PERSON_WATCHLIST',
    title: 'POTENTIAL MATCH — WANTED PERSON',
    description: 'Person observed with attributes matching wanted individual entry. Potential re-identification candidate.',
    entityId: 'PRS-3341',
    entityType: 'PERSON',
    entityDescription: 'Unidentified Male — Blue Shirt, Dark Jeans',
    cameraId: 'CAM-GJ-AHM-00127',
    cameraLocation: 'Ahmedabad Ring Road, NH-48 Interchange',
    district: 'Ahmedabad',
    lat: 23.0513,
    lng: 72.6391,
    timestamp: '2026-09-08T21:22:09+05:30',
    actionButtons: ['VIEW_LIVE', 'TRACE_PERSON', 'OPEN_INVESTIGATION'],
  },
  {
    alertId: 'ALT-20260908-004',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    type: 'CAMERA_OFFLINE',
    title: 'CAMERA OFFLINE — VADODARA',
    description: 'Camera has been offline for 2 hours 42 minutes. Last heartbeat at 19:41. Field maintenance required.',
    entityId: 'CAM-GJ-VDB-00074',
    entityType: 'CAMERA',
    entityDescription: 'CAM-GJ-VDB-00074 — Vadodara Sayajigunj Junction',
    cameraId: 'CAM-GJ-VDB-00074',
    cameraLocation: 'Sayajigunj Crossroad, Vadodara',
    district: 'Vadodara',
    lat: 22.3122,
    lng: 73.1875,
    timestamp: '2026-09-08T19:43:00+05:30',
    actionButtons: [],
  },
  {
    alertId: 'ALT-20260908-005',
    severity: 'LOW',
    status: 'RESOLVED',
    type: 'STREAM_DEGRADED',
    title: 'STREAM QUALITY DEGRADED',
    description: 'Camera stream quality dropped below acceptable threshold. FPS reduced to 12.',
    entityId: 'CAM-GJ-SRT-00033',
    entityType: 'CAMERA',
    entityDescription: 'CAM-GJ-SRT-00033 — Surat Varachha Market',
    cameraId: 'CAM-GJ-SRT-00033',
    cameraLocation: 'Varachha Road, Main Market, Surat',
    district: 'Surat',
    lat: 21.2172,
    lng: 72.8681,
    timestamp: '2026-09-08T20:15:12+05:30',
    actionButtons: [],
  },
];

// ---------- WATCHLIST ----------
export const WATCHLIST_ENTRIES: WatchlistEntry[] = [
  { entryId: 'WL-SV-00291', category: 'STOLEN_VEHICLE', identifier: 'GJ05XX7821', description: 'White Honda City Sedan — Stolen Ahmedabad 2026-09-05', riskLevel: 'CRITICAL', source: 'Gujarat Police Stolen Vehicle Database', addedDate: '2026-09-05', addedBy: 'ACP West Division', active: true, matchCount: 1 },
  { entryId: 'WL-SV-00287', category: 'STOLEN_VEHICLE', identifier: 'GJ01HH3321', description: 'Black Toyota Fortuner SUV — Stolen Surat 2026-09-03', riskLevel: 'HIGH', source: 'Gujarat Police Stolen Vehicle Database', addedDate: '2026-09-03', addedBy: 'Inspector Mehta, Surat South', active: true, matchCount: 0 },
  { entryId: 'WL-WP-00441', category: 'WANTED_PERSON', identifier: 'Ramesh K. [DOB: 1987]', description: 'Wanted — Armed Robbery, Vadodara. Multiple priors.', riskLevel: 'HIGH', source: 'eGujCop Warrant Database', addedDate: '2026-08-22', addedBy: 'DSP Vadodara Rural', active: true, matchCount: 0 },
  { entryId: 'WL-MP-00118', category: 'MISSING_PERSON', identifier: 'Priya S. [DOB: 2010]', description: 'Missing child — Gandhinagar, 3 days. Case #MP-2026-0441.', riskLevel: 'CRITICAL', source: 'Missing Person Unit, Gandhinagar', addedDate: '2026-09-06', addedBy: 'CI Missing Persons Unit', active: true, matchCount: 0 },
  { entryId: 'WL-VW-00091', category: 'VEHICLE_WATCHLIST', identifier: 'GJ09DD1188', description: 'Vehicle of interest — drug trafficking investigation. Do not apprehend, monitor only.', riskLevel: 'MEDIUM', source: 'CID Gujarat', addedDate: '2026-08-15', addedBy: 'CID Inspector', active: true, matchCount: 3 },
  { entryId: 'WL-SV-00273', category: 'STOLEN_VEHICLE', identifier: 'GJ03ZZ9921', description: 'Red Hyundai i20 — Stolen Rajkot 2026-08-29', riskLevel: 'MEDIUM', source: 'Gujarat Police Stolen Vehicle Database', addedDate: '2026-08-29', addedBy: 'Inspector, Rajkot City', active: true, matchCount: 0 },
];

// ---------- INVESTIGATION ----------
export const DEMO_INVESTIGATION: Investigation = {
  investigationId: 'INV-2026-00482',
  title: 'Stolen Vehicle Trace — GJ05XX7821',
  entityId: 'VEH-8821',
  entityType: 'VEHICLE',
  entityDescription: 'GJ05XX7821 — White Honda City Sedan',
  status: 'IN_PROGRESS',
  priority: 'CRITICAL',
  assignedTo: 'PI R.K. Patel, Surat City',
  createdAt: '2026-09-08T21:44:02+05:30',
  updatedAt: '2026-09-08T22:10:15+05:30',
  alertId: 'ALT-20260908-001',
  timeline: [
    { eventId: 'TL-001', timestamp: '2026-09-08T21:31:12+05:30', type: 'VEHICLE_DETECTED', title: 'Vehicle First Detected', description: 'Vehicle GJ05XX7821 detected at SP Ring Road, Bopal Junction, Ahmedabad. ANPR confidence: 96.2%.', cameraId: 'CAM-GJ-AHM-00017', cameraLocation: 'SP Ring Road, Bopal Junction, Ahmedabad', lat: 23.0074, lng: 72.4614, isKeyEvent: false, snapshotId: 'SNAP-001' },
    { eventId: 'TL-002', timestamp: '2026-09-08T21:34:47+05:30', type: 'VEHICLE_DETECTED', title: 'Vehicle — Ahmedabad Ring Road', description: 'Same vehicle tracked to Ahmedabad Ring Road NH-48 Interchange. Heading south toward Kheda.', cameraId: 'CAM-GJ-AHM-00127', cameraLocation: 'Ahmedabad Ring Road, NH-48 Interchange', lat: 23.0513, lng: 72.6391, isKeyEvent: false, snapshotId: 'SNAP-002' },
    { eventId: 'TL-003', timestamp: '2026-09-08T21:37:44+05:30', type: 'VEHICLE_DETECTED', title: 'Vehicle — NH-48 Kheda Checkpoint', description: 'Vehicle passed Nadiad Bypass checkpoint, Kheda. Travelling at approximately 110 km/h.', cameraId: 'CAM-GJ-KHD-00031', cameraLocation: 'NH-48, Nadiad Bypass, Kheda', lat: 22.6921, lng: 72.8513, isKeyEvent: false, snapshotId: 'SNAP-003' },
    { eventId: 'TL-004', timestamp: '2026-09-08T21:41:03+05:30', type: 'VEHICLE_DETECTED', title: 'Vehicle — Surat City Entry', description: 'Vehicle entered Surat city limits via Sachin GIDC Entry. Last camera before watchlist match.', cameraId: 'CAM-GJ-SRT-00044', cameraLocation: 'Sachin GIDC Entry, Surat', lat: 21.0823, lng: 72.8891, isKeyEvent: false, snapshotId: 'SNAP-004' },
    { eventId: 'TL-005', timestamp: '2026-09-08T21:43:18+05:30', type: 'WATCHLIST_MATCH', title: 'WATCHLIST MATCH — STOLEN VEHICLE', description: 'Vehicle matched stolen vehicle watchlist entry WL-SV-00291. Match confidence: 97.4%. Camera: Surat Ring Road NH-53 Junction.', cameraId: 'CAM-GJ-SRT-00421', cameraLocation: 'Surat Ring Road, NH-53 Junction', lat: 21.2021, lng: 72.8473, isKeyEvent: true, snapshotId: 'SNAP-005' },
    { eventId: 'TL-006', timestamp: '2026-09-08T21:43:21+05:30', type: 'ALERT_GENERATED', title: 'CRITICAL ALERT Generated', description: 'System generated CRITICAL alert ALT-20260908-001. Alert broadcast to Surat District Command Center.', isKeyEvent: true },
    { eventId: 'TL-007', timestamp: '2026-09-08T21:44:02+05:30', type: 'INVESTIGATION_OPENED', title: 'Investigation Opened', description: 'Investigation INV-2026-00482 opened by PI R.K. Patel, Surat City.', isKeyEvent: false },
    { eventId: 'TL-008', timestamp: '2026-09-08T22:10:15+05:30', type: 'STATUS_UPDATE', title: 'Field Units Dispatched', description: 'Two patrol units dispatched to Surat Ring Road area. Investigation status: IN_PROGRESS.', isKeyEvent: false },
  ],
  relatedCameras: ['CAM-GJ-AHM-00017', 'CAM-GJ-AHM-00127', 'CAM-GJ-KHD-00031', 'CAM-GJ-SRT-00044', 'CAM-GJ-SRT-00421'],
  relatedEntities: [
    { entityId: 'WL-SV-00291', entityType: 'WATCHLIST_ENTRY', description: 'Stolen Vehicle Watchlist Entry — GJ05XX7821', relationship: 'MATCHED_WITH', confidence: 97.4 },
    { entityId: 'PRS-3341', entityType: 'PERSON', description: 'Unidentified Male — Blue Shirt, last seen Ahmedabad Ring Road 21:22', relationship: 'SEEN_WITH', confidence: 72.1 },
  ],
  evidence: [
    { evidenceId: 'EV-001', type: 'PLATE_READ', title: 'ANPR Read — CAM-AHM-00017', cameraId: 'CAM-GJ-AHM-00017', timestamp: '2026-09-08T21:31:12+05:30', description: 'License plate GJ05XX7821 captured. OCR confidence: 96.2%.', confidence: 96.2 },
    { evidenceId: 'EV-002', type: 'PLATE_READ', title: 'ANPR Read — CAM-SRT-00421', cameraId: 'CAM-GJ-SRT-00421', timestamp: '2026-09-08T21:43:18+05:30', description: 'License plate GJ05XX7821 captured. OCR confidence: 98.1%.', confidence: 98.1 },
    { evidenceId: 'EV-003', type: 'SNAPSHOT', title: 'Vehicle Snapshot — Watchlist Match', cameraId: 'CAM-GJ-SRT-00421', timestamp: '2026-09-08T21:43:18+05:30', description: 'Frame capture at moment of watchlist match detection.' },
    { evidenceId: 'EV-004', type: 'DETECTION_DATA', title: 'AI Detection Record — Full Route', cameraId: 'CAM-GJ-AHM-00017', timestamp: '2026-09-08T21:31:12+05:30', description: '5 camera sightings, 4 ANPR reads, 1 watchlist match across 12-minute window.' },
    { evidenceId: 'EV-005', type: 'EVENT_LOG', title: 'Normalized Event Log', cameraId: 'CAM-GJ-SRT-00421', timestamp: '2026-09-08T21:43:21+05:30', description: 'Platform event chain: EVT-928381 → EVT-928382 → EVT-928383 → ALT-20260908-001.' },
  ],
};

// ---------- SYSTEM HEALTH ----------
export const SYSTEM_HEALTH: SystemHealth = {
  totalCameras: 80000,
  online: 79842,
  offline: 98,
  degraded: 60,
  aiProcessingLoad: 73.4,
  avgStreamLatency: 187,
  droppedFrameRate: 0.23,
  integrationErrors: 3,
  eventsPerMinute: 12847,
  watchlistMatchesToday: 7,
  activeInvestigations: 12,
  criticalAlerts: 2,
  regions: [
    { region: 'North Gujarat', healthPercent: 98.7, cameras: 5000, online: 4935, alerts: 0 },
    { region: 'Central Gujarat', healthPercent: 99.2, cameras: 32650, online: 32385, alerts: 1 },
    { region: 'South Gujarat', healthPercent: 97.9, cameras: 18270, online: 17888, alerts: 1 },
    { region: 'Saurashtra', healthPercent: 99.1, cameras: 16080, online: 15934, alerts: 0 },
    { region: 'Kutch', healthPercent: 98.3, cameras: 1420, online: 1396, alerts: 0 },
  ],
};

// ---------- LIVE TELEMETRY STATS ----------
export const TELEMETRY_STATS: TelemetryStat[] = [
  { label: 'Cameras Connected', value: '79,842', subtext: '/ 80,000+', trend: 'STABLE', status: 'NORMAL', animated: true },
  { label: 'Active AI Streams', value: '79,291', subtext: 'processing', trend: 'STABLE', status: 'NORMAL', animated: true },
  { label: 'AI Events / min', value: '12,847', subtext: 'normalized', trend: 'UP', status: 'NORMAL', animated: true },
  { label: 'Critical Alerts', value: '2', subtext: 'require action', trend: 'UP', status: 'CRITICAL', animated: false },
  { label: 'Investigations Active', value: '12', subtext: 'in progress', trend: 'STABLE', status: 'WARNING', animated: false },
  { label: 'Cameras Offline', value: '98', subtext: '0.12% of fleet', trend: 'STABLE', status: 'WARNING', animated: false },
  { label: 'Watchlist Matches', value: '7', subtext: 'today', trend: 'UP', status: 'WARNING', animated: false },
];

// ---------- RECENT ALERTS FEED ----------
export const ALERT_FEED = [
  { id: 'F001', severity: 'CRITICAL' as const, text: 'Stolen vehicle GJ05XX7821 detected — Surat Ring Road', time: '21:43', district: 'Surat' },
  { id: 'F002', severity: 'HIGH' as const, text: 'Potential wanted person match — Ahmedabad Ring Road', time: '21:22', district: 'Ahmedabad' },
  { id: 'F003', severity: 'HIGH' as const, text: 'Suspicious vehicle loitering — Rajkot Gondal Road', time: '21:18', district: 'Rajkot' },
  { id: 'F004', severity: 'MEDIUM' as const, text: 'Camera offline — Vadodara Sayajigunj Junction (2h 42m)', time: '19:43', district: 'Vadodara' },
  { id: 'F005', severity: 'LOW' as const, text: 'Stream quality degraded — Surat Varachha Market', time: '20:15', district: 'Surat' },
  { id: 'F006', severity: 'INFO' as const, text: 'Watchlist entry matched — Vehicle of interest GJ09DD1188', time: '20:52', district: 'Bharuch' },
  { id: 'F007', severity: 'MEDIUM' as const, text: 'Integration error — VMS API timeout (Rajkot cluster)', time: '20:33', district: 'Rajkot' },
  { id: 'F008', severity: 'INFO' as const, text: 'New camera registered — CAM-GJ-GDN-00312, Gandhinagar', time: '19:00', district: 'Gandhinagar' },
];

// ---------- AI EVENT ANALYTICS TIMESERIES ----------
export const EVENTS_TIMESERIES = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  vehicle: Math.floor(3000 + Math.random() * 5000 + (i > 7 && i < 22 ? 4000 : 0)),
  person: Math.floor(1000 + Math.random() * 2000 + (i > 7 && i < 22 ? 2000 : 0)),
  plate: Math.floor(500 + Math.random() * 2000 + (i > 7 && i < 22 ? 1500 : 0)),
  alert: Math.floor(Math.random() * 8),
}));

// ---------- CONNECTOR TYPES ----------
export const CONNECTOR_TYPES = [
  { id: 'RTSP', name: 'RTSP Stream', description: 'Direct RTSP/RTP stream ingestion over IP network', cameras: 42180, color: '#00b4d8', icon: '📡' },
  { id: 'ONVIF', name: 'ONVIF Protocol', description: 'Industry-standard ONVIF Profile S/T/G integration', cameras: 18640, color: '#7c3aed', icon: '🔌' },
  { id: 'VMS_API', name: 'VMS REST API', description: 'Video Management System vendor REST API integration', cameras: 12280, color: '#059669', icon: '🔗' },
  { id: 'VENDOR_API', name: 'Vendor Cloud API', description: 'Cloud-native camera vendor API (Hikvision Hik-Connect, Dahua DSS)', cameras: 4820, color: '#d97706', icon: '☁️' },
  { id: 'VENDOR_SDK', name: 'Vendor SDK', description: 'Direct vendor SDK integration for proprietary systems', cameras: 1922, color: '#dc2626', icon: '🛠️' },
];
