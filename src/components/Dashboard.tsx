import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People,
  Analytics,
  Settings,
  AccountCircle,
  Logout,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material'
import Users from './Users'

interface DashboardProps {
  user: any
  onLogout: () => void
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    console.log(event)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    onLogout()
  }

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) : 'N/A'
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DA Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, {user?.name}!
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<People />} label="Users" />
          <Tab icon={<Analytics />} label="Analytics" />
          <Tab icon={<Settings />} label="Settings" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Dashboard Overview */}
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>
          
          {/* User Info Card */}
          <Box sx={{ mb: 4, maxWidth: 600 }}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    icon={user?.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                    label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    color={user?.role === 'admin' ? 'error' : 'primary'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Login:</strong> {formatDate(user?.lastLogin)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Account Created:</strong> {formatDate(user?.createdAt)}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Feature Cards */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Admin Features
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Card elevation={2} sx={{ minWidth: 280, flex: '1 1 280px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <People color="primary" />
                  <Typography variant="h6">User Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage users and their permissions
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} sx={{ minWidth: 280, flex: '1 1 280px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Analytics color="primary" />
                  <Typography variant="h6">Analytics</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View system analytics and reports
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={2} sx={{ minWidth: 280, flex: '1 1 280px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Settings color="primary" />
                  <Typography variant="h6">Settings</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Configure system settings
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Users />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analytics features coming soon...
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Settings features coming soon...
          </Typography>
        </Box>
      </TabPanel>
    </Box>
  )
}

export default Dashboard