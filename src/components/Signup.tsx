import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Person, Email, Lock, PersonAdd } from '@mui/icons-material'
import apiService from '../config/apiService'

interface SignupProps {
  onSignup: (userData: any, token: string) => void
}

const Signup = ({ onSignup }: SignupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!formData.name.trim()) {
      setError('Full name is required')
      return
    }

    setLoading(true)

    try {
      const data = await apiService.register(formData.name, formData.email, formData.password)

      if (data.success) {
        onSignup(data.user, data.token!)
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map((err: any) => err.msg).join(', '))
        } else {
          setError(data.message || 'Signup failed')
        }
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        maxWidth: 400,
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #EC4899, #F472B6)',
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PersonAdd sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Join Us
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: 'error.main',
            },
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          id="name"
          name="name"
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
          autoFocus
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: 'secondary.main' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: 'secondary.main' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          fullWidth
          margin="normal"
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          helperText="Must be at least 6 characters"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: 'secondary.main' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? '🙈' : '👁️'}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: 'secondary.main' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            background: loading 
              ? 'linear-gradient(45deg, #94A3B8 30%, #CBD5E1 90%)'
              : 'linear-gradient(45deg, #EC4899 30%, #F472B6 90%)',
            boxShadow: '0 4px 15px 0 rgba(236, 72, 153, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #DB2777 30%, #EC4899 90%)',
              boxShadow: '0 6px 20px 0 rgba(236, 72, 153, 0.6)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: 'linear-gradient(45deg, #94A3B8 30%, #CBD5E1 90%)',
              boxShadow: 'none',
              transform: 'none',
            },
            transition: 'all 0.2s ease-in-out',
          }}
          startIcon={loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <PersonAdd />
          )}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            By signing up, you agree to our{' '}
            <Box
              component="span"
              sx={{
                color: 'secondary.main',
                cursor: 'pointer',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </Box>
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default Signup