'use client';

import dynamic from 'next/dynamic';

const SiteIQMainApp = dynamic(() => import('@/components/site-iq/App'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f7',
      color: '#1d1d1f',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Loading VOC Site IQ...</h2>
        <p style={{ color: '#8e8e93', fontSize: '14px' }}>Starting Geotag Control Center & DPR Dashboard</p>
      </div>
    </div>
  )
});

export default function SiteIQPage() {
  return (
    <div className="site-iq-root">
      <SiteIQMainApp />
    </div>
  );
}
