import React, { useState } from 'react'
import { FinanceProvider } from './context/FinanceContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AddEntry from './pages/AddEntry'
import History from './pages/History'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import Visualisations from './pages/Visualisations'

function AppShell() {
  const [page, setPage] = useState('dashboard')

  const pages = {
    dashboard:      <Dashboard />,
    add:            <AddEntry />,
    history:        <History />,
    goals:          <Goals />,
    visualisations: <Visualisations />,
    settings:       <Settings />,
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Sidebar page={page} setPage={setPage} />

      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '48px 52px',
        background: 'var(--cream)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {pages[page]}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  )
}
