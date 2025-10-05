import { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  People,
  Analytics,
  TrendingUp,
  AdminPanelSettings,
  Refresh,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardStats, clearError } from "../store/slices/dashboardSlice";

interface DashboardOverviewProps {
  user: any;
}

const DashboardOverview = ({ user }: DashboardOverviewProps) => {
  const dispatch = useAppDispatch();
  const { stats, loading, error, lastFetch } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    // Only fetch if we don't have recent data (within last 5 minutes)
    const shouldFetch = !stats || !lastFetch || (Date.now() - lastFetch > 5 * 60 * 1000);
    if (shouldFetch) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, stats, lastFetch]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchDashboardStats());
  };

  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";
  };

  const calculateConversionRate = () => {
    if (!stats || stats.totalLeads === 0) return "0%";
    return ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1) + "%";
  };

  const getStatsCards = () => {
    if (!stats) return [];
    
    return [
      {
        title: "Total Users",
        value: stats.totalUsers.toString(),
        icon: <People sx={{ fontSize: 40 }} />,
        color: "primary.main",
        change: `${stats.activeUsers} active`,
      },
      {
        title: "Total Leads", 
        value: stats.totalLeads.toString(),
        icon: <Analytics sx={{ fontSize: 40 }} />,
        color: "success.main",
        change: `${stats.newLeads} new`,
      },
      {
        title: "Conversion Rate",
        value: calculateConversionRate(),
        icon: <TrendingUp sx={{ fontSize: 40 }} />,
        color: "warning.main",
        change: `${stats.convertedLeads} converted`,
      },
      {
        title: "Admin Users",
        value: stats.adminUsers.toString(),
        icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
        color: "error.main",
        change: `${stats.totalUsers - stats.adminUsers} regular`,
      },
    ];
  };

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={60} />
          <Typography variant="body1">Loading dashboard stats...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box display="flex" justifyContent="center">
          <Typography variant="body2" color="text.secondary">
            Unable to load dashboard statistics. Please try refreshing the page.
          </Typography>
        </Box>
      </Box>
    );
  }

  const statsCards = getStatsCards();

  return (
    <Box p={3}>
      {/* Welcome Section */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name || "Admin"}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your admin panel today.
          </Typography>
          {lastFetch && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
              Last updated: {new Date(lastFetch).toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Tooltip title="Refresh Stats">
          <IconButton 
            onClick={handleRefresh} 
            disabled={loading}
            sx={{ ml: 2 }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {statsCards.map((card, index) => (
          <Box key={index} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {card.change}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* User Info Card */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="body1" mb={2}>
                {user?.name || "N/A"}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" mb={2}>
                {user?.email || "N/A"}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Role
              </Typography>
              <Typography variant="body1" mb={2}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "N/A"}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Login
              </Typography>
              <Typography variant="body1">
                {user?.lastLogin ? formatDate(user.lastLogin) : "N/A"}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Navigate to different sections:
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">
                  • <strong>Users:</strong> Manage user accounts and roles
                </Typography>
                <Typography variant="body2">
                  • <strong>Leads:</strong> View and manage lead information
                </Typography>
                <Typography variant="body2">
                  • <strong>Settings:</strong> Configure system settings
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardOverview;