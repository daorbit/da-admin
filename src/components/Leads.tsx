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
} from '@mui/icons-material'
import config from '../config/api'

interface Lead {
  _id: string
  name: string
  email: string
  company: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  source: string
  createdAt: string
  formattedDate: string
}



const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    closed: 0
  })

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`${config.API_BASE_URL}/api/leads?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setLeads(data.data.leads)
        setPagination(data.data.pagination)
        setStats(data.data.stats)
      } else {
        setError(data.message || 'Failed to fetch leads')
      }
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        // Update the lead in the local state
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead._id === leadId ? { ...lead, status: newStatus as any } : lead
          )
        )
        // Update selected lead if it's the one being updated
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus as any })
        }
        // Refresh to get updated stats
        fetchLeads()
      } else {
        setError(data.message || 'Failed to update lead status')
      }
    } catch (err) {
      console.error('Error updating lead status:', err)
      setError('Failed to update lead status')
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [page, statusFilter, searchTerm])

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
      <Typography variant="h4" gutterBottom>
        Leads Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <Card elevation={2} sx={{ minWidth: 120, flex: '1 1 120px' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="primary">
              {stats.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Leads
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{ minWidth: 120, flex: '1 1 120px' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="info.main">
              {stats.new || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{ minWidth: 120, flex: '1 1 120px' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="warning.main">
              {stats.contacted || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contacted
            </Typography>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{ minWidth: 120, flex: '1 1 120px' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="success.main">
              {stats.converted || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Converted
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" color="action" />
                      {lead.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" color="action" />
                      {lead.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Business fontSize="small" color="action" />
                      {lead.company || 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="contacted">Contacted</MenuItem>
                        <MenuItem value="qualified">Qualified</MenuItem>
                        <MenuItem value="converted">Converted</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" color="action" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewLead(lead)}
                        color="primary"
                      >
                        <Visibility />
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
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={pagination.pages}
              page={page}
              onChange={handlePageChange}
              color="primary"
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
      >
        <DialogTitle>
          Lead Details
        </DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box>
              <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <Card elevation={1} sx={{ flex: '1 1 200px', p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Name
                  </Typography>
                  <Typography variant="body1">{selectedLead.name}</Typography>
                </Card>
                <Card elevation={1} sx={{ flex: '1 1 200px', p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedLead.email}</Typography>
                </Card>
              </Box>
              
              <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <Card elevation={1} sx={{ flex: '1 1 200px', p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Company
                  </Typography>
                  <Typography variant="body1">{selectedLead.company || 'N/A'}</Typography>
                </Card>
                <Card elevation={1} sx={{ flex: '1 1 200px', p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    color={getStatusColor(selectedLead.status) as any}
                    size="small"
                  />
                </Card>
              </Box>

              <Card elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Message
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedLead.message}
                </Typography>
              </Card>

              <Box display="flex" gap={2} flexWrap="wrap">
                <Card elevation={1} sx={{ flex: '1 1 200px', p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Source
                  </Typography>
                  <Typography variant="body1">{selectedLead.source}</Typography>
                </Card>
                <Card elevation={1} sx={{ flex: '1 1 200px', p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Submitted
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </Typography>
                </Card>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Leads