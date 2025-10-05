import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Button,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Notifications,
  Security,
  Palette,
} from "@mui/icons-material";

const Settings = () => {
  return (
    <Box p={3}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SettingsIcon />
        <Typography variant="h4">Settings</Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        {/* General Settings */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Notifications sx={{ mr: 1, verticalAlign: "middle" }} />
            Notifications
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications for new users"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications for new leads"
            />
            <FormControlLabel
              control={<Switch />}
              label="Push notifications"
            />
          </Box>
        </Paper>

        {/* Security Settings */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Security sx={{ mr: 1, verticalAlign: "middle" }} />
            Security
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Two-factor authentication"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Login alerts"
            />
            <Divider sx={{ my: 2 }} />
            <Button variant="outlined" color="primary" sx={{ alignSelf: "flex-start" }}>
              Change Password
            </Button>
          </Box>
        </Paper>

        {/* Appearance Settings */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Palette sx={{ mr: 1, verticalAlign: "middle" }} />
            Appearance
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
              control={<Switch />}
              label="Dark mode"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Compact layout"
            />
          </Box>
        </Paper>

        {/* Actions */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" color="primary">
              Save Settings
            </Button>
            <Button variant="outlined" color="secondary">
              Reset to Default
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;