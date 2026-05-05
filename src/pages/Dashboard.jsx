import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { useFinance } from '../context/FinanceContext'
import StatCard from '../components/StatCard'

function fmt(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--ink)',
      color: 'var(--cream)',
      padding: '8px 14px',
      borderRadius: 8,
      fontSize: 13,
    }}>
      {payload.map((p, i) => (
        <div key={i}>{p.name}: {fmt(p.value)}</div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const {
    thisMonthIncome, thisMonthExpenses, thisMonthNet,
    spendingByCategory, monthlyTrend,
    budgetUsedPct, savingsPct, savingsGoal, savingsSaved,
    monthlyBudget, transactions, currentMonth,
  } = useFinance()

  const recentTx = transactions.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div className="fade-up">
        <h1 style={{ fontSize: 38, color: 'var(--ink)' }}>
          April <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Overview</span>
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: 4 }}>
          Your financial snapshot for this month.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Monthly Income" value={fmt(thisMonthIncome)} sub="this month" delay={1} />
        <StatCard label="Total Spent" value={fmt(thisMonthExpenses)} sub={`of ${fmt(monthlyBudget)} budget`} delay={2} />
        <StatCard
          label="Net Savings"
          value={fmt(thisMonthNet)}
          sub={thisMonthNet >= 0 ? 'ahead this month 🎉' : 'over budget this month'}
          accent
          delay={3}
        />
      </div>

      {/* Budget & Savings Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ProgressCard
          label="Monthly Budget"
          current={thisMonthExpenses}
          total={monthlyBudget}
          pct={budgetUsedPct}
          color={budgetUsedPct > 90 ? 'var(--red)' : budgetUsedPct > 70 ? 'var(--amber)' : 'var(--green)'}
          delay={4}
        />
        <ProgressCard
          label="Savings Goal"
          current={savingsSaved}
          total={savingsGoal}
          pct={savingsPct}
          color="var(--accent)"
          delay={5}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        {/* Donut chart */}
        <div className="fade-up fade-up-3" style={{
          background: '#fff',
          border: '1.5px solid var(--cream-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 16 }}>
            Spending breakdown
          </h3>
          {spendingByCategory.length === 0 ? (
            <div style={{ color: 'var(--ink-muted)', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>
              No expenses logged yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {spendingByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 12 }}>
                {spendingByCategory.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                    <span style={{ color: 'var(--ink-muted)' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar chart */}
        <div className="fade-up fade-up-4" style={{
          background: '#fff',
          border: '1.5px solid var(--cream-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 16 }}>
            Income vs expenses — last 3 months
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrend} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-dark)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="var(--green)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="fade-up fade-up-5" style={{
        background: '#fff',
        border: '1.5px solid var(--cream-dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 16 }}>
          Recent transactions
        </h3>
        {recentTx.length === 0 ? (
          <div style={{ color: 'var(--ink-muted)', fontSize: 13 }}>No transactions yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentTx.map(tx => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressCard({ label, current, total, pct, color, delay }) {
  return (
    <div className={`fade-up fade-up-${delay}`} style={{
      background: '#fff',
      border: '1.5px solid var(--cream-dark)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)' }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div style={{ background: 'var(--cream-dark)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
        <div style={{
          width: pct + '%',
          height: '100%',
          background: color,
          borderRadius: 99,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'var(--ink-muted)' }}>
        <span>${current.toLocaleString()} used</span>
        <span>of ${total.toLocaleString()}</span>
      </div>
    </div>
  )
}

function TxRow({ tx }) {
  const { CATEGORIES } = useFinance()
  const cat = CATEGORIES.find(c => c.id === tx.category)
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 0',
      borderBottom: '1px solid var(--cream-dark)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: tx.type === 'income' ? 'var(--green-light)' : (cat ? cat.color + '22' : 'var(--cream-dark)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
      }}>
        {tx.type === 'income' ? '↑' : (cat?.icon ?? '📦')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tx.description}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
          {cat?.label ?? (tx.type === 'income' ? 'Income' : '—')} · {tx.date}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        color: tx.type === 'income' ? 'var(--green)' : 'var(--ink)',
      }}>
        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
      </div>
    </div>
  )
}
