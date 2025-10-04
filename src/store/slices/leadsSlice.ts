import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import config from '../../config/api'

export interface Lead {
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

interface LeadsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface LeadsStats {
  total: number
  new: number
  contacted: number
  qualified: number
  converted: number
  closed: number
}

interface FetchLeadsParams {
  page?: number
  limit?: number
  status?: string
  search?: string
}

interface LeadsState {
  leads: Lead[]
  loading: boolean
  error: string | null
  pagination: LeadsPagination
  stats: LeadsStats
  lastFetch: number | null
}

const initialState: LeadsState = {
  leads: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  stats: {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    closed: 0
  },
  lastFetch: null,
}

// Async thunk for fetching leads
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params: FetchLeadsParams = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        ...(params.status && params.status !== 'all' && { status: params.status }),
        ...(params.search && { search: params.search })
      })

      const response = await fetch(`${config.API_BASE_URL}/api/leads?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        return {
          leads: data.data.leads,
          pagination: data.data.pagination,
          stats: data.data.stats
        }
      } else {
        return rejectWithValue(data.message || 'Failed to fetch leads')
      }
    } catch (error) {
      return rejectWithValue('Failed to connect to server')
    }
  }
)

// Async thunk for updating lead status
export const updateLeadStatus = createAsyncThunk(
  'leads/updateLeadStatus',
  async ({ leadId, status }: { leadId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()

      if (data.success) {
        return { leadId, status }
      } else {
        return rejectWithValue(data.message || 'Failed to update lead status')
      }
    } catch (error) {
      return rejectWithValue('Failed to connect to server')
    }
  }
)

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false
        state.leads = action.payload.leads
        state.pagination = action.payload.pagination
        state.stats = action.payload.stats
        state.lastFetch = Date.now()
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update lead status
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const { leadId, status } = action.payload
        const leadIndex = state.leads.findIndex(lead => lead._id === leadId)
        if (leadIndex !== -1) {
          state.leads[leadIndex].status = status as Lead['status']
        }
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError } = leadsSlice.actions
export default leadsSlice.reducer