'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white p-8">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
      <div className="bg-red-950/50 p-4 rounded border border-red-900 mb-6 max-w-2xl overflow-auto w-full">
        <p className="font-mono text-sm">{error.message}</p>
        {error.stack && (
          <pre className="mt-4 text-xs text-red-300 overflow-x-auto">
            {error.stack}
          </pre>
        )}
      </div>
      <button
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
