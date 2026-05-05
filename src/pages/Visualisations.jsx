import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'
import { useFinance } from '../context/FinanceContext'

function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}


const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--cream)',
      padding: '10px 16px', borderRadius: 8, fontSize: 13,
    }}>
      {label && <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--cream)' }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  )
}

const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--cream)',
      padding: '10px 16px', borderRadius: 8, fontSize: 13, maxWidth: 200,
    }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{d.description}</div>
      <div>{d.category} · {d.date}</div>
      <div style={{ marginTop: 4, fontFamily: 'var(--font-display)', fontSize: 18 }}>{fmt(d.amount)}</div>
    </div>
  )
}

//  Heatmap 

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const HEAT_MONTHS = ['Feb','Mar','Apr']

function buildHeatmapData(transactions) {
  // Map date string -> total expenses
  const byDate = {}
  transactions.forEach(tx => {
    if (tx.type !== 'expense') return
    if (!byDate[tx.date]) byDate[tx.date] = 0
    byDate[tx.date] += tx.amount
  })

  // Build weeks for Feb, Mar, Apr 2025
  const start = new Date('2025-02-01')
  const end   = new Date('2025-04-30')

  // Align to Sunday
  const cur = new Date(start)
  cur.setDate(cur.getDate() - cur.getDay())

  const weeks = []
  let week = []

  while (cur <= end || week.length > 0) {
    const dateStr = cur.toISOString().split('T')[0]
    const inRange = cur >= start && cur <= end
    week.push({
      date: dateStr,
      amount: inRange ? (byDate[dateStr] || 0) : null,
      day: cur.getDay(),
      label: cur.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
    cur.setDate(cur.getDate() + 1)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
    if (cur > end && week.length === 0) break
    if (cur > new Date('2025-05-10')) break
  }
  if (week.length > 0) weeks.push(week)

  const maxAmount = Math.max(...Object.values(byDate), 1)
  return { weeks, maxAmount }
}

function heatColor(amount, max) {
  if (amount === null) return 'transparent'
  if (amount === 0) return 'var(--cream-dark)'
  const intensity = amount / max
  if (intensity < 0.25) return '#fde8d8'
  if (intensity < 0.5)  return '#f0b896'
  if (intensity < 0.75) return '#d97a3a'
  return 'var(--accent)'
}

function Heatmap({ transactions }) {
  const { weeks, maxAmount } = buildHeatmapData(transactions)
  const [hovered, setHovered] = useState(null)

  const CELL = 18
  const GAP  = 3

  return (
    <div>
      {/* Day labels */}
      <div style={{ display: 'flex', gap: GAP, marginBottom: GAP, paddingLeft: 32 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            width: CELL, fontSize: 10, color: 'var(--ink-muted)',
            textAlign: 'center', flexShrink: 0,
          }}>{d[0]}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: GAP, overflowX: 'auto', paddingBottom: 8 }}>
        {weeks.map((week, wi) => {
          // Month label: show when first day of month appears
          const firstReal = week.find(d => d.amount !== null)
          const showMonth = firstReal && firstReal.label.endsWith(' 1')
            ? firstReal.label.split(' ')[0] : null

          return (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP, flexShrink: 0 }}>
              <div style={{
                fontSize: 10, color: showMonth ? 'var(--ink-muted)' : 'transparent',
                height: 14, textAlign: 'center',
              }}>
                {showMonth || '·'}
              </div>
              {week.map((cell, di) => (
                <div
                  key={di}
                  style={{
                    width: CELL, height: CELL,
                    borderRadius: 3,
                    background: heatColor(cell.amount, maxAmount),
                    border: cell.amount !== null ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    cursor: cell.amount !== null ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'transform 0.1s',
                    transform: hovered?.date === cell.date ? 'scale(1.3)' : 'scale(1)',
                  }}
                  onMouseEnter={() => cell.amount !== null && setHovered(cell)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </div>
          )
        })}
      </div>

      {/* Tooltip */}
      <div style={{ minHeight: 28, marginTop: 10 }}>
        {hovered && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            background: 'var(--ink)', color: 'var(--cream)',
            borderRadius: 8, fontSize: 13,
            animation: 'fadeIn 0.15s ease',
          }}>
            <span>{hovered.label}</span>
            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 16 }}>
              {hovered.amount > 0 ? fmt(hovered.amount) : 'No spending'}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Less</span>
        {['var(--cream-dark)', '#fde8d8', '#f0b896', '#d97a3a', 'var(--accent)'].map((c, i) => (
          <div key={i} style={{
            width: CELL, height: CELL, borderRadius: 3,
            background: c, border: '1px solid rgba(0,0,0,0.06)',
          }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>More</span>
      </div>
    </div>
  )
}

//  Stacked Area 

function buildAreaData(transactions, CATEGORIES) {
  const months = ['Feb', 'Mar', 'Apr']
  return months.map(m => {
    const row = { month: m }
    CATEGORIES.forEach(cat => {
      row[cat.id] = transactions
        .filter(t => t.month === m && t.type === 'expense' && t.category === cat.id)
        .reduce((s, t) => s + t.amount, 0)
    })
    return row
  })
}

//  Scatter 

function buildScatterData(transactions, CATEGORIES) {
  return transactions
    .filter(t => t.type === 'expense')
    .map(t => {
      const d = new Date(t.date)
      const cat = CATEGORIES.find(c => c.id === t.category)
      return {
        x: d.getTime(),
        y: t.amount,
        amount: t.amount,
        date: t.date,
        description: t.description,
        category: cat?.label ?? 'Other',
        color: cat?.color ?? '#8a8480',
        categoryId: t.category,
      }
    })
}

//  Main Page 

export default function Visualisations() {
  const { transactions, CATEGORIES } = useFinance()

  const areaData    = buildAreaData(transactions, CATEGORIES)
  const scatterData = buildScatterData(transactions, CATEGORIES)

  // Group scatter by category for multiple <Scatter> series
  const scatterByCat = CATEGORIES.map(cat => ({
    ...cat,
    data: scatterData.filter(d => d.categoryId === cat.id),
  })).filter(c => c.data.length > 0)

  // X-axis ticks for scatter
  const xTicks = [
    new Date('2025-02-01').getTime(),
    new Date('2025-03-01').getTime(),
    new Date('2025-04-01').getTime(),
    new Date('2025-05-01').getTime(),
  ]

  const cardStyle = {
    background: '#fff',
    border: '1.5px solid var(--cream-dark)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    boxShadow: 'var(--shadow-sm)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="fade-up">
        <h1 style={{ fontSize: 38 }}>
          Data <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>visualisations</span>
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: 4 }}>
          Three views into your spending patterns — Feb through Apr 2025.
        </p>
      </div>

      {/* ── Heatmap ── */}
      <div className="fade-up fade-up-1" style={cardStyle}>
        <h3 style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 4 }}>
          Spending heatmap
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>
          Each cell is one day. Darker = more spent. Hover to inspect.
        </p>
        <Heatmap transactions={transactions} />
      </div>

      {/* ── Stacked Area ── */}
      <div className="fade-up fade-up-2" style={cardStyle}>
        <h3 style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 4 }}>
          Spending composition over time
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>
          How each spending category contributes to your total across months.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={areaData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-dark)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            {CATEGORIES.map(cat => (
              <Area
                key={cat.id}
                type="monotone"
                dataKey={cat.id}
                name={cat.label}
                stackId="1"
                stroke={cat.color}
                fill={cat.color}
                fillOpacity={0.75}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Scatter ── */}
      <div className="fade-up fade-up-3" style={cardStyle}>
        <h3 style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 4 }}>
          Transaction scatter plot
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>
          Every expense as a dot — date on x-axis, amount on y-axis, coloured by category. Hover to inspect.
        </p>
        {scatterData.length === 0 ? (
          <div style={{ color: 'var(--ink-muted)', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>
            No expenses to display yet. Add some entries first.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-dark)" />
              <XAxis
                type="number"
                dataKey="x"
                domain={['dataMin - 86400000', 'dataMax + 86400000']}
                ticks={xTicks}
                tickFormatter={v => new Date(v).toLocaleDateString('en-US', { month: 'short' })}
                tick={{ fontSize: 12, fill: 'var(--ink-muted)' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                tick={{ fontSize: 12, fill: 'var(--ink-muted)' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => '$' + v}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              {scatterByCat.map(cat => (
                <Scatter
                  key={cat.id}
                  name={cat.label}
                  data={cat.data}
                  fill={cat.color}
                  fillOpacity={0.8}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
