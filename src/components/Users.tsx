import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Button,
} from "@mui/material";
import {
  Person,
  AdminPanelSettings,
  Search,
  Refresh,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
  fetchUsers, 
  clearError, 
  updateUserRole, 
  updateUserStatus, 
  deleteUser,
  User 
} from "../store/slices/usersSlice";
import { updateUserStats } from "../store/slices/dashboardSlice";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, pagination, stats, loading, error } = useAppSelector((state) => state.users);
  const dashboardStats = useAppSelector((state) => state.dashboard.stats);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states and selected user
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchUsers());
  };

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleStatusToggle = async (user: User) => {
    setSelectedUser(user);
    try {
      await dispatch(updateUserStatus({ 
        id: user._id, 
        isActive: !user.isActive 
      })).unwrap();
      updateDashboardStats();
      setSnackbarMessage(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to update user status');
      setSnackbarOpen(true);
    }
    setSelectedUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (selectedUser && newRole !== selectedUser.role) {
      try {
        await dispatch(updateUserRole({ id: selectedUser._id, role: newRole })).unwrap();
        updateDashboardStats();
        setSnackbarMessage('User role updated successfully');
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('Failed to update user role');
        setSnackbarOpen(true);
      }
    }
    handleRoleDialogClose();
  };

  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setNewRole('');
  };



  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      console.log('Attempting to delete user:', selectedUser._id);
      try {
        const result = await dispatch(deleteUser(selectedUser._id)).unwrap();
        console.log('Delete result:', result);
        updateDashboardStats();
        setSnackbarMessage('User deleted successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Delete error:', error);
        setSnackbarMessage(`Failed to delete user: ${error}`);
        setSnackbarOpen(true);
      }
    }
    handleDeleteDialogClose();
  };

  const handleDeleteCancel = () => {
    handleDeleteDialogClose();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Helper function to update dashboard stats after user operations
  const updateDashboardStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const activeUsers = users.filter(u => u.isActive).length;
    
    dispatch(updateUserStats({
      totalUsers,
      adminUsers,
      activeUsers
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "error";
      case "moderator":
        return "warning";
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleIcon = (role: string) => {
    return role.toLowerCase() === "admin" ? <AdminPanelSettings /> : <Person />;
  };

  // Filter users based on search term, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch =
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "all" ||
        user?.role.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive === true) ||
        (statusFilter === "inactive" && user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Get paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Person />
          Users Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Section - Use dashboard stats if available, fallback to users stats */}
      {(dashboardStats || stats) && (
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Paper elevation={1} sx={{ p: 2, flex: "1 1 200px", minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {dashboardStats?.totalUsers || stats?.total || users?.length || 0}
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, flex: "1 1 200px", minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Admin Users
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {dashboardStats?.adminUsers || stats?.admin || users?.filter(u => u.role === 'admin').length || 0}
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, flex: "1 1 200px", minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {dashboardStats?.activeUsers || users?.filter(u => u?.isActive).length || 0}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Filter Controls */}
      <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          <Box sx={{ flex: { xs: "1 1 auto", md: "1 1 300px" } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: "1 1 auto", md: "0 1 200px" } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: { xs: "1 1 auto", md: "0 1 200px" } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <Box p={2} borderBottom={1} borderColor="divider">
          <Typography variant="h6" color="text.secondary">
            Showing {filteredUsers.length} of {users.length} users
            {pagination && ` (Page ${pagination.page} of ${pagination.pages})`}
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>User</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Role</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Created</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Last Login</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Status</TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user: User) => (
                <TableRow key={user._id} hover>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                      <Avatar 
                        src={user.avatar || undefined}
                        sx={{ 
                          bgcolor: "primary.main",
                          width: { xs: 32, sm: 40 },
                          height: { xs: 32, sm: 40 },
                          fontSize: { xs: "0.875rem", sm: "1.25rem" }
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="medium"
                          sx={{ 
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            lineHeight: 1.2,
                            wordBreak: "break-word"
                          }}
                        >
                          {user.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: "0.6875rem", sm: "0.75rem" },
                            lineHeight: 1.2,
                            wordBreak: "break-all"
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 100 }}>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={
                        user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      }
                      color={getRoleColor(user.role) as any}
                      size="small"
                      sx={{ 
                        fontSize: { xs: "0.625rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography 
                      variant="body2"
                      sx={{ fontSize: { xs: "0.6875rem", sm: "0.875rem" } }}
                    >
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography
                      variant="body2"
                      color={user.lastLogin ? "text.primary" : "text.secondary"}
                      sx={{ fontSize: { xs: "0.6875rem", sm: "0.875rem" } }}
                    >
                      {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 80 }}>
                    <Chip
                      label={user.isActive ? "Active" : "Inactive"}
                      color={user.isActive ? "success" : "default"}
                      size="small"
                      sx={{ 
                        fontSize: { xs: "0.625rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 140 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 0.5, sm: 1 } }}>
                      <Tooltip title="Change Role">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleRoleChange(user)}
                          sx={{ padding: { xs: "4px", sm: "8px" } }}
                        >
                          <Edit sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isActive ? "Deactivate User" : "Activate User"}>
                        <IconButton 
                          size="small" 
                          color={user.isActive ? "warning" : "success"}
                          onClick={() => handleStatusToggle(user)}
                          sx={{ padding: { xs: "4px", sm: "8px" } }}
                        >
                          <AdminPanelSettings sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                          sx={{ padding: { xs: "4px", sm: "8px" } }}
                        >
                          <Delete sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredUsers.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              {users.length === 0
                ? "No users found"
                : "No users match the current filters"}
            </Typography>
          </Box>
        )}

        {filteredUsers.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>



      {/* Role Change Dialog */}
      <Dialog 
        open={roleDialogOpen} 
        onClose={handleRoleDialogClose}
        aria-labelledby="role-dialog-title"
        disableRestoreFocus
      >
        <DialogTitle id="role-dialog-title">Change User Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Change role for: <strong>{selectedUser?.name}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoleDialogClose}>Cancel</Button>
          <Button onClick={handleRoleUpdate} variant="contained">Update Role</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        disableRestoreFocus
      >
        <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Users;
