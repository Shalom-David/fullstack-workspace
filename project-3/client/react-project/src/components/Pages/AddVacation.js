import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createVacation,
  vacationsActions,
} from '../../redux/features/vacationsSlice.js'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { Navigate } from 'react-router-dom'
import { VacationForm } from '../Forms/VacationForm.js'

const schema = yup.object().shape({
  description: yup.string().max(150).required(),
  destination: yup.string().max(20).required(),
  startDate: yup.date().required(),
  endDate: yup
    .date()
    .required()
    .min(yup.ref('startDate'), 'End date should be after start date'),
  currency: yup.number().positive().integer().required(),
  price: yup.number().positive().integer().required('price is required'),
  image: yup
    .mixed()
    .required('file is required')
    .test('type', (value) => {
      if (!value.length) {
        return 'file is required '
      }
      if (value && /jpeg|jpg|png|gif|svg/.test(value[0].type.split('/')[1])) {
        return 'you can only upload images'
      }
    }),
})

export function AddVacation() {
  const vacationErrors = useSelector((state) => state.vacations.errors)
  const newVacation = useSelector((state) => state.vacations.newVacation)
  const userRole = useSelector((state) => state.login.userDetail.role)
  const dispatch = useDispatch()
  const { reset } = vacationsActions

  const submitForm = async (data) => {
    const formData = new FormData()
    formData.append('description', data.description)
    formData.append('destination', data.destination)
    formData.append('startDate', dayjs(data.startDate).format('YYYY-MM-DD'))
    formData.append('endDate', dayjs(data.startDate).format('YYYY-MM-DD'))
    formData.append('currency', data.currency)
    formData.append('price', data.price)
    formData.append('image', data.image[0])
    dispatch(createVacation(formData))
  }
  useEffect(() => {
    return () => dispatch(reset())
  }, [dispatch, reset])
  return (
    <div className="form-container ">
      {vacationErrors.includes('401') && <Navigate replace to="/login" />}
      {vacationErrors.includes('403') && <Navigate replace to="/login" />}
      {newVacation && <Navigate replace to="/login" />}

      {userRole === 'admin' && (
        <VacationForm submitForm={submitForm} validationSchema={schema} />
      )}
    </div>
  )
}
