import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Card, Button } from 'react-bootstrap'

function GetTeamMeetings() {
  const select = document.querySelector('#select')
  const [id, setId] = useState(0)
  const [teams, setTeams] = useState([])
  const [meetings, setMeetings] = useState([])
  const [errors, setErrors] = useState('')
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
    async function fetchMeetings() {
      try {
        const res = await axios.get(`http://localhost:8080/meetings/${id}`)
        setErrors('')
        setMeetings(res.data)
      } catch (error) {
        setErrors(error.message)
        setMeetings([])
        console.error(errors)
      }
    }
    fetchMeetings()
  }, [id])
  return (
    <div>
      <h2 className="h2">Select a Team</h2>
      <div className="d-flex justify-content-center">
        <select
          id="select"
          name="development teams"
          className="fw-bold mx-5 my-3 fs-5 text-center form-select w-25 "
        >
          {teams.map((team, index) => (
            <option key={index} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <Button className="m-2" onClick={() => setId(0)} variant="danger">
          reset
        </Button>
      </div>
      <Button
        className="my-3"
        variant="success"
        onClick={() => {
          setId(select.value)
        }}
      >
        Get Meeting Info
      </Button>
      <div>
        {meetings.map((meeting, index) => (
          <Card
            className="bg-light border-dark d-inline-block fw-bold"
            style={{
              width: '20vw',
              margin: '10px',
            }}
            key={index}
          >
            <Card.Body>
              <Card.Title className="border-dark border-bottom">
                Team: {select[select.value - 1].innerText}
              </Card.Title>
              <Card.Text className="border-dark border-bottom">
                Description: {meeting.description}
              </Card.Text>
              <Card.Text className="border-dark border-bottom">
                Meeting Starts:{' '}
                {meeting.start_time
                  .toString()
                  .split('T')
                  .splice(0)
                  .join(' ')
                  .replace(/.000Z$/, '')}
              </Card.Text>
              <Card.Text className="border-dark border-bottom">
                Meeting Ends:{' '}
                {meeting.end_time
                  .toString()
                  .split('T')
                  .splice(0)
                  .join(' ')
                  .replace(/.000Z$/, '')}
              </Card.Text>
              <Card.Text>Room: {meeting.room}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default GetTeamMeetings
