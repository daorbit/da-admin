import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Alert,
  Pagination,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Visibility,
  Email,
  Business,
  Person,
  CalendarToday,
  Search,
  FilterList,
  Refresh,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchLeads, updateLeadStatus, clearError, Lead } from '../store/slices/leadsSlice'

const Leads: React.FC = () => {
  const dispatch = useAppDispatch()
  const { leads, loading, error, pagination, stats } = useAppSelector((state) => state.leads)
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchLeads({
      page,
      limit: 10,
      status: statusFilter,
      search: searchTerm
    }))
  }, [dispatch, page, statusFilter, searchTerm])

  const handleRefresh = () => {
    dispatch(clearError())
    dispatch(fetchLeads({
      page,
      limit: 10,
      status: statusFilter,
      search: searchTerm
    }))
  }

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    await dispatch(updateLeadStatus({ leadId, status: newStatus }))
    // Update selected lead if it's the one being updated
    if (selectedLead && selectedLead._id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus as Lead['status'] })
    }
    // Refresh to get updated stats
    handleRefresh()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'info'
      case 'contacted': return 'warning'
      case 'qualified': return 'primary'
      case 'converted': return 'success'
      case 'closed': return 'default'
      default: return 'default'
    }
  }

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedLead(null)
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1) // Reset to first page when searching
  }

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value)
    setPage(1) // Reset to first page when filtering
  }

  if (loading && leads.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Typography 
          variant="h4"
          sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
        >
          Leads Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box 
        sx={{
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 2 }, 
          mb: 3,
          '& > *': {
            flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 120px' }
          }
        }}
      >
        <Card elevation={2} sx={{ minWidth: { xs: 100, sm: 120 } }}>
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
            <Typography 
              variant="h4" 
              color="primary"
              sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
            >
              {stats.total || 0}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Total Leads
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{ minWidth: { xs: 100, sm: 120 } }}>
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
            <Typography 
              variant="h4" 
              color="info.main"
              sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
            >
              {stats.new || 0}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              New
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{ minWidth: { xs: 100, sm: 120 } }}>
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
            <Typography 
              variant="h4" 
              color="warning.main"
              sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
            >
              {stats.contacted || 0}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Contacted
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{ minWidth: { xs: 100, sm: 120 } }}>
          <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
            <Typography 
              variant="h4" 
              color="success.main"
              sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
            >
              {stats.converted || 0}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Converted
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box 
        sx={{
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }
        }}
      >
        <TextField
          size="small"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ 
            minWidth: { xs: 'auto', sm: 200 },
            flex: { xs: '1', sm: '0 1 300px' }
          }}
        />
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: { xs: 'auto', sm: 150 },
            flex: { xs: '1', sm: '0 1 200px' }
          }}
        >
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status Filter"
            startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="qualified">Qualified</MenuItem>
            <MenuItem value="converted">Converted</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Leads Table */}
      <Card elevation={2}>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Company</TableCell>
                <TableCell sx={{ minWidth: 130 }}>Status</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Date</TableCell>
                <TableCell align="center" sx={{ minWidth: 80 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead: Lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
                      <Person 
                        fontSize="small" 
                        color="action" 
                        sx={{ display: { xs: 'none', sm: 'block' } }} 
                      />
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {lead.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
                      <Email 
                        fontSize="small" 
                        color="action" 
                        sx={{ display: { xs: 'none', sm: 'block' } }} 
                      />
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          wordBreak: 'break-all'
                        }}
                      >
                        {lead.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
                      <Business 
                        fontSize="small" 
                        color="action" 
                        sx={{ display: { xs: 'none', sm: 'block' } }} 
                      />
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {lead.company || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 130 }}>
                    <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
                      <Select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="contacted">Contacted</MenuItem>
                        <MenuItem value="qualified">Qualified</MenuItem>
                        <MenuItem value="converted">Converted</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ minWidth: 100 }}>
                    <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
                      <CalendarToday 
                        fontSize="small" 
                        color="action" 
                        sx={{ display: { xs: 'none', sm: 'block' } }} 
                      />
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.6875rem', sm: '0.875rem' } }}
                      >
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 80 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewLead(lead)}
                        color="primary"
                        sx={{ padding: { xs: '4px', sm: '8px' } }}
                      >
                        <Visibility sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leads found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Box 
            display="flex" 
            justifyContent="center" 
            p={2}
            sx={{
              '& .MuiPagination-ul': {
                flexWrap: 'wrap',
                justifyContent: 'center'
              }
            }}
          >
            <Pagination
              count={pagination.pages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              siblingCount={window.innerWidth < 600 ? 0 : 1}
              boundaryCount={window.innerWidth < 600 ? 1 : 2}
            />
          </Box>
        )}
      </Card>

      {/* Lead Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600}
        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 1, sm: 2 },
            maxHeight: { xs: '100vh', sm: 'calc(100% - 64px)' }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Lead Details
        </DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box>
              <Box 
                sx={{
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  mb: 3, 
                  flexDirection: { xs: 'column', sm: 'row' }
                }}
              >
                <Card elevation={1} sx={{ flex: '1', p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Name
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {selectedLead.name}
                  </Typography>
                </Card>
                <Card elevation={1} sx={{ flex: '1', p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Email
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-all'
                    }}
                  >
                    {selectedLead.email}
                  </Typography>
                </Card>
              </Box>
              
              <Box 
                sx={{
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  mb: 3, 
                  flexDirection: { xs: 'column', sm: 'row' }
                }}
              >
                <Card elevation={1} sx={{ flex: '1', p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Company
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {selectedLead.company || 'N/A'}
                  </Typography>
                </Card>
                <Card elevation={1} sx={{ flex: '1', p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    color={getStatusColor(selectedLead.status) as any}
                    size="small"
                    sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}
                  />
                </Card>
              </Box>

              <Card elevation={1} sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Message
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.5
                  }}
                >
                  {selectedLead.message}
                </Typography>
              </Card>

              <Box 
                sx={{
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  flexDirection: { xs: 'column', sm: 'row' }
                }}
              >
                <Card elevation={1} sx={{ flex: '1', p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Source
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {selectedLead.source}
                  </Typography>
                </Card>
                <Card elevation={1} sx={{ flex: '1', p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Submitted
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </Typography>
                </Card>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 2 } }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Leads