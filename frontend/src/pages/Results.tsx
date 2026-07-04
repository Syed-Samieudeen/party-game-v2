import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'
import { socket } from '../socket'

export default function Results() {
  const { code } = useParams()
  const [results, setResults] = useState<any[]>([])

  async function load() {
    const res = await api.get(`/rooms/${code}/results`)
    setResults(res.data.results)
  }

  useEffect(() => {
    load()

    socket.emit('joinRoom', code)

    socket.on('resultsUpdated', load)

    return () => {
      socket.off('resultsUpdated', load)
    }
  }, [code])

  return (
    <div style={{ padding: 30 }}>
      <h1>Live Results</h1>

      {results.map(q => (
        <div
          key={q.questionId}
          style={{
            border: '1px solid #444',
            borderRadius: 12,
            padding: 20,
            marginBottom: 25,
          }}
        >
          <h2>{q.question}</h2>

          {Object.entries(q.tally)
            .sort((a:any,b:any)=>b[1]-a[1])
            .map(([candidate,votes]:any)=>(
              <div key={candidate} style={{marginBottom:20}}>

                <h3>
                  {candidate}
                  {q.leader===candidate && ' (Leader)'}
                  {' - '}
                  {votes} votes
                </h3>

                <div style={{paddingLeft:20}}>
                  {q.votes
                    .filter((v:any)=>v.target===candidate)
                    .map((v:any,index:number)=>(
                      <div key={index}>
                        • {v.voter}
                      </div>
                    ))}
                </div>

              </div>
            ))}

        </div>
      ))}

    </div>
  )
}
