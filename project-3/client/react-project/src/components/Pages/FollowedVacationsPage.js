import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchFollowedVacations,
  unfollowVacation,
} from '../../redux/features/vacationsSlice'
import { vacationsActions } from '../../redux/features/vacationsSlice.js'
import { Card } from 'react-bootstrap'
import { loginActions } from '../../redux/features/userSlice'
import { FaHeartBroken } from 'react-icons/fa'
import { Navigate } from 'react-router-dom'
import LoadSpinner from '../LoadingSpinner/LoadingSpinner'
function FollowedVacations() {
  const dispatch = useDispatch()

  const {
    vacations,
    errors: vacationErrors,
    loading,
  } = useSelector((state) => state.vacations)
  const userDetail = useSelector((state) => state.login.userDetail)
  const { reset: resetVacations } = vacationsActions
  const { reset: resetLogin } = loginActions
  useEffect(() => {
    if (userDetail.username !== '')
      dispatch(fetchFollowedVacations(userDetail.username))

    return () => dispatch(resetVacations())
  }, [dispatch, userDetail.username])
  useEffect(() => {
    if (
      vacationErrors.includes('401') ||
      vacationErrors.includes('403') ||
      vacationErrors === 'Aborted'
    ) {
      dispatch(resetLogin())
    }
  }, [vacationErrors])

  return (
    <div className="text-center">
      {vacationErrors.includes('401') && <Navigate replace to="/login" />}
      {vacationErrors.includes('403') && <Navigate replace to="/login" />}
      {userDetail.role !== '' && vacations.length
        ? vacations.map(
            (vacation) =>
              vacation.users?.some(
                (user) => user.username === userDetail.username
              ) && (
                <Card
                  className="vacation-card-container bg-light d-inline-block fw-bold my-5"
                  key={vacation.id}
                >
                  <Card.Body className="vacation-card-div">
                    <Card.Title className="border-dark">
                      <Card.Text className="fs-2 fw-bold  text-center mb-5">
                        {vacation.destination}
                      </Card.Text>
                    </Card.Title>
                    <Card.Title className="border-dark">
                      <Card.Text className="text-center mb-4 description">
                        {vacation.description}
                      </Card.Text>
                    </Card.Title>
                    <Card.Title className="border-dark">
                      <Card.Text className="text-center mb-4">
                        Start Date:
                        {new Date(vacation.startDate).toLocaleDateString()}
                      </Card.Text>
                    </Card.Title>
                    <Card.Title className="border-dark">
                      <Card.Text className="text-center mb-4">
                        End Date:
                        {new Date(vacation.endDate).toLocaleDateString()}
                      </Card.Text>
                    </Card.Title>
                    <Card.Title>
                      <Card.Text className="text-center mb-4">
                        Price: {vacation.price} {vacation.currency}
                      </Card.Text>
                    </Card.Title>
                    <Card.Title>
                      <Card.Img
                        variant="bottom"
                        src={vacation.image}
                        alt={vacation.destination}
                      />
                    </Card.Title>
                    <Card.Title className="d-flex justify-content-center ">
                      <Card.Text className="d-inline-block fs-3 text-danger text-start mt-2">
                        <FaHeartBroken
                          key="FaHeartBroken"
                          title="Unfollow"
                          className="fs-1  cursor me-3"
                          onClick={(e) => {
                            e.target.parentElement.parentElement.remove()
                            dispatch(unfollowVacation(vacation.id))
                          }}
                        />

                        {vacation.users ? vacation.users.length : 0}
                      </Card.Text>
                    </Card.Title>
                  </Card.Body>
                </Card>
              )
          )
        : loading && (
            <div id="centerLoading">
              <LoadSpinner />
            </div>
          )}
    </div>
  )
}

export default FollowedVacations
