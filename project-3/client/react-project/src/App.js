import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom'
import { NavRouter } from './components/Navigation/Routers/NavRouter'
import Footer from './components/Footer/Footer'
import { useEffect } from 'react'
import { getUserProfile } from './redux/features/userSlice'
import LoginForm from './components/Forms/LoginForm'

function App() {
  const dispatch = useDispatch()
  const userDetail = useSelector((state) => state.login.userDetail)
  window.addEventListener('unload', () => {
    localStorage.setItem('user', JSON.stringify(userDetail.username, null, 2))
  })
  useEffect(() => {
    const username = JSON.parse(localStorage.getItem('user'))
    if (username !== '' && username !== null) {
      dispatch(getUserProfile(username))
    }
    if (userDetail.username !== null && userDetail.username !== '') {
      dispatch(getUserProfile(userDetail.username))
    }
    return localStorage.removeItem('user')
  }, [])
  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<NavRouter />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
