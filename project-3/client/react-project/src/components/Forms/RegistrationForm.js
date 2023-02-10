import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginActions, userRegister } from '../../redux/features/userSlice.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Navigate } from 'react-router-dom'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'

const schema = yup.object().shape({
  firstName: yup.string().min(3).max(25).required(),
  lastName: yup.string().min(3).max(25).required(),
  username: yup
    .string()
    .min(3)
    .max(18)
    .required()
    .test('value', 'invalid character', (value) =>
      /^[a-zA-Z0-9_-]+$/.test(value)
    ),
  password: yup
    .string()
    .min(8)
    .max(16)
    .required()
    .test('isValidPass', 'invalid password', (value, context) => {
      const hasUpperCase = /[A-Z]/.test(value)
      const hasLowerCase = /[a-z]/.test(value)
      const hasNumber = /[0-9]/.test(value)
      let validConditions = 0
      const numberOfMustBeValidConditions = 3
      const conditions = [hasLowerCase, hasUpperCase, hasNumber]
      conditions.forEach((condition) => (condition ? validConditions++ : null))
      if (validConditions < numberOfMustBeValidConditions) {
        return false
      }
      return true
    }),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
})

function RegistrationForm() {
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const [registered, setRegistered] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const submitForm = async (data) => {
    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      password: data.password,
    }
    dispatch(userRegister(user))
  }
  useEffect(() => {
    if (loginState.loginStatus.message === 'registeration successful')
      setRegistered(true)

    return () => {
      setRegistered(true)
    }
  }, [loginState.loginStatus.message, setRegistered, dispatch])
  return (
    <div>
      {registered && <Navigate replace to="/login" />}
      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="px-4">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center">Register</h2>
                  <div className="mb-3">
                    <form onSubmit={handleSubmit(submitForm)}>
                      <Form.Group className="mb-3" controlId="Name">
                        <Form.Label className="text-center">
                          First Name
                        </Form.Label>
                        <Form.Control
                          name="firstName"
                          type="text"
                          placeholder="First Name"
                          {...register('firstName')}
                        />
                        <small>{errors.firstName?.message}</small>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="Name">
                        <Form.Label className="text-center">
                          Last Name
                        </Form.Label>
                        <Form.Control
                          name="lastName"
                          type="text"
                          placeholder="Last Name"
                          {...register('lastName')}
                        />
                        <small>{errors.lastName?.message}</small>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Username
                        </Form.Label>
                        <Form.Control
                          name="username"
                          type="text"
                          placeholder="Username"
                          {...register('username')}
                        />
                        <small>{errors.username?.message}</small>
                        <small>
                          {loginState.errors.includes('in use') &&
                            loginState.errors}
                        </small>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          {...register('password')}
                        />
                        <small>{errors.password?.message}</small>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="confirm Password"
                          {...register('confirmPassword')}
                        />
                        <small>
                          {errors.confirmPassword && 'passwords dont match'}
                        </small>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Create Account
                        </Button>
                      </div>
                    </form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Already have an account?{' '}
                        <a href="/login" className="text-primary fw-bold">
                          Login
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default RegistrationForm
