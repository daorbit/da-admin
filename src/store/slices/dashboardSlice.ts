import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiService from '../../config/apiService'

export interface DashboardStats {
  totalUsers: number
  adminUsers: number
  activeUsers: number
  totalLeads: number
  newLeads: number
  convertedLeads: number
  contactedLeads: number
  qualifiedLeads: number
  closedLeads: number
}

interface DashboardState {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  lastFetch: number | null
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastFetch: null,
}

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getDashboardStats()
      
      if (response.success && response.data) {
        const { users, leads } = response.data
        
        // Calculate stats from users data
        const totalUsers = users.stats?.total || users.users?.length || 0
        const adminUsers = users.stats?.admin || users.users?.filter((u: any) => u.role === 'admin').length || 0
        const activeUsers = users.users?.filter((u: any) => u.isActive).length || 0
        
        // Calculate stats from leads data
        const totalLeads = leads.stats?.total || leads.leads?.length || 0
        const newLeads = leads.stats?.new || leads.leads?.filter((l: any) => l.status === 'new').length || 0
        const convertedLeads = leads.stats?.converted || leads.leads?.filter((l: any) => l.status === 'converted').length || 0
        const contactedLeads = leads.stats?.contacted || leads.leads?.filter((l: any) => l.status === 'contacted').length || 0
        const qualifiedLeads = leads.stats?.qualified || leads.leads?.filter((l: any) => l.status === 'qualified').length || 0
        const closedLeads = leads.stats?.closed || leads.leads?.filter((l: any) => l.status === 'closed').length || 0
        
        const dashboardStats: DashboardStats = {
          totalUsers,
          adminUsers,
          activeUsers,
          totalLeads,
          newLeads,
          convertedLeads,
          contactedLeads,
          qualifiedLeads,
          closedLeads,
        }

        return dashboardStats
      } else {
        return rejectWithValue(response.message || 'Failed to fetch dashboard stats')
      }
    } catch (error) {
      return rejectWithValue('Error fetching dashboard stats')
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    // Action to update specific stats without full refetch
    updateUserStats: (state, action: PayloadAction<{ totalUsers: number; adminUsers: number; activeUsers: number }>) => {
      if (state.stats) {
        state.stats.totalUsers = action.payload.totalUsers
        state.stats.adminUsers = action.payload.adminUsers
        state.stats.activeUsers = action.payload.activeUsers
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
        state.lastFetch = Date.now()
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, updateUserStats } = dashboardSlice.actions
export default dashboardSlice.reducer