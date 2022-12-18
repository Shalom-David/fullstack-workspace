import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Card, Button } from 'react-bootstrap'

function GetTeamMeetings() {
  const select = document.querySelector('#select')
  const [id, setId] = useState()
  const [teams, setTeams] = useState([])
  const [meetings, setMeetings] = useState([])
  const [reset, setReset] = useState(true)
  const firstUpdate = useRef(true)

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await axios.get('http://localhost:8080/teams')
        setTeams(res.data)
      } catch (error) {
        console.error(error.message)
        setTeams([])
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    async function fetchMeetings() {
      if (firstUpdate.current) {
        firstUpdate.current = false
        return
      }
      try {
        const res = await axios.get(`http://localhost:8080/meetings/${id}`)

        setMeetings(res.data)
      } catch (error) {
        console.error(error.message)
        setMeetings([])
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
        <Button
          className="m-2"
          onClick={() => {
            setReset(false)
          }}
          type="submit"
          variant="danger"
        >
          Reset
        </Button>
      </div>
      <Button
        className="my-3"
        variant="success"
        onClick={() => {
          setId(select.value)
          setReset(true)
        }}
        type="submit"
      >
        Get Meeting Info
      </Button>
      {reset && (
        <div id="cardDiv">
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
                  <Card.Text className="text-success text-decoration-underline">
                    Team:
                  </Card.Text>
                  {select[select.value - 1].innerText}
                </Card.Title>
                <Card.Title className="border-dark border-bottom">
                  <Card.Text className="text-success text-decoration-underline">
                    Description:
                  </Card.Text>
                  {meeting.description}
                </Card.Title>
                <Card.Title className="border-dark border-bottom">
                  <Card.Text className="text-success text-decoration-underline">
                    Meeting Starts:
                  </Card.Text>
                  {new Date(meeting.start_time).toLocaleString()}
                </Card.Title>
                <Card.Title className="border-dark border-bottom">
                  <Card.Text className="text-success text-decoration-underline ">
                    Meeting Ends:
                  </Card.Text>
                  {new Date(meeting.end_time).toLocaleString()}
                </Card.Title>
                <Card.Title>
                  <Card.Text className="text-success text-decoration-underline">
                    Meeting Duration:
                  </Card.Text>
                  {meeting.duration}
                </Card.Title>
                <Card.Title>
                  <Card.Text className="text-success text-decoration-underline">
                    Room:
                  </Card.Text>
                  {meeting.room}
                </Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default GetTeamMeetings
