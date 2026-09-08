import os
import logging
import asyncio
import subprocess
from datetime import datetime
from typing import Optional, Callable

logger = logging.getLogger(__name__)

class FFmpegRunner:
    def __init__(self, camera_id: str, rtsp_url: str, output_dir: str):
        self.camera_id = camera_id
        self.rtsp_url = rtsp_url
        self.output_dir = output_dir
        self.process: Optional[asyncio.subprocess.Process] = None
        self.start_time: Optional[datetime] = None
        self.is_running = False
        self._on_stop_callback: Optional[Callable] = None

        # Ensure camera-specific output directory exists
        self.camera_hls_dir = os.path.join(output_dir, camera_id)
        os.makedirs(self.camera_hls_dir, exist_ok=True)
        self.hls_index_file = os.path.join(self.camera_hls_dir, "index.m3u8")

    async def start(self) -> bool:
        if self.is_running:
            logger.warning(f"[{self.camera_id}] FFmpeg is already running.")
            return True

        # Clean up old HLS files
        self._cleanup_old_files()

        # Build FFmpeg command
        cmd = [
            "ffmpeg",
            "-rtsp_transport", "tcp",
            "-i", self.rtsp_url,
            # Video codec and preset for low latency HLS
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-g", "50",
            "-sc_threshold", "0",
            "-f", "hls",
            "-hls_time", "2",
            "-hls_list_size", "5",
            "-hls_flags", "delete_segments+append_list",
            "-hls_segment_filename", os.path.join(self.camera_hls_dir, "segment_%03d.ts"),
            self.hls_index_file
        ]

        # Log sanitized command
        sanitized_cmd = [c if not c.startswith("rtsp://") else "rtsp://[REDACTED]@[REDACTED]..." for c in cmd]
        logger.info(f"[{self.camera_id}] Starting FFmpeg: {' '.join(sanitized_cmd)}")

        try:
            self.process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL # In production, you might want to capture stderr to log errors
            )
            self.is_running = True
            self.start_time = datetime.now()
            
            # Start background task to monitor process
            asyncio.create_task(self._monitor_process())
            
            return True
        except Exception as e:
            logger.error(f"[{self.camera_id}] Failed to start FFmpeg: {e}")
            self.is_running = False
            return False

    async def stop(self):
        if not self.is_running or not self.process:
            return

        logger.info(f"[{self.camera_id}] Stopping FFmpeg process...")
        try:
            self.process.terminate()
            await asyncio.wait_for(self.process.wait(), timeout=5.0)
        except asyncio.TimeoutError:
            logger.warning(f"[{self.camera_id}] FFmpeg didn't terminate gracefully. Killing process.")
            self.process.kill()
            await self.process.wait()
        except Exception as e:
            logger.error(f"[{self.camera_id}] Error while stopping FFmpeg: {e}")
        
        self.is_running = False
        self.process = None
        self.start_time = None

    def set_on_stop_callback(self, callback: Callable):
        """Callback invoked when process unexpectedly exits."""
        self._on_stop_callback = callback

    async def _monitor_process(self):
        """Monitors the process and triggers callback if it exits unexpectedly."""
        if not self.process:
            return
            
        await self.process.wait()
        
        # If it reached here, the process exited
        exit_code = self.process.returncode
        was_running = self.is_running
        self.is_running = False
        self.process = None
        
        if was_running:
            logger.warning(f"[{self.camera_id}] FFmpeg exited unexpectedly with code {exit_code}")
            if self._on_stop_callback:
                # Use asyncio.create_task to run callback without blocking
                asyncio.create_task(self._on_stop_callback(self.camera_id, exit_code))

    def _cleanup_old_files(self):
        """Remove old HLS files before starting a new stream."""
        try:
            for filename in os.listdir(self.camera_hls_dir):
                if filename.endswith(".m3u8") or filename.endswith(".ts"):
                    file_path = os.path.join(self.camera_hls_dir, filename)
                    os.remove(file_path)
        except Exception as e:
            logger.warning(f"[{self.camera_id}] Error cleaning up old HLS files: {e}")

    def get_uptime_seconds(self) -> int:
        if not self.is_running or not self.start_time:
            return 0
        return int((datetime.now() - self.start_time).total_seconds())
