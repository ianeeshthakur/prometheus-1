'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { CAMERA_CLUSTERS, DEMO_VEHICLE, ALERTS } from '@/lib/mock-data';
import { DemoPhase } from '@/lib/demo-engine';
import { MapPin, Zap } from 'lucide-react';

interface GujaratMapProps {
  demoPhase: DemoPhase;
  onCameraClick?: (cameraId: string) => void;
  onAlertClick?: (alertId: string) => void;
  showTracePath: boolean;
  mapZoomTarget: { lat: number; lng: number; zoom: number } | null;
}

export function GujaratMap({
  demoPhase,
  showTracePath,
  mapZoomTarget,
  onCameraClick,
  onAlertClick,
}: GujaratMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const { theme } = useTheme();
  const [mapType, setMapType] = useState<'satellite' | 'streets'>('satellite');
  const [mapReady, setMapReady] = useState(false);
  const clusterLayerRef = useRef<any>(null);
  const traceLayerRef = useRef<any>(null);
  const incidentLayerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || leafletMapRef.current) return;

    import('leaflet').then((L) => {
      if (!mapRef.current || leafletMapRef.current || (mapRef.current as any)._leaflet_id) return;

      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [22.2587, 71.1924],
        zoom: 6,
        zoomControl: true,
        attributionControl: true,
        minZoom: 6,
        maxZoom: 16,
      });

      const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

      tileLayerRef.current = L.tileLayer(tileUrl, { 
        attribution: 'Tiles &copy; Esri', 
        maxZoom: 19, 
      }).addTo(map);

      leafletMapRef.current = map;

      // Add Gujarat boundary approximation
      const gujaratBounds: [number, number][] = [
        [24.7, 68.2], [24.7, 72.0], [24.0, 72.8], [23.9, 74.4],
        [23.2, 74.5], [22.7, 74.6], [22.0, 74.0], [21.5, 73.5],
        [21.0, 73.1], [20.6, 72.8], [20.5, 71.5], [20.9, 70.5],
        [21.0, 69.5], [21.6, 68.9], [22.4, 68.6], [23.2, 68.2],
        [24.7, 68.2],
      ];

      L.polygon(gujaratBounds, {
        color: 'rgba(14, 165, 233, 0.4)',
        fillColor: 'rgba(14, 165, 233, 0.04)',
        fillOpacity: 1,
        weight: 1.5,
        dashArray: '4 3',
      }).addTo(map);

      // Add camera cluster markers
      const clusterGroup = L.layerGroup();

      CAMERA_CLUSTERS.forEach((cluster) => {
        const size = cluster.total > 10000 ? 52 : cluster.total > 5000 ? 44 : cluster.total > 1000 ? 38 : 30;
        const hasAlert = cluster.hasActiveAlert;

        const icon = L.divIcon({
          html: `
            <div class="cluster-marker ${hasAlert ? 'has-alert' : ''}" style="width:${size}px;height:${size}px;font-size:${size > 40 ? 11 : 9}px">
              <div style="text-align:center;line-height:1.2">
                <div style="font-weight:700">${cluster.total > 1000 ? Math.round(cluster.total / 1000) + 'K' : cluster.total}</div>
                ${size > 36 ? `<div style="font-size:8px;opacity:0.7;text-transform:uppercase;letter-spacing:0.04em">${cluster.district.substring(0, 4)}</div>` : ''}
              </div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          className: '',
        });

        const marker = L.marker([cluster.lat, cluster.lng], { icon })
          .bindPopup(`
            <div style="font-family:Inter,sans-serif; min-width: 150px; padding: 2px;">
              <div style="font-size:12px;font-weight:800;color:#0f172a;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.05em">
                ${cluster.district} Cluster
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:11px;color:#64748b;font-weight:500">Total Cameras</span>
                <span style="font-size:11px;font-weight:700;color:#0f172a">${cluster.total.toLocaleString()}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:11px;color:#64748b;font-weight:500">Status</span>
                <span style="font-size:11px;font-weight:700;color:#10b981">99% Online</span>
              </div>
              ${hasAlert ? `
              <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid #fee2e2">
                <span style="font-size:11px;font-weight:800;color:#ef4444;letter-spacing:0.02em">CRITICAL ALERTS</span>
                <span style="font-size:11px;font-weight:800;color:#ef4444;background:#fef2f2;padding:2px 6px;border-radius:10px border:1px solid #fecaca">2 ACTIVE</span>
              </div>
              ` : ''}
            </div>
          `);
        
        marker.on('click', () => {
          const currentZoom = map.getZoom();
          const targetZoom = Math.max(12, Math.min(currentZoom + 2, 14));
          map.flyTo([cluster.lat, cluster.lng], targetZoom, {
            duration: 1.0,
            easeLinearity: 0.25
          });
        });

        marker.addTo(clusterGroup);
      });

      clusterGroup.addTo(map);
      clusterLayerRef.current = clusterGroup;

      const cameraLayerRef = { current: L.layerGroup() };

      // Generate some individual cameras from CAMERAS mock data
      import('@/lib/mock-data').then(({ CAMERAS }) => {
        CAMERAS.forEach((cam) => {
          const icon = L.divIcon({
            html: `
              <div style="width:16px;height:16px;border-radius:50%;background:${cam.status === 'ONLINE' ? '#10b981' : cam.status === 'OFFLINE' ? '#ef4444' : '#f59e0b'};border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
                <div style="width:4px;height:4px;border-radius:50%;background:white"></div>
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            className: ''
          });

          const marker = L.marker([cam.lat, cam.lng], { icon });
          marker.on('click', () => {
            map.flyTo([cam.lat, cam.lng], 15, { duration: 0.6 });
            if (onCameraClick) onCameraClick(cam.id);
          });
          marker.addTo(cameraLayerRef.current);
        });
      });

      // Handle zoom events to toggle between clusters and cameras
      map.on('zoomend', () => {
        const zoom = map.getZoom();
        if (zoom >= 11) {
          if (map.hasLayer(clusterGroup)) map.removeLayer(clusterGroup);
          if (!map.hasLayer(cameraLayerRef.current)) map.addLayer(cameraLayerRef.current);
        } else {
          if (!map.hasLayer(clusterGroup)) map.addLayer(clusterGroup);
          if (map.hasLayer(cameraLayerRef.current)) map.removeLayer(cameraLayerRef.current);
        }
      });

      setMapReady(true);
    });

    return () => {
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Handle mapZoomTarget changes
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !mapZoomTarget) return;
    const map = leafletMapRef.current as L.Map;
    map.flyTo([mapZoomTarget.lat, mapZoomTarget.lng], mapZoomTarget.zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [mapZoomTarget, mapReady]);

  // Handle demo phase changes
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current) return;

    import('leaflet').then((L) => {
      const map = leafletMapRef.current as { flyTo: (c: [number, number], z: number, opts: object) => void; removeLayer: (l: unknown) => void };

      // Show trace path
      if (showTracePath && DEMO_VEHICLE.sightings.length > 0) {
        // Remove previous trace
        if (traceLayerRef.current) {
          (map as unknown as { removeLayer: (l: unknown) => void }).removeLayer(traceLayerRef.current);
        }

        const lmap = leafletMapRef.current as L.Map;
        const traceGroup = L.layerGroup();

        // Route polyline
        const coords: [number, number][] = DEMO_VEHICLE.sightings.map(s => [s.lat, s.lng]);
        const polyline = L.polyline(coords, {
          color: '#0ea5e9',
          weight: 3,
          opacity: 0.85,
          dashArray: '8 4',
        });
        polyline.addTo(traceGroup);

        // Sighting markers
        DEMO_VEHICLE.sightings.forEach((sighting, index) => {
          const isLast = index === DEMO_VEHICLE.sightings.length - 1;
          const color = isLast ? '#ef4444' : '#0ea5e9';
          const time = new Date(sighting.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });

          const icon = L.divIcon({
            html: `
              <div style="position:relative">
                <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #080c12;box-shadow:0 0 10px ${color}44"></div>
                <div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);white-space:nowrap;background:rgba(8,12,18,0.9);color:${color};font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;font-family:JetBrains Mono,monospace;border:1px solid ${color}44">
                  ${time}
                </div>
              </div>
            `,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            className: '',
          });

          L.marker([sighting.lat, sighting.lng], { icon })
            .bindPopup(`
              <div style="font-family:Inter,sans-serif">
                <div style="font-size:11px;font-weight:700;color:#f0f4f8;margin-bottom:4px">Sighting #${index + 1}</div>
                <div style="font-size:10px;color:#94a3b8">${sighting.cameraLocation}</div>
                <div style="font-size:10px;color:#0ea5e9;margin-top:3px;font-family:JetBrains Mono,monospace">${time}</div>
                <div style="font-size:10px;color:#94a3b8">${sighting.cameraId}</div>
                ${isLast ? '<div style="margin-top:6px;padding:3px 6px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:3px;font-size:9px;font-weight:700;color:#ef4444">⚠ WATCHLIST MATCH</div>' : ''}
              </div>
            `)
            .addTo(traceGroup);
        });

        traceGroup.addTo(lmap);
        traceLayerRef.current = traceGroup;
      }

      // Show incident marker on alert
      if (demoPhase === 'MAP_ZOOM' || demoPhase === 'ALERT_PANEL_OPEN' || demoPhase === 'TRACE_STARTED' || demoPhase === 'ROUTE_ANIMATING') {
        if (incidentLayerRef.current) {
          (map as unknown as { removeLayer: (l: unknown) => void }).removeLayer(incidentLayerRef.current);
        }

        const lmap = leafletMapRef.current as L.Map;
        const incidentGroup = L.layerGroup();

        const alertLocation = ALERTS[0];
        const pulseIcon = L.divIcon({
          html: `
            <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center">
              <div style="position:absolute;width:24px;height:24px;border-radius:50%;border:1px solid rgba(239, 68, 68, 0.6);animation:pulse-critical 2.5s ease-in-out infinite;opacity:0.6"></div>
              <div style="width:10px;height:10px;border-radius:50%;background:#ef4444;border:1px solid #7f1d1d"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          className: '',
        });

        const marker = L.marker([alertLocation.lat, alertLocation.lng], { icon: pulseIcon });
        
        marker.on('click', () => {
          map.flyTo([alertLocation.lat, alertLocation.lng], 16, { duration: 0.8 });
          if (onAlertClick) {
            onAlertClick(alertLocation.id);
          }
        });
        
        marker.addTo(incidentGroup);

        incidentGroup.addTo(lmap);
        incidentLayerRef.current = incidentGroup;
      }
    });
  }, [demoPhase, showTracePath, mapZoomTarget, mapReady]);

  // Handle Map Type Changes
  useEffect(() => {
    if (tileLayerRef.current) {
      if (mapType === 'satellite') {
        tileLayerRef.current.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
      } else {
        tileLayerRef.current.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      }
    }
  }, [mapType]);

  return (
    <div className="relative w-full h-full bg-[var(--bg-primary)]">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Control */}
      <div 
        className="absolute top-4 left-4 bg-[var(--bg-panel)]/90 backdrop-blur-md border border-[var(--border)] rounded-lg p-2 shadow-[var(--shadow-elevated)] flex flex-col gap-1"
        style={{ zIndex: 1000 }}
      >
        <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider px-2 py-1 mb-1">MAP LAYER</div>
        <button 
          onClick={() => setMapType('satellite')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${mapType === 'satellite' ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-input)]'}`}
        >
          <div className={`w-2 h-2 rounded-full ${mapType === 'satellite' ? 'bg-[var(--accent-cyan)]' : 'border border-[var(--text-muted)]'}`} />
          Satellite
        </button>
        <button 
          onClick={() => setMapType('streets')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${mapType === 'streets' ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-input)]'}`}
        >
          <div className={`w-2 h-2 rounded-full ${mapType === 'streets' ? 'bg-[var(--accent-cyan)]' : 'border border-[var(--text-muted)]'}`} />
          Streets
        </button>
      </div>

      {/* Map Legend */}
      <div
        className="absolute bottom-4 left-4 glass-panel p-3 flex flex-col gap-2"
        style={{ zIndex: 1000, minWidth: 160 }}
      >
        <div className="label-xs" style={{ marginBottom: 2 }}>MAP LEGEND</div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(14,165,233,0.3)', border: '2px solid rgba(14,165,233,0.7)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Camera Cluster</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(239,68,68,0.3)', border: '2px solid rgba(239,68,68,0.7)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Active Incident</span>
        </div>
        {showTracePath && (
          <div className="flex items-center gap-2">
            <div style={{ width: 24, height: 2, background: '#0ea5e9', borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--accent-cyan)' }}>Vehicle Route</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 14, borderRadius: 2, border: '1px dashed rgba(14,165,233,0.4)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Gujarat Border</span>
        </div>
      </div>

      {/* Zoom-level indicator */}
      <div
        className="absolute top-3 right-3 glass-panel px-2 py-1"
        style={{ zIndex: 1000, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}
      >
        80,000+ CAMERAS
      </div>
    </div>
  );
}
