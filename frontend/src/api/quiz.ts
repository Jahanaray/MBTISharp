const API_BASE = '/api'

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

export const quizApi = {
  getQuestions: async (): Promise<Question[]> => {
    const response = await fetch(`${API_BASE}/quiz/questions`)
    if (!response.ok) throw new Error('Failed to fetch questions')
    return response.json()
  },

  submitQuiz: async (request: SubmitQuizRequest): Promise<QuizResult> => {
    const response = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
    if (!response.ok) throw new Error('Failed to submit quiz')
    return response.json()
  },

  getResult: async (userId: string): Promise<{ MBTIType: string }> => {
    const response = await fetch(`${API_BASE}/quiz/result/${userId}`)
    if (!response.ok) throw new Error('Failed to fetch result')
    return response.json()
  }
}
