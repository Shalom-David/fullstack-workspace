import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/features/userSlice.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Navigate } from 'react-router-dom'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
})

function LoginForm() {
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    if (loginState.loginStatus.message?.includes('login Successful'))
      setIsLogin(true)

    return () => setIsLogin(false)
  }, [loginState.loginStatus.message, setIsLogin])

  return (
    <div>
      {isLogin && loginState.userDetail.role && (
        <Navigate replace to="/vacations" />
      )}
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center ">Login</h2>
                  <p className=" mb-5">
                    Please enter your username and password!
                  </p>
                  <div className="mb-3">
                    <form
                      onSubmit={handleSubmit((data) => {
                        dispatch(login(data))
                      })}
                    >
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
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Login
                        </Button>
                      </div>
                    </form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Don't have an account?{' '}
                        <a href="/register" className="text-primary fw-bold">
                          Sign Up
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

export default LoginForm
