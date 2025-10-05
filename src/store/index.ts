import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './slices/usersSlice'
import leadsReducer from './slices/leadsSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    leads: leadsReducer,
    dashboard: dashboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch