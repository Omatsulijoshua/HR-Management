'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled UI error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Something went wrong</h2>
          <p className="text-xs text-slate-500 mt-1">{error.message || 'An error occurred while loading this view.'}</p>
        </div>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
        >
          Try Again
        </button>
      </Card>
    </div>
  );
}
