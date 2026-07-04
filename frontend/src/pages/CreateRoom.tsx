import { useState } from 'react'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function CreateRoom() {
  const nav = useNavigate()

  const [name, setName] = useState('')

  async function create() {
    if (!name.trim()) {
      alert('Enter a host name')
      return
    }

    const res = await api.post('/rooms', {
      hostName: name,
    })

    nav(`/room/${res.data.code}`)
  }

  return (
    <div className="page">
      <div
        className="card"
        style={{
          width: 430,
        }}
      >
        <h1 className="title">
          Da Scuba GnG VOTEs
        </h1>

        <p className="subtitle">
          Create a room and expose your friends.
        </p>

        <div
          style={{
            textAlign: 'center',
            marginBottom: 25,
          }}
        >
          <img
            src="/scuba.gif"
            alt="cat"
            style={{
              width: 220,
              borderRadius: 18,
            }}
          />
        </div>

        <input
          placeholder="Host Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ height: 18 }} />

        <button
          onClick={create}
          style={{ width: '100%' }}
        >
          Create Room
        </button>

        <div style={{ height: 12 }} />

        <button
          style={{
            width: '100%',
            background: '#334155',
          }}
          onClick={() => nav('/join')}
        >
          Join Room
        </button>

        <div
          style={{
            marginTop: 28,
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: 14,
          }}
        >
          Vote anonymously • Live leaderboard • Real-time results
        </div>
      </div>
    </div>
  )
}
