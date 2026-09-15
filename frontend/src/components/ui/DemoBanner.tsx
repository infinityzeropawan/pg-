'use client';
/**
 * RESPONSIBILITY: Sticky top banner shown when the logged-in user is a demo account.
 * Rendered by every portal Layout. Hidden for real users (isDemo falsy).
 */
import { useState } from 'react';
import { Eye, X, ExternalLink } from 'lucide-react';

interface DemoBannerProps {
  /** Pass true or pass user object containing isDemo */
  isDemo?: boolean;
  user?: { isDemo?: boolean } | null;
}

export function DemoBanner({ isDemo, user }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const active = isDemo ?? user?.isDemo;
  if (!active || dismissed) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <Eye size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>👀 Demo Mode</strong> — You are viewing a read-only demo. All dashboards and
          features are live, but changes are not saved.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <a
          href="/#contact"
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '6px',
            padding: '4px 12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <ExternalLink size={13} />
          Get Real Access
        </a>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss demo banner"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
