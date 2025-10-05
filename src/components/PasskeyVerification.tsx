import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { VpnKey, Visibility, VisibilityOff } from '@mui/icons-material'

interface PasskeyVerificationProps {
  onPasskeyVerified: () => void
}

// Get passkey from environment variables
const SIGNUP_PASSKEY = (import.meta.env.VITE_SIGNUP_PASSKEY as string)

const PasskeyVerification = ({ onPasskeyVerified }: PasskeyVerificationProps) => {
  const [passkey, setPasskey] = useState('')
  const [error, setError] = useState('')
  const [showPasskey, setShowPasskey] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passkey.trim()) {
      setError('Please enter the passkey')
      return
    }

    if (passkey === SIGNUP_PASSKEY) {
      onPasskeyVerified()
    } else {
      setError('Invalid passkey. Please contact the administrator for access.')
      setPasskey('')
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
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VpnKey sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Access Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter passkey to continue
          </Typography>
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
        This signup requires a special passkey. Please contact the administrator if you don't have access.
      </Typography>

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
          id="passkey"
          name="passkey"
          label="Passkey"
          type={showPasskey ? 'text' : 'password'}
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          required
          autoFocus
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
                <VpnKey sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasskey(!showPasskey)}
                  edge="end"
                  size="small"
                >
                  {showPasskey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
            boxShadow: '0 4px 15px 0 rgba(99, 102, 241, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #4F46E5 30%, #7C3AED 90%)',
              boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.6)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
          startIcon={<VpnKey />}
        >
          Verify Access
        </Button>

 
      </Box>
    </Paper>
  )
}

export default PasskeyVerification