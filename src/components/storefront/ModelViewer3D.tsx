'use client';

import { useEffect, useState } from 'react';

type ModelViewer3DProps = {
  modelUrl: string;
  posterUrl?: string;
};

export default function ModelViewer3D({ modelUrl, posterUrl }: ModelViewer3DProps) {
  const [viewerReady, setViewerReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.customElements?.get('model-viewer')) {
      setViewerReady(true);
      return;
    }

    const existing = document.querySelector('script[data-model-viewer="true"]');

    const handleReady = () => {
      if (window.customElements?.get('model-viewer')) {
        setViewerReady(true);
      }
    };

    const handleError = () => {
      setLoadError(true);
    };

    if (existing instanceof HTMLScriptElement) {
      existing.addEventListener('load', handleReady);
      existing.addEventListener('error', handleError);
      handleReady();

      return () => {
        existing.removeEventListener('load', handleReady);
        existing.removeEventListener('error', handleError);
      };
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer.min.js';
    script.setAttribute('data-model-viewer', 'true');
    script.addEventListener('load', handleReady);
    script.addEventListener('error', handleError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleReady);
      script.removeEventListener('error', handleError);
    };
  }, []);

  if (loadError) {
    return (
      <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-beige to-cream-dark border border-nude/30">
        <p className="px-6 text-center text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
          3D viewer could not load right now. Please refresh and try again.
        </p>
      </div>
    );
  }

  if (!viewerReady) {
    return (
      <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-beige to-cream-dark border border-nude/30">
        <p className="px-6 text-center text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
          Loading 3D view...
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-square bg-gradient-to-br from-beige to-cream-dark overflow-hidden">
      <model-viewer
        src={modelUrl}
        poster={posterUrl || undefined}
        camera-controls
        auto-rotate
        interaction-prompt="auto"
        ar
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 text-xs text-brown-muted font-inter tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        Drag to rotate · Pinch to zoom
      </div>
    </div>
  );
}
