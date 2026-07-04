import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'

export default function Lobby() {
  const { code } = useParams()

  const [room, setRoom] = useState<any>(null)

  const [questions, setQuestions] = useState('')
  const [candidates, setCandidates] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await api.get(`/rooms/${code}`)
    setRoom(res.data)
  }

  useEffect(() => {
    load()

    const timer = setInterval(load, 2000)

    return () => clearInterval(timer)
  }, [code])

  async function addQuestions() {
    const list = questions
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean)

    await api.post(`/rooms/${code}/questions`, {
      questions: list,
    })

    setQuestions('')
    setMsg('Questions saved.')

    load()
  }

  async function addCandidates() {
    const list = candidates
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean)

    await api.post(`/rooms/${code}/candidates`, {
      candidates: list,
    })

    setCandidates('')
    setMsg('Candidates saved.')

    load()
  }

  if (!room)
    return (
      <div className="page">
        Loading...
      </div>
    )

  return (
    <div className="page">
      <div
        className="card"
        style={{
          width:900,
          maxWidth:'100%',
        }}
      >
        <h1 className="title">
          Host Dashboard
        </h1>

        <p
          style={{
            textAlign:'center',
            marginBottom:20,
          }}
        >
          Room Code
        </p>

        <h2
          style={{
            textAlign:'center',
            fontSize:44,
            letterSpacing:4,
            marginBottom:20,
          }}
        >
          {room.code}
        </h2>

        <div
          style={{
            display:'flex',
            gap:15,
            marginBottom:30,
          }}
        >
          <button
            style={{flex:1}}
            onClick={()=>{
              navigator.clipboard.writeText(room.code)
              alert('Copied!')
            }}
          >
            Copy Code
          </button>

          <button
            style={{flex:1}}
            onClick={()=>{
              window.open(`/results/${room.code}`)
            }}
          >
            Live Results
          </button>
        </div>

        <hr />

        <h2>Players ({room.players.length})</h2>

        <div className="list">
          {room.players.map((p:any)=>(
            <div
              key={p.id}
              className="item"
            >
              {p.name}
            </div>
          ))}
        </div>

        <hr />

        <h2>Questions</h2>

        <textarea
          rows={6}
          placeholder="One question per line..."
          value={questions}
          onChange={(e)=>setQuestions(e.target.value)}
        />

        <div style={{height:15}}/>

        <button onClick={addQuestions}>
          Save Questions
        </button>

        <div className="section">

          {room.questions.map((q:any)=>(
            <div
              key={q.id}
              className="item"
            >
              {q.text}
            </div>
          ))}

        </div>

        <hr />

        <h2>Candidates</h2>

        <textarea
          rows={6}
          placeholder="One candidate per line..."
          value={candidates}
          onChange={(e)=>setCandidates(e.target.value)}
        />

        <div style={{height:15}}/>

        <button onClick={addCandidates}>
          Save Candidates
        </button>

        <div className="section">

          {room.candidates.map((c:any)=>(
            <div
              key={c.id}
              className="item"
            >
              {c.name}
            </div>
          ))}

        </div>

        <hr />

        <div
          style={{
            textAlign:'center',
            color:'#22c55e',
          }}
        >
          {msg}
        </div>

      </div>
    </div>
  )
}
