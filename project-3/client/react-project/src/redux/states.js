export const initialVacations = {
  vacations: [],
  errors: '',
  followStatus: false,
  loading: false,
  hasMore: true,
  page: 1,
  deleted: false,
  newVacation: false,
  updateStatus: false,
}

export const initialUser = {
  loginStatus: 'not logged in',
  errors: '',
  userDetail: {
    role: '',
    username: '',
    firstName: '',
    lastName: '',
    followedVacations: [],
  },
  userUpdateStatus: false,
}
