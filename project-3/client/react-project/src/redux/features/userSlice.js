import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initialUser } from '../states.js'

export const getUserProfile = createAsyncThunk(
  'users/getUserProfile',
  async (username) => {
    try {
      axios.defaults.withCredentials = true

      const response = await axios.get(
        `http://localhost:8080/getUser?username=${username}`
      )
      return response.data
    } catch (error) {
      throw Error(`${error.response.data.errors}`)
    }
  }
)
export const login = createAsyncThunk('users/Login', async (data) => {
  try {
    axios.defaults.withCredentials = true

    const response = await axios.post('http://localhost:8080/login', data)

    return response.data
  } catch (error) {
    throw Error(`${error.response.data.errors}`)
  }
})
export const logout = createAsyncThunk('users/logout', async () => {
  try {
    axios.defaults.withCredentials = true

    const response = await axios.post('http://localhost:8080/logout')

    return response.data
  } catch (error) {
    throw Error(`${error.message} ${error.response.status}`)
  }
})
export const userRegister = createAsyncThunk(
  'users/register',
  async (newUser) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/register',
        newUser
      )

      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)
export const userUpdate = createAsyncThunk(
  'users/userUpdate',
  async (updateData) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/edit-profile?username=${updateData.username}`,
        updateData.formData
      )
      return response.data
    } catch (error) {
      throw Error(`${error.response.status} ${error.response.data.error}`)
    }
  }
)

const loginSlice = createSlice({
  name: 'users',
  initialState: initialUser,
  reducers: {
    reset: () => {
      return initialUser
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userDetail.username = action.payload.username
      state.userDetail.role = action.payload.role
      state.userDetail.firstName = action.payload.firstName
      state.userDetail.lastName = action.payload.lastName
      state.userDetail.followedVacations = action.payload.vacations
      state.errors = ''
    })
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.loginStatus = ''
      state.errors = action.error.message
    })
    builder.addCase(login.pending, (state, action) => {
      state.loginStatus = ''
      state.errors = ''
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loginStatus = action.payload
      state.errors = ''
      state.userDetail.role = action.payload.user.role
      state.userDetail.username = action.payload.user.username
      state.userDetail.firstName = action.payload.user.firstName
      state.userDetail.lastName = action.payload.user.lastName
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loginStatus = ''
      state.errors = action.error.message
    })
    builder.addCase(logout.pending, (state, action) => {
      state.loginStatus = ''
      state.userDetail.role = ''
      state.userDetail.username = ''
      state.userDetail.firstName = ''
      state.userDetail.lastName = ''
      state.userDetail.followedVacations = []
      state.errors = ''
    })
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loginStatus = action.payload
      state.errors = ''
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.loginStatus = ''
      state.errors = action.error.message
    })
    builder.addCase(userRegister.pending, (state, action) => {
      state.loginStatus = ''
      state.errors = ''
    })
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.loginStatus = action.payload
      state.errors = ''
    })
    builder.addCase(userRegister.rejected, (state, action) => {
      state.loginStatus = ''
      state.errors = action.error.message
    })

    builder.addCase(userUpdate.pending, (state, action) => {
      state.userUpdateStatus = false
      state.errors = ''
    })
    builder.addCase(userUpdate.fulfilled, (state, action) => {
      state.userDetail.username =
        action.payload[0].username === state.userDetail.username
          ? action.payload[0].username
          : ''
      state.userDetail.role = action.payload[0].role
      state.userDetail.firstName = action.payload[0].firstName
      state.userDetail.lastName = action.payload[0].lastName
      state.userDetail.followedVacations = action.payload[0].vacations
      state.userUpdateStatus = true
      state.errors = ''
    })
    builder.addCase(userUpdate.rejected, (state, action) => {
      state.loginStatus = ''
      state.errors = action.error.message
    })
  },
})

export const loginReducer = loginSlice.reducer
export const loginActions = loginSlice.actions
