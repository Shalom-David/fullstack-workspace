import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import GetTeamMeetings from './components/GetTeamMeetings'
import PostMeeting from './components/PostMeeting'

function App() {
  return (
    <div className="App">
      <GetTeamMeetings />
      <PostMeeting />
    </div>
  )
}

export default App
