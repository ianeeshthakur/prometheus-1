import logging
from typing import Dict, Any, List
import schemas

logger = logging.getLogger(__name__)

class SentinelCameraSource:
    """
    Adapter boundary for mapping external Sentinel JSON responses into the canonical Camera schema.
    This prevents tying the core DB to external APIs, and allows future Sentinel API structural changes
    to be isolated here.
    """
    
    @staticmethod
    def normalize(payload: Dict[str, Any]) -> schemas.CameraCreate:
        """
        Maps a generic JSON payload (e.g., from Sentinel API) into a valid CameraCreate schema.
        Since the actual Sentinel API structure is currently unknown, we try to map fields 
        opportunistically or use defaults.
        """
        
        # Example mappings (would be adapted to real Sentinel fields when known):
        # We try to extract from expected standardized fields or fallback
        
        camera_uid = payload.get("camera_uid") or payload.get("id") or payload.get("camera_id")
        if not camera_uid:
            raise ValueError("Missing unique identifier for camera")
            
        protocol = payload.get("protocol_type", "RTSP").upper()
        if protocol not in [p.value for p in schemas.ProtocolType]:
            protocol = schemas.ProtocolType.RTSP.value
            
        status = payload.get("status", "ACTIVE").upper()
        if status not in [s.value for s in schemas.CameraStatus]:
            status = schemas.CameraStatus.ACTIVE.value

        # Parse AI enabled as boolean
        ai_enabled = payload.get("ai_enabled", False)
        if isinstance(ai_enabled, str):
            ai_enabled = ai_enabled.lower() in ("true", "1", "yes")

        # Parse coordinates safely
        lat = payload.get("latitude")
        lng = payload.get("longitude")
        try:
            lat = float(lat) if lat is not None else None
            lng = float(lng) if lng is not None else None
        except ValueError:
            lat, lng = None, None

        return schemas.CameraCreate(
            camera_uid=str(camera_uid),
            name=payload.get("name", f"Camera {camera_uid}"),
            department=payload.get("department", "Unknown"),
            district=payload.get("district", "Unknown"),
            location=payload.get("location", "Unknown Location"),
            latitude=lat,
            longitude=lng,
            vms_vendor=payload.get("vms_vendor", "Sentinel"),
            protocol_type=schemas.ProtocolType(protocol),
            status=schemas.CameraStatus(status),
            ai_enabled=ai_enabled,
            rtsp_url=payload.get("rtsp_url")
        )

    @staticmethod
    def normalize_list(payloads: List[Dict[str, Any]]) -> List[schemas.CameraCreate]:
        results = []
        for p in payloads:
            try:
                results.append(SentinelCameraSource.normalize(p))
            except Exception as e:
                logger.error(f"Failed to normalize payload: {e}. Payload: {p}")
        return results
