import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteVacation,
  fetchVacations,
  followVacation,
  unfollowVacation,
  vacationsActions,
} from '../../redux/features/vacationsSlice'
import { FaEdit, FaHeart, FaHeartBroken, FaTrash } from 'react-icons/fa'
import { Card } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import LoadSpinner from '../LoadingSpinner/LoadingSpinner'
import { loginActions } from '../../redux/features/userSlice'

function VacationsPage() {
  const dispatch = useDispatch()
  const {
    vacations,
    errors: vacationErrors,
    loading,
    hasMore,
    deleted,
  } = useSelector((state) => state.vacations)
  const { reset: resetVacationsState } = vacationsActions
  const { reset: resetLoginState } = loginActions
  const page = useSelector((state) => state.vacations.page)
  const userDetail = useSelector((state) => state.login.userDetail)
  const [pageTurn, setPageTurn] = useState(false)
  useEffect(() => {
    if (deleted) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      dispatch(resetVacationsState())
    }
    const newPage = deleted ? 1 : page
    const fetchVacationsAction = dispatch(fetchVacations(newPage))
    return () => fetchVacationsAction.abort()
  }, [pageTurn, deleted]) //excluding 'page' dependency to avoid infinite recursion

  useEffect(() => {
    if (vacationErrors.includes('401') || vacationErrors.includes('403')) {
      dispatch(resetLoginState())
    }
    return () => dispatch(resetVacationsState())
  }, [vacationErrors, resetVacationsState])
  const observer = useRef()
  const lastCard = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageTurn(() => !pageTurn)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore, pageTurn]
  )
  return (
    <div className="text-center">
      {vacationErrors.includes('401') && <Navigate replace to="/login" />}
      {vacationErrors.includes('403') && <Navigate replace to="/login" />}
      {vacations.map((vacation, index) => (
        <Card
          ref={vacations.length === index + 1 ? lastCard : null}
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
              <Card.Text className=" text-center mb-4 description">
                {vacation.description}
              </Card.Text>
            </Card.Title>
            <Card.Title className="border-dark">
              <Card.Text className="text-center mb-4">
                Start Date: {new Date(vacation.startDate).toLocaleDateString()}
              </Card.Text>
            </Card.Title>
            <Card.Title className="border-dark">
              <Card.Text className="text-center mb-4">
                End Date: {new Date(vacation.endDate).toLocaleDateString()}
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
            <Card.Title
              className={
                userDetail.role === 'admin'
                  ? 'd-flex justify-content-between'
                  : 'd-flex justify-content-center'
              }
            >
              <Card.Text className="d-inline-block fs-3 text-danger text-start mt-2">
                {vacation.users?.some(
                  (user) => user.username === userDetail.username
                ) ? (
                  <FaHeartBroken
                    key="FaHeartBroken"
                    title="Unfollow"
                    className="fs-1  cursor me-3"
                    onClick={() => {
                      dispatch(unfollowVacation(vacation.id))
                    }}
                  />
                ) : (
                  <FaHeart
                    title="Follow"
                    className="fs-1 me-2 cursor"
                    onClick={() => {
                      dispatch(followVacation(vacation.id))
                    }}
                  />
                )}

                {vacation.users ? vacation.users.length : 0}
              </Card.Text>
              {userDetail.role === 'admin' && (
                <>
                  <Card.Text className="d-inline-block fs-3 text-start mt-2 cursor">
                    <Link
                      className="text-dark"
                      title="Edit"
                      to={{
                        pathname: '/edit-vacation',
                      }}
                      state={{ vacation: vacation }}
                    >
                      <FaEdit />
                    </Link>
                  </Card.Text>
                  <Card.Text className="d-inline-block fs-3 text-start mt-2 cursor">
                    <FaTrash
                      title="Delete"
                      onClick={() => {
                        dispatch(deleteVacation(vacation.id))
                      }}
                    />
                  </Card.Text>
                </>
              )}
            </Card.Title>
          </Card.Body>
        </Card>
      ))}
      {loading && (
        <div id="centerLoading">
          <LoadSpinner />
        </div>
      )}
    </div>
  )
}

export default VacationsPage
