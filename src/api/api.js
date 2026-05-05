const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

// Transactions
export const fetchTransactions = ()     => request('/api/transactions')
export const createTransaction = (tx)   => request('/api/transactions', { method: 'POST', body: JSON.stringify(tx) })
export const removeTransaction = (id)   => request(`/api/transactions/${id}`, { method: 'DELETE' })
export const clearTransactions = ()     => request('/api/transactions', { method: 'DELETE' })
export const seedTransactions  = (samples) =>
  request('/api/transactions/seed', { method: 'POST', body: JSON.stringify({ samples }) })

// Settings
export const fetchSettings = ()       => request('/api/settings')
export const updateSettings = (data)  => request('/api/settings', { method: 'PUT', body: JSON.stringify(data) })
