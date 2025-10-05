import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tab,
  Tabs,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  Analytics,
  Settings,
  AccountCircle,
  Logout,
  Person,
  AdminPanelSettings,
} from "@mui/icons-material";

interface DashboardLayoutProps {
  user: any;
  onLogout: () => void;
}

const DashboardLayout = ({ user, onLogout }: DashboardLayoutProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to tab values
  const routeToTab: { [key: string]: number } = {
    '/dashboard': 0,
    '/dashboard/users': 1,
    '/dashboard/leads': 2,
    '/dashboard/settings': 3,
  };

  // Get current tab based on route
  const currentTab = routeToTab[location.pathname] ?? 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const routes = ['/dashboard', '/dashboard/users', '/dashboard/leads', '/dashboard/settings'];
    navigate(routes[newValue]);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    onLogout();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'error' : 'primary';
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <AdminPanelSettings /> : <Person />;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DA Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography variant="body2" sx={{ color: "inherit" }}>
                      {user.name}
                    </Typography>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      color={getRoleColor(user.role) as any}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: "0.625rem",
                        '& .MuiChip-icon': { fontSize: '0.875rem' }
                      }}
                    />
                  </Box>
                </Box>
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                  <AccountCircle />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.12)" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          >
            <Tab icon={<DashboardIcon />} label="Overview" />
            <Tab icon={<People />} label="Users" />
            <Tab icon={<Analytics />} label="Leads" />
            <Tab icon={<Settings />} label="Settings" />
          </Tabs>
        </Box>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;