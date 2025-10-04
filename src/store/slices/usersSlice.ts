import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiService from '../../config/apiService'

export interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
  lastLogin?: string
  isActive?: boolean
}

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  lastFetch: number | null
}

const initialState: UsersState = {
  users: [],
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
      
      if (response.success && response.data?.users) {
        return response.data.users
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
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.users = action.payload
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