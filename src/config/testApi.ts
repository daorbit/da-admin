import config from './api'

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', config.API_BASE_URL)
    
    const response = await fetch(`${config.API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('API connection successful:', data)
      return { success: true, data }
    } else {
      console.error('API connection failed:', response.status, response.statusText)
      return { success: false, error: `${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    console.error('API connection test failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Auto-test on load in development
if ((import.meta as any).env?.DEV) {
  testApiConnection()
}