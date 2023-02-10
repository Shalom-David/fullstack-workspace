import { useEffect, useState } from 'react'
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineLogout } from 'react-icons/ai'
import { SiGoogleanalytics } from 'react-icons/si'
import { BsPersonCircle, BsCardChecklist, BsCardList } from 'react-icons/bs'
import { MdPostAdd } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from '../../../libs/Travelays-Logo.png'
import { logout } from '../../../redux/features/userSlice'

export function MainNavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const credentials = useSelector((state) => state.login.userDetail)

  const navBarClose = (e) => {
    if (
      !e.target.closest('.nav-toggle-btn') ||
      !e.target.closest('.navbar-toggler-icon')
    ) {
      if (!e.target.closest('.dropdown-toggle')) {
        setIsOpen(false)
      }
    }
  }
  useEffect(() => {
    document.addEventListener('click', (e) => {
      navBarClose(e)
    })
    return () => {
      document.removeEventListener('click', (e) => navBarClose(e))
    }
  }, [setIsOpen])

  return (
    <>
      <Navbar className="p-4" collapseOnSelect expand="lg" expanded={isOpen}>
        <Navbar.Brand className="text-end">
          <Link to="/vacations">
            <img className="logoImg" src={logo} alt="travelays-logo" />
          </Link>
        </Navbar.Brand>
        {credentials.username ? (
          <>
            <Navbar.Toggle
              className="nav-toggle-btn"
              aria-controls="responsive-navbar-nav"
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            />
            <Navbar.Collapse
              className="justify-content-end me-5"
              id="responsive-navbar-nav"
            >
              <Nav>
                {credentials.role === 'admin' && (
                  <>
                    <Nav.Link className="p-0" as={Link} to="/add-vacation">
                      <Button
                        className="fs-5 fw-bold border border-0"
                        variant="outline-primary"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <MdPostAdd className="fs-4 text-dark" /> Add Vacation
                      </Button>
                    </Nav.Link>
                    <Nav.Link className="p-0" as={Link} to="/analytics">
                      <Button
                        className="fs-5 fw-bold border border-0"
                        variant="outline-primary"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <SiGoogleanalytics className="text-dark" /> Analytics
                      </Button>
                    </Nav.Link>
                  </>
                )}
                <Nav.Link className="p-0" as={Link} to="/vacations">
                  <Button
                    className="fs-5 fw-bold border border-0"
                    variant="outline-primary"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <BsCardList className="text-dark" />
                    Vacations
                  </Button>
                </Nav.Link>
                <Nav.Link
                  className="p-0"
                  as={Link}
                  to="/my-vacations"
                ></Nav.Link>
                <NavDropdown
                  className="fw-bold fs-5 text-center nav-dropdown"
                  title={
                    <span>
                      <BsPersonCircle /> {credentials.username}
                    </span>
                  }
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/edit-profile">
                    <Button
                      className="fs-6 fw-bold border border-0 drop-btn"
                      variant="outline-primary"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <FaUserEdit className="text-dark" /> Edit Profile
                    </Button>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-vacations">
                    <Button
                      className="fs-6 fw-bold border border-0 drop-btn"
                      variant="outline-primary"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <BsCardChecklist className="text-dark" /> My Vacations
                    </Button>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/login">
                    <Button
                      className="fs-6 fw-bold border border-0 drop-btn"
                      variant="outline-primary"
                      onClick={() => {
                        dispatch(logout())
                      }}
                    >
                      <AiOutlineLogout className="text-danger" /> Logout
                    </Button>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : null}
      </Navbar>
    </>
  )
}
