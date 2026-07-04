import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/api'

export default function Vote() {
  const { code, playerId } = useParams()
  const nav = useNavigate()

  const [room, setRoom] = useState<any>(null)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await api.get(`/rooms/${code}`)
      setRoom(res.data)
    }

    load()
  }, [code])

  async function vote(questionId: string, targetName: string) {
    if (loading) return

    setLoading(true)

    await api.post(`/rooms/${code}/vote`, {
      voterId: playerId,
      questionId,
      targetName,
    })

    setTimeout(() => {
      setCurrent((c) => c + 1)
      setLoading(false)
    }, 700)
  }

  if (!room) {
    return (
      <div className="page">
        <div className="card">
          <h2>Loading...</h2>
        </div>
      </div>
    )
  }

  const questions = room.questions || []
  const candidates = room.candidates || []

  if (current >= questions.length) {
    return (
      <div className="page">
        <div
          className="card"
          style={{
            width: 700,
            textAlign: 'center',
          }}
        >
          <h1 className="title">
            Voting Finished
          </h1>

          <p className="subtitle">
            Thanks for voting.
          </p>

          <button
            onClick={() => nav(`/results/${code}`)}
            style={{ width: '100%' }}
          >
            View Live Results
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="page">
      <div
        className="card"
        style={{
          width: 900,
          maxWidth: '100%',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: 15,
          }}
        >
          Question {current + 1} of {questions.length}
        </h2>

        <div className="progress">
          <div
            className="progressFill"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <h1
          style={{
            textAlign: 'center',
            marginBottom: 35,
            fontSize: 36,
          }}
        >
          {q.text}
        </h1>

        <div className="candidateGrid">
          {candidates.map((c: any) => (
            <div
              key={c.id}
              className="candidateCard"
              onClick={() => !loading && vote(q.id, c.name)}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
