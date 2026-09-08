from fastapi import APIRouter, HTTPException
from typing import List, Dict

from integration.camera_registry import camera_registry

router = APIRouter()

@router.get("/")
async def list_cameras():
    """Returns safe camera definitions without exposing credentials."""
    return {"cameras": camera_registry.get_all()}

@router.get("/{camera_id}")
async def get_camera(camera_id: str):
    cameras = camera_registry.get_all()
    cam = next((c for c in cameras if c["id"] == camera_id), None)
    if not cam:
        raise HTTPException(status_code=404, detail="Camera not found")
    return cam
