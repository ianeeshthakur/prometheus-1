export type AppMode = 'DEMO' | 'LIVE';

export function getAppMode(): AppMode {
  // Can be controlled via environment variable
  return (process.env.NEXT_PUBLIC_APP_MODE as AppMode) || 'DEMO';
}

export function isLiveMode(): boolean {
  return getAppMode() === 'LIVE';
}

export function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
}
