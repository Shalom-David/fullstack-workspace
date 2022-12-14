import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react'
import axios from 'axios'
import { Button, Form, Container, Row, Col } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker'
import useToggle from './Toggler'

function PostMeeting() {
  const [toggle, setToggle] = useToggle()
  const [dateTimeStartValue, setDateTimeStart] = useState(new Date())
  const [dateTimeEndValue, setDateTimeEnd] = useState(new Date())
  const [team, setTeam] = useState()
  const [teams, setTeams] = useState([])
  const [room, setRoom] = useState()
  const [description, setDescription] = useState()
  const [errors, setErrors] = useState('')
  const [meetingData, setMeetingData] = useState({})

  const firstUpdate = useRef(true)

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await axios.get('http://localhost:8080/teams')
        setErrors('')
        setTeams(res.data)
      } catch (error) {
        setErrors(error.message)
        setTeams([])
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    async function postMeeting() {
      try {
        const res = await axios.post(
          'http://localhost:8080/meetings',
          meetingData
        )
        alert(res.data)
        setErrors('')
      } catch (error) {
        setErrors(error.message)
        setTeams([])
        console.error(errors)
      }
    }
    postMeeting()
  }, [meetingData])

  const getData = () => {
    const dataObj = {
      team_name: team,
      start_time: `${dateTimeStartValue.toISOString().split('T')[0]} ${
        dateTimeStartValue.toString().split(' ')[4]
      }`,
      end_time: `${dateTimeEndValue.toISOString().split('T')[0]} ${
        dateTimeEndValue.toString().split(' ')[4]
      }`,
      description: description,
      room: room,
    }
    setMeetingData(dataObj)
  }
  return (
    <div>
      <Button variant="warning" onClick={setToggle}>
        Create a New Meeting
      </Button>
      {toggle && (
        <Container className="mt-5 offset-md-5 ">
          <Row>
            <Col xs={3}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Team</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setTeam(e.target[e.target.selectedIndex].text)
                    }
                    id="selectOption"
                  >
                    <option className="d-none" value={null}>
                      Select a Team
                    </option>
                    {teams.map((team, index) => (
                      <option key={index} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Meeting Start Time</Form.Label>
                  <DateTimePicker
                    required
                    onChange={setDateTimeStart}
                    value={dateTimeStartValue}
                    format="yyyy-MM-dd HH:mm"
                    step={60}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Meeting End Time</Form.Label>
                  <DateTimePicker
                    required
                    onChange={setDateTimeEnd}
                    value={dateTimeEndValue}
                    format="yyyy-MM-dd HH:mm"
                    step={60}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Meeting Description</Form.Label>
                  <Form.Control
                    id="textarea"
                    onChange={() =>
                      setDescription(document.querySelector('#textarea').value)
                    }
                    required
                    as="textarea"
                    rows={3}
                  ></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Room</Form.Label>
                  <Form.Control
                    required
                    id="room"
                    onChange={() =>
                      setRoom(document.querySelector('#room').value)
                    }
                    type="text"
                  ></Form.Control>
                </Form.Group>
                <Button
                  onClick={() => {
                    getData()
                  }}
                  type="submit"
                  variant="primary"
                >
                  Create Meeting
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

export default PostMeeting
