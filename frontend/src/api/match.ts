const API_BASE = '/api'

export interface Match {
  id: string
  userAId: string
  userBId: string
  status: string
  matchedAt: string
}

export const matchApi = {
  getMyMatch: async (userId: string): Promise<Match | null> => {
    const response = await fetch(`${API_BASE}/match/me?userId=${userId}`)
    if (!response.ok) return null
    return response.json()
  },

  createMatch: async (userId: string): Promise<Match> => {
    const response = await fetch(`${API_BASE}/match/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    if (!response.ok) throw new Error('Failed to create match')
    return response.json()
  }
}
