'use client';

import { useEffect, useRef } from 'react';

export default function GhiVetLuotXem({ trang }: { trang: string }) {
  const batDau = useRef(Date.now());
  const daGuiDwell = useRef(false);

  useEffect(() => {
    batDau.current = Date.now();
    daGuiDwell.current = false;

    fetch('/api/khachhang/ghi-vet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trang, loai: 'pageview' }),
      keepalive: true,
    }).catch(() => null);

    function guiDwell() {
      if (daGuiDwell.current) return;
      const giay = Math.round((Date.now() - batDau.current) / 1000);
      if (giay < 1) return;
      daGuiDwell.current = true;
      const du = JSON.stringify({ trang, loai: 'dwell', giay });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/khachhang/ghi-vet', new Blob([du], { type: 'application/json' }));
      } else {
        fetch('/api/khachhang/ghi-vet', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: du, keepalive: true,
        }).catch(() => null);
      }
    }

    function khiAn() {
      if (document.visibilityState === 'hidden') guiDwell();
    }
    document.addEventListener('visibilitychange', khiAn);
    window.addEventListener('pagehide', guiDwell);
    return () => {
      document.removeEventListener('visibilitychange', khiAn);
      window.removeEventListener('pagehide', guiDwell);
      guiDwell();
    };
  }, [trang]);

  return null;
}
