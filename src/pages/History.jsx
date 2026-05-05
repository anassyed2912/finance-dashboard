import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

export default function History() {
  const { transactions, deleteTransaction, CATEGORIES } = useFinance()
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')

  const filtered = transactions.filter(tx => {
    if (filter === 'income' && tx.type !== 'income') return false
    if (filter === 'expense' && tx.type !== 'expense') return false
    if (catFilter !== 'all' && tx.category !== catFilter) return false
    return true
  })

  const pillStyle = (active) => ({
    padding: '6px 14px',
    borderRadius: 99,
    border: '1.5px solid ' + (active ? 'var(--accent)' : 'var(--cream-dark)'),
    background: active ? 'var(--accent)' : '#fff',
    color: active ? '#fff' : 'var(--ink-muted)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'var(--font-body)',
  })

  return (
    <div>
      <div className="fade-up">
        <h1 style={{ fontSize: 38 }}>
          Transaction <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>history</span>
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: 4, marginBottom: 24 }}>
          {transactions.length} entries recorded
        </p>
      </div>

      {/* Filters */}
      <div className="fade-up fade-up-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button style={pillStyle(filter === 'all')}   onClick={() => setFilter('all')}>All</button>
        <button style={pillStyle(filter === 'income')}  onClick={() => setFilter('income')}>Income</button>
        <button style={pillStyle(filter === 'expense')} onClick={() => setFilter('expense')}>Expenses</button>
        <div style={{ width: 1, background: 'var(--cream-dark)', margin: '0 4px' }} />
        <button style={pillStyle(catFilter === 'all')} onClick={() => setCatFilter('all')}>All categories</button>
        {CATEGORIES.map(c => (
          <button key={c.id} style={pillStyle(catFilter === c.id)} onClick={() => setCatFilter(c.id)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="fade-up fade-up-2" style={{
        background: '#fff',
        border: '1.5px solid var(--cream-dark)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--ink-muted)' }}>
            No entries match your filters.
          </div>
        ) : (
          filtered.map((tx, i) => {
            const cat = CATEGORIES.find(c => c.id === tx.category)
            return (
              <div
                key={tx._id || tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--cream-dark)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: tx.type === 'income' ? 'var(--green-light)' : (cat ? cat.color + '22' : 'var(--cream-dark)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {tx.type === 'income' ? '↑' : (cat?.icon ?? '📦')}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{tx.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                    {cat?.label ?? (tx.type === 'income' ? 'Income' : '—')} · {tx.date}
                  </div>
                </div>

                {/* Amount */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  color: tx.type === 'income' ? 'var(--green)' : 'var(--ink)',
                  flexShrink: 0,
                }}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteTransaction(tx._id || tx.id)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'transparent',
                    color: 'var(--ink-muted)',
                    fontSize: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                  title="Delete"
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-muted)' }}
                >
                  ×
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
