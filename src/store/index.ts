import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './slices/usersSlice'
import leadsReducer from './slices/leadsSlice'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    leads: leadsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch