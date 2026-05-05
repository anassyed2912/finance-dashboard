import React from 'react'

export default function StatCard({ label, value, sub, accent, delay = 0 }) {
  return (
    <div
      className={`fade-up fade-up-${delay}`}
      style={{
        background: accent ? 'var(--accent)' : '#fff',
        border: accent ? 'none' : '1.5px solid var(--cream-dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: accent ? 'rgba(255,255,255,0.7)' : 'var(--ink-muted)',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 34,
        color: accent ? '#fff' : 'var(--ink)',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: 12,
          color: accent ? 'rgba(255,255,255,0.65)' : 'var(--ink-muted)',
        }}>
          {sub}
        </div>
      )}
    </div>
  )
}
