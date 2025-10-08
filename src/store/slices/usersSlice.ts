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
  sourceApp?: 'snappixy' | 'the-techodio' | 'draft2dev' | 'da-admin'
  authProvider?: 'local' | 'google'
  googleId?: string
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

// Async thunk for updating user role
export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }: { id: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserRole(id, role)
      
      if (response.success) {
        // The user object is spread directly in the response, not in a data field
        const { success, message, ...userData } = response;
        return { id, user: userData as User }
      } else {
        return rejectWithValue(response.message || 'Failed to update user role')
      }
    } catch (error) {
      return rejectWithValue('Error updating user role')
    }
  }
)

// Async thunk for updating user status
export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserStatus(id, isActive)
      
      if (response.success) {
        // The user object is spread directly in the response, not in a data field
        const { success, message, ...userData } = response;
        return { id, user: userData as User }
      } else {
        return rejectWithValue(response.message || 'Failed to update user status')
      }
    } catch (error) {
      return rejectWithValue('Error updating user status')
    }
  }
)

// Async thunk for deleting user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteUser(id)
      
      if (response.success) {
        return id
      } else {
        return rejectWithValue(response.message || 'Failed to delete user')
      }
    } catch (error) {
      return rejectWithValue('Error deleting user')
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
      // Fetch users
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
      
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.error = null
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { id, user } = action.payload
        const index = state.users.findIndex(u => u._id === id)
        if (index !== -1) {
          state.users[index] = user
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload as string
      })
      
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.error = null
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, user } = action.payload
        const index = state.users.findIndex(u => u._id === id)
        if (index !== -1) {
          state.users[index] = user
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload as string
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload)
        if (state.stats) {
          state.stats.total -= 1
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError } = usersSlice.actions
export default usersSlice.reducer