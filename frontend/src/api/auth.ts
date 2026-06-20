const API_BASE = '/api'

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  birthDate: string
  gender: string
  profilePhotoDataUrl?: string
  city: string
  termsAccepted: boolean
  allowChat: boolean
  allowMeetInPerson: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiresAt: string
  userId: string
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }))
      throw new Error(error.message || 'Registration failed')
    }
    return response.json()
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }))
      throw new Error(error.message || 'Login failed')
    }
    return response.json()
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken')
  },

  logout: (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
  }
}
