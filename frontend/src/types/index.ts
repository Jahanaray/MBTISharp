// Auth types
export interface RegisterRequest {
  phoneNumber: string
}

export interface VerifyOtpRequest {
  phoneNumber: string
  otp: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiresAt: string
}

// Quiz types
export interface Question {
  id: number
  text: string
  dimension: string
  optionA: string
  optionB: string
  weightA: number
  weightB: number
}

export interface SubmitAnswer {
  questionId: number
  selectedOption: string
}

export interface SubmitQuizRequest {
  userId: string
  answers: SubmitAnswer[]
}

export interface QuizResult {
  MBTIType: string
  Scores: Record<string, number>
}

// Match types
export interface Match {
  matchId: string
  userAId: string
  userBId: string
  status: string
  matchedAt: string
}

export interface CreateMatchRequest {
  userId: string
}

export interface MatchResponse {
  matchId: string
  userAId: string
  userBId: string
  status: string
  matchedAt: string
}

// Chat types
export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  sentAt: string
}

export interface SendMessageRequest {
  matchId: string
  senderId: string
  content: string
}

export interface MessageResponse {
  messageId: string
  matchId: string
  senderId: string
  content: string
  sentAt: string
}

// User types
export interface User {
  id: string
  phoneNumber: string
  phoneVerified: boolean
  mbtiType: string | null
  createdAt: string
  updatedAt: string
}
