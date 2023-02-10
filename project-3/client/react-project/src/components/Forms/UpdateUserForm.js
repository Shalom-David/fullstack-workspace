import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, userUpdate } from '../../redux/features/userSlice.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'
import { Navigate } from 'react-router-dom'
import { vacationsActions } from '../../redux/features/vacationsSlice.js'

const schema = yup.object().shape(
  {
    firstName: yup
      .string()
      .notRequired()
      .when('firstName', {
        is: (value) => value?.length,
        then: (rule) => rule.min(3).max(25),
      }),
    lastName: yup
      .string()
      .notRequired()
      .when('lastNAme', {
        is: (value) => value?.length,
        then: (rule) => rule.min(3).max(25),
      }),
    username: yup
      .string()
      .nullable()
      .notRequired()
      .when('username', {
        is: (value) => value?.length,
        then: (rule) =>
          rule
            .min(3)
            .max(18)
            .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid Character'),
      }),
    password: yup
      .string()
      .nullable()
      .notRequired()
      .when('password', {
        is: (value) => value?.length,
        then: (rule) =>
          rule
            .min(3)
            .max(18)
            .test('isValidPass', 'invalid password', (value, context) => {
              const hasUpperCase = /[A-Z]/.test(value)
              const hasLowerCase = /[a-z]/.test(value)
              const hasNumber = /[0-9]/.test(value)
              let validConditions = 0
              const numberOfMustBeValidConditions = 3
              const conditions = [hasLowerCase, hasUpperCase, hasNumber]
              conditions.forEach((condition) =>
                condition ? validConditions++ : null
              )
              if (validConditions < numberOfMustBeValidConditions) {
                return false
              }
              return true
            }),
      }),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
  },
  [
    ['username', 'username'],
    ['password', 'password'],
    ['firstName', 'firstName'],
    ['lastName', 'lastName'],
  ]
)

function UpdateUserForm() {
  const dispatch = useDispatch()
  const userDetail = useSelector((state) => state.login.userDetail)
  const loginState = useSelector((state) => state.login)
  const [firstNameDisabled, setFirstNameDisabled] = useState(true)
  const [lastNameDisabled, setLastNameDisabled] = useState(true)
  const [userNameDisabled, setUsernameDisabled] = useState(true)
  const [passwordDisabled, setPasswordDisabled] = useState(true)
  const [updateState, setUpdateState] = useState(false)
  const { reset } = vacationsActions
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const submitForm = async (data) => {
    setFirstNameDisabled(true)
    setLastNameDisabled(true)
    setUsernameDisabled(true)
    setPasswordDisabled(true)
    const updateAndLogout = () => {
      dispatch(userUpdate(updateData))
      setUpdateState(true)
      dispatch(logout())
    }
    const user = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          value !== '' && key !== 'confirmPassword' && value !== undefined
      )
    )
    if (!Object.keys(user).length) {
      return
    }
    const updateData = {
      username: userDetail.username,
      formData: user,
    }

    Object.entries(user).filter(([key, value]) => {
      if (key === 'username' || key === 'password') {
        updateAndLogout()
        return
      }
    })
    return dispatch(userUpdate(updateData))
  }
  useEffect(() => {
    return () => dispatch(reset())
  }, [reset])
  return (
    <div className="form-container">
      {loginState.userUpdateStatus && updateState && (
        <Navigate replace={true} to={'/login'} />
      )}
      {loginState.errors.includes('401') && (
        <Navigate replace={true} to={'/login'} />
      )}
      {userDetail.role !== '' && (
        <form onSubmit={handleSubmit(submitForm)}>
          <Card
            className="card-container bg-light  d-inline-block fw-bold my-5"
            key={userDetail.username}
          >
            <Card.Body>
              <Card.Title className="d-flex justify-content-between ">
                <Card.Text className="d-inline-block fs-3 text-danger text-start m-3"></Card.Text>
              </Card.Title>
              <Card.Title className="">
                <Card.Text className=" text-center mb-5">
                  First Name:
                  <input
                    className={
                      !firstNameDisabled
                        ? 'bg-white text-center'
                        : 'border-0 bg-light text-center'
                    }
                    disabled={firstNameDisabled}
                    name="firstName"
                    type="text"
                    defaultValue={userDetail.firstName}
                    {...register('firstName')}
                  />
                  <FaEdit
                    onClick={() => setFirstNameDisabled(!firstNameDisabled)}
                  />
                  <small>{errors.firstName?.message}</small>
                </Card.Text>
              </Card.Title>
              <Card.Title className="">
                <Card.Text className=" text-center mb-5">
                  Last Name:{' '}
                  <input
                    className={
                      !lastNameDisabled
                        ? 'bg-white text-center'
                        : 'border-0 bg-light text-center'
                    }
                    disabled={lastNameDisabled}
                    name="lastName"
                    type="text"
                    defaultValue={userDetail.lastName}
                    {...register('lastName')}
                  />
                  <FaEdit
                    onClick={() => {
                      setLastNameDisabled(!lastNameDisabled)
                    }}
                  />
                  <small>{errors.lastName?.message}</small>
                </Card.Text>
              </Card.Title>
              <Card.Title className="">
                <Card.Text className=" text-center mb-5">
                  Username:{' '}
                  <input
                    className={
                      !userNameDisabled
                        ? 'bg-white text-center'
                        : 'border-0 bg-light text-center'
                    }
                    disabled={userNameDisabled}
                    name="username"
                    type="text"
                    defaultValue={userDetail.username}
                    {...register('username')}
                  />
                  <FaEdit
                    onClick={() => {
                      setUsernameDisabled(!userNameDisabled)
                    }}
                  />
                  <small>{errors.username?.message}</small>
                  <small>
                    {loginState.errors.includes('in use') &&
                      'username already in use!'}
                  </small>
                </Card.Text>
              </Card.Title>
              <Card.Title className="">
                <Card.Text className=" text-center mb-5">
                  Change Password:{' '}
                  <input
                    className={
                      !passwordDisabled
                        ? 'bg-white text-center'
                        : 'border-0 bg-light text-center'
                    }
                    disabled={passwordDisabled}
                    type="password"
                    name="password"
                    placeholder="New password"
                    {...register('password')}
                  />
                  <FaEdit
                    onClick={() => {
                      setPasswordDisabled(!passwordDisabled)
                    }}
                  />
                  <small>{errors.password?.message}</small>
                </Card.Text>
              </Card.Title>
              <Card.Title className="">
                <Card.Text className=" text-center mb-5">
                  Confirm Password:{' '}
                  <input
                    className={
                      !passwordDisabled
                        ? 'bg-white text-center'
                        : 'border-0 bg-light text-center'
                    }
                    disabled={passwordDisabled}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    onBlurCapture={() => setPasswordDisabled(!passwordDisabled)}
                    {...register('confirmPassword')}
                  />
                  <small>
                    {errors.confirmPassword && 'passwords dont match'}
                  </small>
                  <small>
                    **Upon changing username or password login is required!
                  </small>
                </Card.Text>
              </Card.Title>
              <Card.Title className="">
                <Card.Text className="fs-2 text-center mb-5">
                  Role:{' '}
                  {userDetail.role === 'admin' ? (
                    <strong className="text-danger fs-2 text-decoration-underline fw-bold">
                      Admin
                    </strong>
                  ) : (
                    <strong className="text-primary fs-2 text-decoration-underline fw-bold">
                      User
                    </strong>
                  )}
                </Card.Text>
              </Card.Title>
              <button
                type="submit"
                className="me-4 btn btn-success btn-lg btn-block"
              >
                Submit
              </button>
            </Card.Body>
          </Card>
        </form>
      )}
    </div>
  )
}
export default UpdateUserForm
