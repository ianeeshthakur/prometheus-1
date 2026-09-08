// G-VISTA Demo Engine
// Orchestrates the automated hero demo flow

import { DEMO_VEHICLE, ALERTS } from './mock-data';

export type DemoPhase =
  | 'IDLE'
  | 'VEHICLE_DETECTED'
  | 'PLATE_RECOGNIZED'
  | 'WATCHLIST_QUERIED'
  | 'WATCHLIST_MATCHED'
  | 'ALERT_GENERATED'
  | 'MAP_ZOOM'
  | 'ALERT_PANEL_OPEN'
  | 'TRACE_STARTED'
  | 'ROUTE_ANIMATING'
  | 'INVESTIGATION_OPEN'
  | 'COMPLETE';

export interface DemoState {
  phase: DemoPhase;
  currentSightingIndex: number;
  activeAlertId: string | null;
  activeInvestigationId: string | null;
  mapZoomTarget: { lat: number; lng: number; zoom: number } | null;
  showTracePath: boolean;
  showAlertPanel: boolean;
  processLog: string[];
}

export const INITIAL_DEMO_STATE: DemoState = {
  phase: 'IDLE',
  currentSightingIndex: -1,
  activeAlertId: null,
  activeInvestigationId: null,
  mapZoomTarget: null,
  showTracePath: false,
  showAlertPanel: false,
  processLog: [],
};

export const DEMO_SCRIPT = [
  { phase: 'VEHICLE_DETECTED' as DemoPhase, delay: 2000, log: '🎥 AI Event: VEHICLE_DETECTED — GJ05XX7821 @ CAM-GJ-SRT-00421' },
  { phase: 'PLATE_RECOGNIZED' as DemoPhase, delay: 3500, log: '🔍 ANPR: Plate recognized — GJ05XX7821 (confidence: 98.1%)' },
  { phase: 'WATCHLIST_QUERIED' as DemoPhase, delay: 5000, log: '📋 Intelligence: Querying watchlist databases...' },
  { phase: 'WATCHLIST_MATCHED' as DemoPhase, delay: 6800, log: '⚠️ MATCH: STOLEN VEHICLE — Gujarat Police DB (97.4%)' },
  { phase: 'ALERT_GENERATED' as DemoPhase, delay: 8000, log: '🚨 CRITICAL ALERT Generated — ALT-20260908-001' },
  { phase: 'MAP_ZOOM' as DemoPhase, delay: 9200, log: '🗺️ Map: Zooming to incident location — Surat Ring Road' },
  { phase: 'ALERT_PANEL_OPEN' as DemoPhase, delay: 10500, log: '📍 Alert panel opened — camera sightings available' },
  { phase: 'TRACE_STARTED' as DemoPhase, delay: 13000, log: '🔄 TRACE: Querying historical camera sightings...' },
  { phase: 'ROUTE_ANIMATING' as DemoPhase, delay: 15000, log: '🛣️ Route: Ahmedabad → Kheda → Surat (12 min window)' },
  { phase: 'INVESTIGATION_OPEN' as DemoPhase, delay: 20000, log: '📂 Investigation INV-2026-00482 opened' },
  { phase: 'COMPLETE' as DemoPhase, delay: 22000, log: '✅ Demo complete — 5 cameras, 4 sightings, 1 watchlist match' },
];

export const DEMO_ALERT = ALERTS[0];
export const DEMO_SIGHTINGS = DEMO_VEHICLE.sightings;

export function getDemoZoomTarget(phase: DemoPhase) {
  switch (phase) {
    case 'MAP_ZOOM':
    case 'ALERT_PANEL_OPEN':
      return { lat: 21.2021, lng: 72.8473, zoom: 13 }; // Surat Ring Road
    case 'TRACE_STARTED':
    case 'ROUTE_ANIMATING':
      return { lat: 22.5, lng: 72.65, zoom: 8 }; // Gujarat overview showing full route
    default:
      return null;
  }
}
