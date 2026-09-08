import logging
from typing import List, Dict, Any, Optional
import random

logger = logging.getLogger(__name__)

class DetectionService:
    """Abstraction for YOLO / Object Detection models."""
    def __init__(self):
        self.is_available = True
        
    async def detect_frame(self, camera_id: str, frame_data: bytes) -> List[Dict[str, Any]]:
        """
        In a real scenario, this sends the frame to a GPU inference container.
        Here we mock the detection to return realistic-looking data.
        """
        if not self.is_available:
            return []
            
        # Mock logic: occasionally return detections for demonstration
        if random.random() < 0.1:
            return [{
                "type": "VEHICLE",
                "confidence": 0.94,
                "bbox": [120, 45, 340, 280]
            }]
        return []

class OCRService:
    """Abstraction for PaddleOCR / LPR models."""
    def __init__(self):
        self.is_available = True
        
    async def read_plate(self, crop_data: bytes) -> Optional[Dict[str, Any]]:
        if not self.is_available:
            return None
            
        # Mock logic: return a realistic plate
        if random.random() < 0.3:
            return {
                "text": "GJ05XX7821",
                "confidence": 0.98
            }
        return None

# Singleton instances
detection_service = DetectionService()
ocr_service = OCRService()
