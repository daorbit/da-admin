import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import PasskeyVerification from '../components/PasskeyVerification'

const PasskeyVerificationPage = () => {
  const navigate = useNavigate()

  const handlePasskeyVerified = () => {
    navigate('/signup')
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            mb: 4,
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          DA Admin
        </Typography>
        
        <PasskeyVerification onPasskeyVerified={handlePasskeyVerified} />
        
        <Typography sx={{ mt: 2, color: 'white' }}>
          Already have an account?{' '}
          <Box
            component="button"
            onClick={handleBackToLogin}
            sx={{
              background: 'none',
              border: 'none',
              color: '#FBBF24',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 'inherit',
              fontWeight: 500,
              '&:hover': {
                color: '#F59E0B',
              },
            }}
          >
            Login here
          </Box>
        </Typography>
      </Box>
    </Box>
  )
}

export default PasskeyVerificationPage