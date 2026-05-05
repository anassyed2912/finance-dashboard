import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AddEntry() {
  const { addTransaction, CATEGORIES } = useFinance()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [success, setSuccess] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount || !description) return
    const d = new Date(date)
    const month = MONTHS[d.getMonth()]
    addTransaction({
      type,
      amount: parseFloat(amount),
      description,
      category: type === 'expense' ? category : null,
      date,
      month,
    })
    setAmount('')
    setDescription('')
    setCategory('food')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid var(--cream-dark)',
    borderRadius: 'var(--radius-md)',
    fontSize: 15,
    background: '#fff',
    color: 'var(--ink)',
    transition: 'border-color 0.15s',
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
    <div style={{ maxWidth: 560 }}>
      <div className="fade-up">
        <h1 style={{ fontSize: 38 }}>Add <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>entry</span></h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: 4, marginBottom: 32 }}>
          Log income or an expense to track your flow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="fade-up fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Type toggle */}
        <div>
          <span style={labelStyle}>Type</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {['expense', 'income'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid ' + (type === t ? (t === 'income' ? 'var(--green)' : 'var(--accent)') : 'var(--cream-dark)'),
                  background: type === t ? (t === 'income' ? 'var(--green-light)' : 'var(--accent-light)') : '#fff',
                  color: type === t ? (t === 'income' ? 'var(--green)' : 'var(--accent)') : 'var(--ink-muted)',
                  fontWeight: type === t ? 500 : 400,
                  fontSize: 14,
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label style={labelStyle} htmlFor="amount">Amount</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--ink-muted)', fontSize: 16, pointerEvents: 'none',
            }}>$</span>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle} htmlFor="desc">Description</label>
          <input
            id="desc"
            type="text"
            placeholder="e.g. Monthly rent, Coffee, Paycheck..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Category — only for expenses */}
        {type === 'expense' && (
          <div>
            <span style={labelStyle}>Category</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid ' + (category === cat.id ? cat.color : 'var(--cream-dark)'),
                    background: category === cat.id ? cat.color + '18' : '#fff',
                    color: category === cat.id ? cat.color : 'var(--ink-muted)',
                    fontSize: 12,
                    fontWeight: category === cat.id ? 500 : 400,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ lineHeight: 1.2, textAlign: 'center' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date */}
        <div>
          <label style={labelStyle} htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            padding: '14px 28px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontSize: 15,
            fontWeight: 500,
            transition: 'background 0.15s',
            marginTop: 4,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          Add {type === 'income' ? 'income' : 'expense'}
        </button>

        {success && (
          <div style={{
            padding: '14px 20px',
            background: 'var(--green-light)',
            color: 'var(--green)',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            fontWeight: 500,
            animation: 'fadeIn 0.25s ease',
          }}>
            ✓ Entry added successfully!
          </div>
        )}
      </form>
    </div>
  )
}
