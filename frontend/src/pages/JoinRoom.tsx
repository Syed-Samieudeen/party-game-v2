import { useState } from 'react'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function JoinRoom() {
  const nav = useNavigate()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  async function join() {
    if (!code.trim() || !name.trim()) {
      alert('Enter room code and your name')
      return
    }

    const res = await api.post(`/rooms/${code.toUpperCase()}/join`, {
      name,
    })

    if (!res.data.success) {
      alert('Room not found')
      return
    }

    nav(`/vote/${code.toUpperCase()}/${res.data.playerId}`)
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
          Join Room
        </h1>

        <p className="subtitle">
          Enter the room code and your name.
        </p>

        <input
          placeholder="Room Code"
          value={code}
          maxLength={6}
          onChange={(e) =>
            setCode(e.target.value.toUpperCase())
          }
        />

        <div style={{ height: 15 }} />

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <div style={{ height: 20 }} />

        <button
          style={{
            width: '100%',
          }}
          onClick={join}
        >
          Join Room
        </button>

        <div style={{ height: 12 }} />

        <button
          style={{
            width: '100%',
            background: '#334155',
          }}
          onClick={() => nav('/')}
        >
          Back
        </button>
      </div>
    </div>
  )
}
