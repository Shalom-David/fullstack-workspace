import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateVacation } from '../../redux/features/vacationsSlice.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { Navigate, useLocation } from 'react-router-dom'
import { VacationForm } from '../Forms/VacationForm'
const schema = yup.object().shape({
  description: yup.string().max(150),
  destination: yup.string().max(20),
  startDate: yup.date(),
  endDate: yup
    .date()

    .min(yup.ref('startDate'), 'End date should be after start date'),
  currency: yup.number().positive().integer(),
  price: yup.number().positive().integer(),
  image: yup.mixed().test('type', (value) => {
    if (!value.length) {
      return 'file is required '
    }
    if (value && /jpeg|jpg|png|gif|svg/.test(value[0].type.split('/')[1])) {
      return 'you can only upload images'
    }
  }),
})

export function UpdateVacation() {
  const vacationErrors = useSelector((state) => state.vacations.errors)
  const updateStatus = useSelector((state) => state.vacations.updateStatus)
  const userRole = useSelector((state) => state.login.userDetail.role)
  const dispatch = useDispatch()

  const location = useLocation()

  const { vacation } = location.state
  const submitForm = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'image') {
          if (value[0]) {
            return formData.append(key, value[0])
          } else {
            return
          }
        }
        if (key === 'endDate' || key === 'startDate') {
          return formData.append(key, dayjs(value).format('YYYY-MM-DD'))
        }
        formData.append(key, value)
      }
    })
    formData.append('imgName', vacation.imgName)
    dispatch(updateVacation({ formData, id: vacation.id }))
  }
  const options = {
    1: '$',
    2: '€',
    3: '₪',
  }
  let currency
  return (
    <>
      <div className="form-container">
        {vacationErrors.includes('401') && <Navigate replace to="/login" />}
        {vacationErrors.includes('403') && <Navigate replace to="/login" />}
        {updateStatus && <Navigate replace to="/vacations" />}
      </div>
      {userRole === 'admin' && (
        <VacationForm
          submitForm={submitForm}
          validationSchema={schema}
          vacationData={vacation}
          selectOptions={options}
        />
      )}
    </>
  )
}
