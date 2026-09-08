// G-VISTA Type Definitions
// Gujarat Video Intelligence & Surveillance Technology Architecture

export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ESCALATED';
export type IntegrationMethod = 'RTSP' | 'ONVIF' | 'VMS_API' | 'VENDOR_API' | 'VENDOR_SDK' | 'DIRECT_IP';
export type WatchlistCategory = 'STOLEN_VEHICLE' | 'WANTED_PERSON' | 'MISSING_PERSON' | 'VEHICLE_WATCHLIST' | 'CUSTOM';
export type InvestigationStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'CLOSED';
export type EntityType = 'VEHICLE' | 'PERSON' | 'CAMERA' | 'LOCATION' | 'EVENT' | 'WATCHLIST_ENTRY';

// ---------- Camera ----------
export interface Camera {
  id: string;
  name: string;
  location: string;
  district: string;
  department: string;
  vendor: string;
  model: string;
  integration: IntegrationMethod;
  vms: string;
  status: CameraStatus;
  aiCapabilities: string[];
  fps: number;
  resolution: string;
  healthScore: number;
  lastHeartbeat: string;
  lat: number;
  lng: number;
  streamKey?: string;
}

export interface CameraCluster {
  district: string;
  lat: number;
  lng: number;
  total: number;
  online: number;
  offline: number;
  degraded: number;
  hasActiveAlert: boolean;
}

// ---------- Detection / Events ----------
export interface NormalizedEvent {
  eventId: string;
  type: 'VEHICLE_DETECTED' | 'PLATE_RECOGNIZED' | 'PERSON_DETECTED' | 'WATCHLIST_MATCH' | 'SUSPICIOUS_ACTIVITY' | 'CAMERA_OFFLINE' | 'ZONE_INTRUSION';
  cameraId: string;
  cameraLocation: string;
  timestamp: string;
  objectId: string;
  plate?: string;
  vehicleType?: string;
  vehicleColor?: string;
  personAttributes?: PersonAttributes;
  confidence: number;
  lat: number;
  lng: number;
  district: string;
}

export interface PersonAttributes {
  estimatedAge?: string;
  clothingTop?: string;
  clothingBottom?: string;
  carriedObject?: string;
  direction?: string;
  heightEstimate?: string;
}

// ---------- Tracked Entities ----------
export interface TrackedVehicle {
  objectId: string;
  plate: string;
  type: string;
  color: string;
  make?: string;
  model?: string;
  firstSeen: string;
  lastSeen: string;
  sightings: CameraSighting[];
  watchlistMatch?: WatchlistMatch;
}

export interface TrackedPerson {
  objectId: string;
  description: string;
  attributes: PersonAttributes;
  firstSeen: string;
  lastSeen: string;
  sightings: CameraSighting[];
  watchlistMatch?: WatchlistMatch;
}

export interface CameraSighting {
  sightingId: string;
  cameraId: string;
  cameraLocation: string;
  timestamp: string;
  lat: number;
  lng: number;
  confidence: number;
  snapshotId?: string;
  district: string;
  direction?: string;
}

// ---------- Watchlist ----------
export interface WatchlistEntry {
  entryId: string;
  category: WatchlistCategory;
  identifier: string; // plate or name/alias
  description: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  addedDate: string;
  addedBy: string;
  active: boolean;
  matchCount: number;
}

export interface WatchlistMatch {
  matchId: string;
  entryId: string;
  category: WatchlistCategory;
  identifier: string;
  confidence: number;
  source: string;
  detectedAt: string;
  cameraId: string;
  cameraLocation: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

// ---------- Alerts ----------
export interface Alert {
  alertId: string;
  severity: AlertSeverity;
  status: AlertStatus;
  type: string;
  title: string;
  description: string;
  entityId: string;
  entityType: EntityType;
  entityDescription: string;
  cameraId: string;
  cameraLocation: string;
  district: string;
  lat: number;
  lng: number;
  timestamp: string;
  confidence?: number;
  source?: string;
  watchlistType?: string;
  evidenceImage?: string;
  acknowledgedBy?: string;
  investigationId?: string;
  actionButtons: ('VIEW_LIVE' | 'TRACE_VEHICLE' | 'TRACE_PERSON' | 'OPEN_INVESTIGATION' | 'VIEW_DETAILS' | 'CREATE_CASE' | 'DIAGNOSTICS' | 'RETRY' | 'VIEW_CAMERA')[];
  relatedEvents?: string[];
}

// ---------- Investigations ----------
export interface Investigation {
  investigationId: string;
  title: string;
  entityId: string;
  entityType: EntityType;
  entityDescription: string;
  status: InvestigationStatus;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  alertId?: string;
  timeline: TimelineEvent[];
  relatedCameras: string[];
  relatedEntities: RelatedEntity[];
  evidence: EvidenceItem[];
}

export interface TimelineEvent {
  eventId: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
  cameraId?: string;
  cameraLocation?: string;
  lat?: number;
  lng?: number;
  isKeyEvent: boolean;
  snapshotId?: string;
}

export interface RelatedEntity {
  entityId: string;
  entityType: EntityType;
  description: string;
  relationship: string;
  confidence: number;
}

export interface EvidenceItem {
  evidenceId: string;
  type: 'SNAPSHOT' | 'CLIP' | 'EVENT_LOG' | 'PLATE_READ' | 'DETECTION_DATA';
  title: string;
  cameraId: string;
  timestamp: string;
  description: string;
  confidence?: number;
}

// ---------- System Health ----------
export interface SystemHealth {
  totalCameras: number;
  online: number;
  offline: number;
  degraded: number;
  aiProcessingLoad: number;
  avgStreamLatency: number;
  droppedFrameRate: number;
  integrationErrors: number;
  eventsPerMinute: number;
  watchlistMatchesToday: number;
  activeInvestigations: number;
  criticalAlerts: number;
  regions: RegionHealth[];
}

export interface RegionHealth {
  region: string;
  healthPercent: number;
  cameras: number;
  online: number;
  alerts: number;
}

// ---------- Telemetry Stat ----------
export interface TelemetryStat {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  status?: 'NORMAL' | 'WARNING' | 'CRITICAL';
  animated?: boolean;
}

// ---------- Demo Engine ----------
export interface DemoStep {
  id: string;
  delay: number; // ms from start
  type: 'EVENT' | 'MAP_ZOOM' | 'ALERT' | 'TRACE' | 'INVESTIGATION';
  payload: Record<string, unknown>;
}
