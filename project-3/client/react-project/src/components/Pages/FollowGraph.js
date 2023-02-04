import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bar } from 'react-chartjs-2'
import { chart as chartjs } from 'chart.js/auto' //for some reason has to be added for it to work but it is not used.
import {
  fetchAllFollowedVacations,
  vacationsActions,
} from '../../redux/features/vacationsSlice'
import { Navigate } from 'react-router-dom'
import { loginActions } from '../../redux/features/userSlice'

function FollowGraph() {
  const dispatch = useDispatch()
  const vacationErrors = useSelector((state) => state.vacations.errors)
  const { reset: resetVacations } = vacationsActions
  const { reset: resetLogin } = loginActions
  useEffect(() => {
    dispatch(fetchAllFollowedVacations())

    return () => dispatch(resetVacations())
  }, [dispatch, resetVacations])
  const vacations = useSelector((state) => state.vacations.vacations)
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
    <div className="graph mt-5">
      {vacationErrors.includes('401') && <Navigate replace to="/login" />}
      {vacationErrors.includes('403') && <Navigate replace to="/login" />}
      <Bar
        data={{
          labels: vacations.map((vacation) => vacation.destination),
          datasets: [
            {
              label: 'Followers',
              data: vacations.map((vacation) => vacation.users.length),
              backgroundColor: ['#3F77BC'],
              borderColor: 'black',
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 24,
                },
              },
            },
          },
        }}
      />
    </div>
  )
}

export default FollowGraph
