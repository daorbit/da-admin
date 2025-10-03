import { useState, useEffect } from 'react'
import apiService from './config/apiService'
import './config/testApi' // This will auto-test API connection in development
import './App.css'
import Dashboard from './components/Dashboard'
import Signup from './components/Signup'
import Login from './components/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with backend
      apiService.getCurrentUser()
        .then(data => {
          if (data.success) {
            setIsAuthenticated(true)
            setUser(data.user)
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('token', token)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="auth-container">
      <h1>DA Admin</h1>
      {showSignup ? (
        <>
          <Signup onSignup={handleLogin} />
          <p>
            Already have an account?{' '}
            <button 
              className="link-button" 
              onClick={() => setShowSignup(false)}
            >
              Login here
            </button>
          </p>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
          <p>
            Don't have an account?{' '}
            <button 
              className="link-button" 
              onClick={() => setShowSignup(true)}
            >
              Sign up here
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default App