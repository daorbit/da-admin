// API Configuration
const config = {
  // Use environment variable if available, otherwise use production URL
  API_BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://da-backend-ochre.vercel.app/',
  
  // API endpoints
  endpoints: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    users: '/api/users',
    leads: '/api/leads',
  }
}

export default config