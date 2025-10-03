import config from './api'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
  token?: string
  user?: any
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      }
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request(config.endpoints.login, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    return this.request(config.endpoints.register, {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request(config.endpoints.me, {
      method: 'GET'
    })
  }
}

export const apiService = new ApiService()
export default apiService