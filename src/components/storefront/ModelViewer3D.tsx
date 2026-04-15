'use client';

import { useEffect } from 'react';

type ModelViewer3DProps = {
  modelUrl: string;
  posterUrl?: string;
};

export default function ModelViewer3D({ modelUrl, posterUrl }: ModelViewer3DProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.customElements?.get('model-viewer')) return;

    const existing = document.querySelector('script[data-model-viewer="true"]');
    if (existing) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.setAttribute('data-model-viewer', 'true');
    document.head.appendChild(script);
  }, []);

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
