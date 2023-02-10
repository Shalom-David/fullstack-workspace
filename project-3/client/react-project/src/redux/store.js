import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { loginReducer } from './features/userSlice.js'
import { vacationsReducer } from './features/vacationsSlice.js'

export default configureStore({
  reducer: {
    vacations: vacationsReducer,
    login: loginReducer,
  },
  middlewares: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger.createLogger()),
})
