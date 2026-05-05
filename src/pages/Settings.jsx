import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

export default function Settings() {
  const { userName, setUserName, resetAllData } = useFinance()
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setUserName(name || 'there')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleReset() {
    if (window.confirm('This will clear all your data and reload with sample data. Continue?')) {
      await resetAllData()
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid var(--cream-dark)',
    borderRadius: 'var(--radius-md)',
    fontSize: 15,
    background: '#fff',
    color: 'var(--ink)',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    marginBottom: 8,
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="fade-up">
        <h1 style={{ fontSize: 38 }}>
          <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Settings</span>
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: 4, marginBottom: 32 }}>
          Personalise your dashboard.
        </p>
      </div>

      <form onSubmit={handleSave} className="fade-up fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <label style={labelStyle} htmlFor="username">Your name</label>
          <input
            id="username"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="What should we call you?"
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6 }}>
            Shown in the sidebar greeting.
          </p>
        </div>

        <button type="submit" style={{
          padding: '13px 24px',
          background: 'var(--accent)', color: '#fff',
          borderRadius: 'var(--radius-md)',
          fontSize: 15, fontWeight: 500,
          alignSelf: 'flex-start',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          Save changes
        </button>

        {saved && (
          <div style={{
            padding: '12px 18px',
            background: 'var(--green-light)',
            color: 'var(--green)',
            borderRadius: 'var(--radius-md)',
            fontSize: 14, fontWeight: 500,
          }}>
            ✓ Settings saved!
          </div>
        )}
      </form>

      <hr style={{ border: 'none', borderTop: '1.5px solid var(--cream-dark)', margin: '36px 0' }} />

      {/* About */}
      <div className="fade-up fade-up-2" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>About</h2>
        <div style={{
          background: '#fff',
          border: '1.5px solid var(--cream-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          fontSize: 14,
          color: 'var(--ink-light)',
          lineHeight: 1.8,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <p><strong>Flo</strong> — Personal Finance Dashboard</p>
          <p>Built with React + Recharts. Data is stored in MongoDB Atlas via an Express API.</p>
          <p style={{ marginTop: 8 }}>
            Stack: React 18, Recharts, Vite, Express, Mongoose, MongoDB Atlas.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="fade-up fade-up-3">
        <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--red)' }}>Danger zone</h2>
        <div style={{
          border: '1.5px solid var(--red)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Reset all data</div>
            <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>
              Clears all transactions in MongoDB and restores sample data.
            </div>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 18px',
              background: 'var(--red-light)',
              color: 'var(--red)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13, fontWeight: 500,
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
          >
            Reset data
          </button>
        </div>
      </div>
    </div>
  )
}
