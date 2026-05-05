import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import {
  fetchTransactions,
  createTransaction,
  removeTransaction,
  clearTransactions,
  seedTransactions,
  fetchSettings,
  updateSettings,
} from '../api/api.js'

const FinanceContext = createContext(null)

export const CATEGORIES = [
  { id: 'housing',       label: 'Housing',       color: '#c8622a', icon: '🏠' },
  { id: 'food',          label: 'Food & Dining',  color: '#3a7d5e', icon: '🍜' },
  { id: 'transport',     label: 'Transport',      color: '#2a5a8a', icon: '🚗' },
  { id: 'health',        label: 'Health',         color: '#c83a3a', icon: '💊' },
  { id: 'entertainment', label: 'Entertainment',  color: '#7a4a9a', icon: '🎬' },
  { id: 'shopping',      label: 'Shopping',       color: '#c89a2a', icon: '🛍️' },
  { id: 'education',     label: 'Education',      color: '#2a8a8a', icon: '📚' },
  { id: 'other',         label: 'Other',          color: '#8a8480', icon: '📦' },
]

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const SAMPLE_TRANSACTIONS = [
  { type: 'expense', amount: 1200, category: 'housing',       description: 'Monthly rent',            date: '2025-04-01', month: 'Apr' },
  { type: 'expense', amount: 320,  category: 'food',          description: 'Groceries & dining',      date: '2025-04-03', month: 'Apr' },
  { type: 'expense', amount: 85,   category: 'transport',     description: 'Monthly transit pass',    date: '2025-04-05', month: 'Apr' },
  { type: 'expense', amount: 60,   category: 'entertainment', description: 'Streaming subscriptions', date: '2025-04-07', month: 'Apr' },
  { type: 'expense', amount: 200,  category: 'shopping',      description: 'Clothes',                 date: '2025-04-10', month: 'Apr' },
  { type: 'income',  amount: 3200, category: null,            description: 'Monthly salary',          date: '2025-04-01', month: 'Apr' },
  { type: 'expense', amount: 1200, category: 'housing',       description: 'Monthly rent',            date: '2025-03-01', month: 'Mar' },
  { type: 'expense', amount: 290,  category: 'food',          description: 'Groceries',               date: '2025-03-05', month: 'Mar' },
  { type: 'expense', amount: 85,   category: 'transport',     description: 'Transit pass',            date: '2025-03-05', month: 'Mar' },
  { type: 'expense', amount: 150,  category: 'health',        description: 'Pharmacy',                date: '2025-03-12', month: 'Mar' },
  { type: 'income',  amount: 3200, category: null,            description: 'Monthly salary',          date: '2025-03-01', month: 'Mar' },
  { type: 'expense', amount: 1200, category: 'housing',       description: 'Monthly rent',            date: '2025-02-01', month: 'Feb' },
  { type: 'expense', amount: 410,  category: 'food',          description: 'Groceries & restaurants', date: '2025-02-05', month: 'Feb' },
  { type: 'expense', amount: 85,   category: 'transport',     description: 'Transit pass',            date: '2025-02-05', month: 'Feb' },
  { type: 'expense', amount: 300,  category: 'shopping',      description: 'Valentine gifts',         date: '2025-02-13', month: 'Feb' },
  { type: 'income',  amount: 3200, category: null,            description: 'Monthly salary',          date: '2025-02-01', month: 'Feb' },
  { type: 'income',  amount: 3200, category: null,            description: 'Monthly salary',          date: '2026-05-01', month: 'May' },
  { type: 'expense', amount: 1200, category: 'housing',       description: 'Monthly rent',            date: '2026-05-01', month: 'May' },
  { type: 'expense', amount: 340,  category: 'food',          description: 'Groceries & dining',      date: '2026-05-03', month: 'May' },
]

export function FinanceProvider({ children }) {
  const [transactions,  setTransactions]      = useState([])
  const [savingsGoal,   setSavingsGoalState]   = useState(5000)
  const [savingsSaved,  setSavingsSavedState]  = useState(1200)
  const [monthlyBudget, setMonthlyBudgetState] = useState(2500)
  const [userName,      setUserNameState]      = useState('there')
  const [loading,       setLoading]            = useState(true)

  const settingsTimer = useRef(null)

  useEffect(() => {
    async function init() {
      try {
        await seedTransactions(SAMPLE_TRANSACTIONS)
        const [txs, settings] = await Promise.all([fetchTransactions(), fetchSettings()])
        setTransactions(txs)
        setSavingsGoalState(settings.savingsGoal)
        setSavingsSavedState(settings.savingsSaved)
        setMonthlyBudgetState(settings.monthlyBudget)
        setUserNameState(settings.userName)
      } catch (err) {
        console.error('Failed to load data from API:', err.message)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  function syncSettings(patch) {
    clearTimeout(settingsTimer.current)
    settingsTimer.current = setTimeout(() => {
      updateSettings(patch).catch(err =>
        console.error('Failed to save settings:', err.message)
      )
    }, 600)
  }

  async function addTransaction(tx) {
    try {
      const saved = await createTransaction(tx)
      setTransactions(prev => [saved, ...prev])
    } catch (err) {
      console.error('Failed to add transaction:', err.message)
    }
  }

  async function deleteTransaction(id) {
    try {
      await removeTransaction(id)
      setTransactions(prev => prev.filter(t => (t._id || t.id) !== id))
    } catch (err) {
      console.error('Failed to delete transaction:', err.message)
    }
  }

  function setSavingsGoal(val)   { const n = Number(val); setSavingsGoalState(n);   syncSettings({ savingsGoal: n }) }
  function setSavingsSaved(val)  { const n = Number(val); setSavingsSavedState(n);  syncSettings({ savingsSaved: n }) }
  function setMonthlyBudget(val) { const n = Number(val); setMonthlyBudgetState(n); syncSettings({ monthlyBudget: n }) }
  function setUserName(val)      { setUserNameState(val); syncSettings({ userName: val }) }

  async function resetAllData() {
    try {
      await clearTransactions()
      await seedTransactions(SAMPLE_TRANSACTIONS)
      const [txs, settings] = await Promise.all([fetchTransactions(), fetchSettings()])
      setTransactions(txs)
      setSavingsGoalState(settings.savingsGoal)
      setSavingsSavedState(settings.savingsSaved)
      setMonthlyBudgetState(settings.monthlyBudget)
      setUserNameState(settings.userName)
    } catch (err) {
      console.error('Reset failed:', err.message)
    }
  }

  // --- Derived data: fully dynamic based on today's date ---
  const now          = new Date()
  const currentMonth = MONTH_LABELS[now.getMonth()]

  // Last 3 months including current, going backwards
  const last3Months = [2, 1, 0].map(offset => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    return MONTH_LABELS[d.getMonth()]
  })

  const thisMonthTx       = transactions.filter(t => t.month === currentMonth)
  const thisMonthIncome   = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const thisMonthExpenses = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const thisMonthNet      = thisMonthIncome - thisMonthExpenses

  const spendingByCategory = CATEGORIES.map(cat => {
    const total = thisMonthTx
      .filter(t => t.type === 'expense' && t.category === cat.id)
      .reduce((s, t) => s + t.amount, 0)
    return { ...cat, value: total }
  }).filter(c => c.value > 0)

  const monthlyTrend = last3Months.map(m => {
    const mTx = transactions.filter(t => t.month === m)
    return {
      month:    m,
      income:   mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expenses: mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    }
  })

  const budgetUsedPct = monthlyBudget > 0 ? Math.min((thisMonthExpenses / monthlyBudget) * 100, 100) : 0
  const savingsPct    = savingsGoal > 0   ? Math.min((savingsSaved / savingsGoal) * 100, 100) : 0

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--cream)',
        fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-muted)',
      }}>
        Loading flo<span style={{ color: 'var(--accent)' }}>.</span>
      </div>
    )
  }

  return (
    <FinanceContext.Provider value={{
      transactions, addTransaction, deleteTransaction, resetAllData,
      savingsGoal,   setSavingsGoal,
      savingsSaved,  setSavingsSaved,
      monthlyBudget, setMonthlyBudget,
      userName,      setUserName,
      thisMonthIncome, thisMonthExpenses, thisMonthNet,
      spendingByCategory, monthlyTrend,
      budgetUsedPct, savingsPct,
      currentMonth, CATEGORIES,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  return useContext(FinanceContext)
}
