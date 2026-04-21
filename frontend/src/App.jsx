import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con el backend')
        return res.json()
      })
      .then((data) => {
        setMessage(data.message)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      {loading && <p className="status">Conectando con el backend...</p>}
      {error && <p className="status error">⚠️ {error}</p>}
      {message && <h1>{message}</h1>}
    </div>
  )
}

export default App
