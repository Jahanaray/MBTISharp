const API_BASE = '/api'

export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  sentAt: string
}

export const chatApi = {
  getHistory: async (matchId: string): Promise<Message[]> => {
    const response = await fetch(`${API_BASE}/chat/history?matchId=${matchId}`)
    if (!response.ok) throw new Error('Failed to fetch history')
    return response.json()
  },

  sendMessage: async (matchId: string, senderId: string, content: string): Promise<Message> => {
    const response = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, senderId, content })
    })
    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
  }
}
