import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initialVacations } from '../states.js'
import { Buffer } from 'buffer'
export const fetchVacations = createAsyncThunk(
  'vacations/fetchVacations',
  async (page, { dispatch, getState, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel()
      })
      axios.defaults.withCredentials = true

      const response = await axios.get(
        `http://localhost:8080/paginated-vacations?page=${page}`,
        {
          cancelToken: source.token,
        }
      )

      const [vacationsData] = response.data

      const vacations = vacationsData.map((vacation) => {
        return {
          ...vacation,
          image: `data:image/jpeg;base64, ${Buffer.from(
            vacation.image.data
          ).toString('base64')}`,
        }
      })

      return vacations
    } catch (error) {
      throw Error(`${error.message} ${error.response.status}`)
    }
  }
)
export const fetchFollowedVacations = createAsyncThunk(
  'vacations/fetchFollowedVacations',
  async (username, { dispatch, getState, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel()
      })
      axios.defaults.withCredentials = true

      const response = await axios.get(
        `http://localhost:8080/followed-vacations?username=${username}`,
        {
          cancelToken: source.token,
        }
      )
      const vacations = response.data.map((vacation) => {
        return {
          ...vacation,
          image: `data:image/jpeg;base64, ${Buffer.from(
            vacation.image.data
          ).toString('base64')}`,
        }
      })

      return vacations
    } catch (error) {
      throw Error(`${error.message} ${error.response.status}`)
    }
  }
)
export const fetchAllFollowedVacations = createAsyncThunk(
  'vacations/fetchAllFollowedVacations',
  async (username, { dispatch, getState, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel()
      })
      axios.defaults.withCredentials = true

      const response = await axios.get(
        `http://localhost:8080/all-followed-vacations`,
        {
          cancelToken: source.token,
        }
      )

      return response.data
    } catch (error) {
      throw Error(`${error.message} ${error.response.status}`)
    }
  }
)

export const createVacation = createAsyncThunk(
  'vacations/createVacation',
  async (newVacation) => {
    try {
      axios.defaults.withCredentials = true

      const response = await axios.post(
        'http://localhost:8080/admin/add-vacation',
        newVacation,
        {
          'Content-Type': 'multipart/form-data',
        }
      )
      return response.data
    } catch (error) {
      throw Error(`${error.message} ${error.response.data.error}`)
    }
  }
)
export const updateVacation = createAsyncThunk(
  'vacations/updateVacation',
  async (params) => {
    try {
      const { formData, id } = params
      axios.defaults.withCredentials = true
      const response = await axios.patch(
        `http://localhost:8080/admin/edit-vacation?id=${id}`,
        formData,
        {
          'Content-Type': 'multipart/form-data',
        }
      )
      return response.data
    } catch (error) {
      throw Error(`${error.message} ${error.response.data.error}`)
    }
  }
)
export const followVacation = createAsyncThunk(
  'vacations/followVacation',
  async (vacationId) => {
    try {
      axios.defaults.withCredentials = true
      const response = await axios.post(
        `http://localhost:8080/follow/${vacationId}?action=follow`
      )

      const vacations = response.data.map((vacation) => {
        return {
          ...vacation,
          image: `data:image/jpeg;base64, ${Buffer.from(
            vacation.image.data
          ).toString('base64')}`,
        }
      })

      return vacations
    } catch (error) {
      throw Error(`${error.message} ${error.response.status}`)
    }
  }
)
export const unfollowVacation = createAsyncThunk(
  'vacations/unfollowVacation',
  async (id) => {
    try {
      axios.defaults.withCredentials = true
      const response = await axios.post(
        `http://localhost:8080/follow/${id}?action=unfollow`
      )

      const vacations = response.data.map((vacation) => {
        return {
          ...vacation,
          image: `data:image/jpeg;base64, ${Buffer.from(
            vacation.image.data
          ).toString('base64')}`,
        }
      })

      return vacations
    } catch (error) {
      throw Error(`${error.message} ${error.response.status}`)
    }
  }
)
export const deleteVacation = createAsyncThunk(
  'vacations/deleteVacation',
  async (vacationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/admin/${vacationId}`
      )
      return response.data
    } catch (error) {
      throw Error(`${error.message} ${error.response.status}`)
    }
  }
)

const vacationsSlice = createSlice({
  name: 'vacations',
  initialState: initialVacations,
  reducers: {
    reset: () => {
      return initialVacations
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVacations.pending, (state, action) => {
      state.deleted = false
      state.loading = true
      state.errors = ''
    })
    builder.addCase(fetchVacations.fulfilled, (state, action) => {
      state.loading = false
      state.vacations = [...state.vacations, ...action.payload]
      state.hasMore = action.payload.length > 0
      state.errors = ''
      state.page = ++state.page
    })
    builder.addCase(fetchVacations.rejected, (state, action) => {
      state.loading = false
      state.hasMore = false
      state.vacations = []
      state.errors = action.error.message
    })
    builder.addCase(fetchFollowedVacations.pending, (state, action) => {
      state.loading = true
      state.deleted = false
      state.page = 1
      state.vacations = []
      state.errors = ''
    })
    builder.addCase(fetchFollowedVacations.fulfilled, (state, action) => {
      state.loading = false
      state.vacations = action.payload
      state.errors = ''
    })
    builder.addCase(fetchFollowedVacations.rejected, (state, action) => {
      state.deleted = false
      state.loading = false
      state.vacations = []
      state.errors = action.error.message
    })
    builder.addCase(fetchAllFollowedVacations.pending, (state, action) => {
      state.loading = true
      state.deleted = false
      state.page = 1
      state.vacations = []
      state.errors = ''
    })
    builder.addCase(fetchAllFollowedVacations.fulfilled, (state, action) => {
      state.loading = false
      state.vacations = action.payload
      state.errors = ''
    })
    builder.addCase(fetchAllFollowedVacations.rejected, (state, action) => {
      state.loading = true
      state.vacations = []
      state.errors = action.error.message
    })
    builder.addCase(createVacation.fulfilled, (state, action) => {
      state.deleted = false
      state.newVacation = true
      state.vacations = []
      state.errors = ''
    })
    builder.addCase(createVacation.rejected, (state, action) => {
      state.vacations = []
      state.errors = action.error.message
    })
    builder.addCase(updateVacation.pending, (state, action) => {
      state.deleted = false
      state.updateStatus = false
      state.vacations = []
      state.errors = ''
    })
    builder.addCase(updateVacation.fulfilled, (state, action) => {
      state.deleted = false
      state.updateStatus = true
      state.vacations = []
      state.errors = ''
    })
    builder.addCase(updateVacation.rejected, (state, action) => {
      state.vacations = []
      state.updateStatus = false
      state.errors = action.error.message
    })
    builder.addCase(followVacation.fulfilled, (state, action) => {
      state.deleted = false
      const updatedVacations = [
        ...state.vacations.filter((vacation) =>
          vacation.id === action.payload[0].id
            ? (vacation.users = [...action.payload[0].users])
            : vacation
        ),
      ]
      state.vacations = updatedVacations
      state.followStatus = !state.followStatus
      state.errors = ''
    })
    builder.addCase(followVacation.rejected, (state, action) => {
      state.vacations = []
      state.errors = action.error.message
    })
    builder.addCase(unfollowVacation.fulfilled, (state, action) => {
      state.deleted = false
      state.vacations = [
        ...state.vacations.map((vacation) =>
          vacation.id === action.payload[0].id ? action.payload[0] : vacation
        ),
      ]
      state.followStatus = !state.followStatus
      state.errors = ''
    })
    builder.addCase(unfollowVacation.rejected, (state, action) => {
      state.vacations = []
      state.errors = action.error.message
    })
    builder.addCase(deleteVacation.pending, (state, action) => {
      state.deleted = false
      state.errors = ''
    })
    builder.addCase(deleteVacation.fulfilled, (state, action) => {
      state.deleted = true
      state.vacations = state.vacations.filter(
        (vacation) => vacation.id !== action.payload
      )
      state.errors = ''
    })
    builder.addCase(deleteVacation.rejected, (state, action) => {
      state.deleted = false
      state.vacations = []
      state.errors = action.error.message
    })
  },
})

export const vacationsReducer = vacationsSlice.reducer
export const vacationsActions = vacationsSlice.actions
