import React from 'react'
import { useFinance } from '../context/FinanceContext'

const NAV = [
  { id: 'dashboard',      label: 'Overview',        icon: '◈' },
  { id: 'add',            label: 'Add Entry',        icon: '+' },
  { id: 'history',        label: 'History',          icon: '≡' },
  { id: 'goals',          label: 'Goals',            icon: '◎' },
  { id: 'visualisations', label: 'Visualisations',   icon: '◑' },
  { id: 'settings',       label: 'Settings',         icon: '⊙' },
]

export default function Sidebar({ page, setPage }) {
  const { userName } = useFinance()

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 0',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 28px 36px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          color: 'var(--cream)',
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}>
          flo<span style={{ color: 'var(--accent)', fontSize: 32 }}>.</span>
        </div>
        <div style={{ color: 'var(--ink-muted)', fontSize: 12, marginTop: 6 }}>
          Hey, {userName}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 14px' }}>
        {NAV.map(item => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--ink-muted)',
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                transition: 'all 0.15s ease',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--cream)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--ink-muted)' }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 28px', color: 'var(--ink-muted)', fontSize: 11 }}>
        Personal Finance Dashboard
      </div>
    </aside>
  )
}
