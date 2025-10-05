import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiService from '../../config/apiService'

export interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar: string | null
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface Stats {
  total: number
  admin: number
}

interface UsersState {
  users: User[]
  pagination: Pagination | null
  stats: Stats | null
  loading: boolean
  error: string | null
  lastFetch: number | null
}

const initialState: UsersState = {
  users: [],
  pagination: null,
  stats: null,
  loading: false,
  error: null,
  lastFetch: null,
}

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAllUsers()
      
      if (response.success) {
        return {
          users: response.users || [],
          pagination: response.pagination || null,
          stats: response.stats || null
        }
      } else {
        return rejectWithValue(response.message || 'Failed to fetch users')
      }
    } catch (error) {
      return rejectWithValue('Error fetching users')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{users: User[], pagination: Pagination | null, stats: Stats | null}>) => {
        state.loading = false
        state.users = action.payload.users
        state.pagination = action.payload.pagination
        state.stats = action.payload.stats
        state.lastFetch = Date.now()
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = usersSlice.actions
export default usersSlice.reducer