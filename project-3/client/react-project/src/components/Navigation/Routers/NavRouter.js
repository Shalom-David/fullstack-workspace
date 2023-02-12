import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AddVacation } from '../../Pages/AddVacation'
import VacationsPage from '../../Pages/VacationsPage'
import FollowedVacations from '../../Pages/FollowedVacationsPage'
import { MainNavBar } from '../Layouts/MainNavBar'
import FollowGraph from '../../Pages/FollowGraph'
import UpdateUserForm from '../../Forms/UpdateUserForm'
import LoginForm from '../../Forms/LoginForm'
import { UpdateVacation } from '../../Pages/UpdateVacation'
import RegistrationForm from '../../Forms/RegistrationForm'


export function NavRouter() {
  const credentials = useSelector((state) => state.login.userDetail)
  return (
    <>
      <MainNavBar />
      <Routes>
        <Route path="add-vacation" element={<AddVacation />} />
        <Route path="vacations" element={<VacationsPage />} />
        <Route path="my-vacations" element={<FollowedVacations />} />
        <Route path="edit-profile" element={<UpdateUserForm />} />
        <Route path="edit-vacation" element={<UpdateVacation />} />
        <Route path="analytics" element={<FollowGraph />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route
          path="*"
          element={
            credentials.username && credentials.role ? (
              <VacationsPage />
            ) : (
              <LoginForm />
            )
          }
        />
      </Routes>
    </>
  )
}
