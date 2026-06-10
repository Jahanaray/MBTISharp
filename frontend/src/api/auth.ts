const API_BASE = '/api'

export interface RegisterRequest {
  phoneNumber: string
}

export interface VerifyRequest {
  phoneNumber: string
  otp: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiresAt: string
}

export const authApi = {
  register: async (phoneNumber: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    })
    if (!response.ok) throw new Error('Registration failed')
  },

  verify: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    })
    if (!response.ok) throw new Error('Verification failed')
    return response.json()
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken')
  },

  logout: (): void => {
    localStorage.removeItem('authToken')
  }
}
