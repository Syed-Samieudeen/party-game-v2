import { Routes, Route } from 'react-router-dom'

import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'
import Lobby from './pages/Lobby'
import Vote from './pages/Vote'
import Results from './pages/Results'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateRoom />} />

      <Route path="/join" element={<JoinRoom />} />

      <Route path="/room/:code" element={<Lobby />} />

      <Route path="/vote/:code/:playerId" element={<Vote />} />

      <Route path="/results/:code" element={<Results />} />
    </Routes>
  )
}
