import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import {
  People,
  Analytics,
  TrendingUp,
  AdminPanelSettings,
} from "@mui/icons-material";

interface DashboardOverviewProps {
  user: any;
}

const DashboardOverview = ({ user }: DashboardOverviewProps) => {
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

  const statsCards = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <People sx={{ fontSize: 40 }} />,
      color: "primary.main",
      change: "+12%",
    },
    {
      title: "Active Leads",
      value: "856",
      icon: <Analytics sx={{ fontSize: 40 }} />,
      color: "success.main",
      change: "+8%",
    },
    {
      title: "Conversion Rate",
      value: "24.5%",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "warning.main",
      change: "+3%",
    },
    {
      title: "Admin Users",
      value: "12",
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: "error.main",
      change: "0%",
    },
  ];

  return (
    <Box p={3}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name || "Admin"}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your admin panel today.
        </Typography>
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
                    color={card.change.startsWith("+") ? "success.main" : "text.secondary"}
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