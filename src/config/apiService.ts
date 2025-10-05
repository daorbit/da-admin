import config from './api'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
  token?: string
  user?: any
  users?: any[]
  pagination?: any
  stats?: any
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
      const url = `${config.API_BASE_URL}${endpoint}`
      console.log('Making API request to:', url)
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options
      })

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the API server. Please check your internet connection.'
        }
      }
      
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

  // Users methods
  async getAllUsers(): Promise<ApiResponse> {
    return this.request('/api/users', {
      method: 'GET'
    })
  }

  async getUserById(id: string): Promise<ApiResponse> {
    return this.request(`/api/users/${id}`, {
      method: 'GET'
    })
  }
}

export const apiService = new ApiService()
export default apiService