import React, { useState } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'
import { useFinance } from '../context/FinanceContext'

export default function Goals() {
  const {
    savingsGoal, setSavingsGoal,
    savingsSaved, setSavingsSaved,
    monthlyBudget, setMonthlyBudget,
    savingsPct, budgetUsedPct,
    thisMonthExpenses,
  } = useFinance()

  const [deposit, setDeposit] = useState('')
  const [depositSuccess, setDepositSuccess] = useState(false)

  function handleDeposit(e) {
    e.preventDefault()
    if (!deposit) return
    setSavingsSaved(Math.min(savingsSaved + parseFloat(deposit), savingsGoal))
    setDeposit('')
    setDepositSuccess(true)
    setTimeout(() => setDepositSuccess(false), 2000)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="fade-up">
        <h1 style={{ fontSize: 38 }}>
          Goals &amp; <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>budgets</span>
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: 4 }}>
          Set targets and track your progress.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Savings Goal Card */}
        <div className="fade-up fade-up-1" style={{
          background: '#fff',
          border: '1.5px solid var(--cream-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>Savings goal</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>
            ${savingsSaved.toLocaleString()} saved of ${savingsGoal.toLocaleString()}
          </p>

          {/* Radial */}
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="65%" outerRadius="100%"
                startAngle={90} endAngle={-270}
                data={[{ value: savingsPct, fill: 'var(--accent)' }]}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: 'var(--cream-dark)' }}
                  dataKey="value"
                  cornerRadius={8}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 28, fill: 'var(--ink)' }}>
                  {Math.round(savingsPct)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
            <div>
              <label style={labelStyle}>Savings goal ($)</label>
              <input type="number" style={inputStyle} value={savingsGoal}
                onChange={e => setSavingsGoal(e.target.value)} min={1} />
            </div>

            <form onSubmit={handleDeposit} style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }}>$</span>
                <input
                  type="number" min="0.01" step="0.01"
                  placeholder="Add to savings"
                  value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 26 }}
                />
              </div>
              <button type="submit" style={{
                padding: '12px 18px',
                background: 'var(--accent)', color: '#fff',
                borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                + Deposit
              </button>
            </form>
            {depositSuccess && (
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
                ✓ Savings updated!
              </div>
            )}
          </div>
        </div>

        {/* Monthly Budget Card */}
        <div className="fade-up fade-up-2" style={{
          background: '#fff',
          border: '1.5px solid var(--cream-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>Monthly budget</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>
            ${thisMonthExpenses.toLocaleString()} spent of ${monthlyBudget.toLocaleString()}
          </p>

          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="65%" outerRadius="100%"
                startAngle={90} endAngle={-270}
                data={[{
                  value: budgetUsedPct,
                  fill: budgetUsedPct > 90 ? 'var(--red)' : budgetUsedPct > 70 ? 'var(--amber)' : 'var(--green)',
                }]}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: 'var(--cream-dark)' }}
                  dataKey="value"
                  cornerRadius={8}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 28, fill: 'var(--ink)' }}>
                  {Math.round(budgetUsedPct)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>Monthly budget ($)</label>
            <input
              type="number" min={1}
              value={monthlyBudget}
              onChange={e => setMonthlyBudget(e.target.value)}
              style={inputStyle}
            />
            <div style={{
              marginTop: 16, padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: budgetUsedPct > 90 ? 'var(--red-light)' : budgetUsedPct > 70 ? 'var(--amber-light)' : 'var(--green-light)',
              color: budgetUsedPct > 90 ? 'var(--red)' : budgetUsedPct > 70 ? 'var(--amber)' : 'var(--green)',
              fontSize: 13, fontWeight: 500,
            }}>
              {budgetUsedPct > 90
                ? '⚠️ You\'re nearly at your budget limit!'
                : budgetUsedPct > 70
                ? '📊 Over 70% of budget used — watch your spending.'
                : '✓ You\'re tracking well within budget.'}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="fade-up fade-up-3" style={{
        background: 'var(--ink)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        color: 'var(--cream)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}>
        {[
          { icon: '◈', tip: '50/30/20 rule', desc: 'Allocate 50% needs, 30% wants, 20% savings.' },
          { icon: '◎', tip: 'Pay yourself first', desc: 'Move money to savings before spending anything.' },
          { icon: '⊙', tip: 'Review monthly', desc: 'Adjust your budget each month based on actuals.' },
        ].map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: 24, marginBottom: 8, color: 'var(--accent)' }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 6 }}>{item.tip}</div>
            <div style={{ fontSize: 13, color: 'rgba(250,248,243,0.6)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
