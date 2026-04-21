import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

const SECTORES = [
  { value: 'tecnologia',   label: 'Tecnología / Software' },
  { value: 'retail',       label: 'Retail / Comercio' },
  { value: 'servicios',    label: 'Servicios Profesionales' },
  { value: 'manufactura',  label: 'Manufactura / Industria' },
  { value: 'construccion', label: 'Construcción / Real Estate' },
  { value: 'agro',         label: 'Agro / Agroindustria' },
  { value: 'salud',        label: 'Salud / Farma' },
  { value: 'medios',       label: 'Medios / Entretenimiento' },
]

const fmtUSD = v =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

const fmtARS = v =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v)

export default function App() {
  const [form, setForm] = useState({ ingresos: '', ebitda: '', deudaNeta: '', sector: 'tecnologia' })
  const [result, setResult] = useState(null)
  const [dolar, setDolar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/dolar`)
      .then(r => r.json())
      .then(setDolar)
      .catch(() => {})
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/valuation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingresos: parseFloat(form.ingresos),
          ebitda: parseFloat(form.ebitda),
          deudaNeta: parseFloat(form.deudaNeta) || 0,
          sector: form.sector,
        }),
      })
      if (!res.ok) throw new Error('Error al calcular la valuación')
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Valuador M&amp;A</h1>
          <p className="subtitle">Estimá el valor de una empresa de capital cerrado</p>
          {dolar?.venta > 0 && (
            <div className="dolar-badge">
              Dólar blue: <strong>${dolar.venta}</strong>
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Ingresos últimos 12 meses (ARS)</label>
            <input
              type="number"
              name="ingresos"
              value={form.ingresos}
              onChange={handleChange}
              placeholder="ej: 50.000.000"
              required
              min="0"
            />
          </div>
          <div className="field">
            <label>EBITDA (ARS)</label>
            <input
              type="number"
              name="ebitda"
              value={form.ebitda}
              onChange={handleChange}
              placeholder="ej: 12.000.000"
              required
            />
          </div>
          <div className="field">
            <label>
              Deuda Neta (ARS)
              <span className="hint"> — negativo si hay caja neta</span>
            </label>
            <input
              type="number"
              name="deudaNeta"
              value={form.deudaNeta}
              onChange={handleChange}
              placeholder="ej: 5.000.000"
            />
          </div>
          <div className="field">
            <label>Sector</label>
            <select name="sector" value={form.sector} onChange={handleChange}>
              {SECTORES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular Valuación'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="results">
            <h2>Resultado</h2>
            <div className="range-card">
              <p className="range-label">Valor del Equity (USD)</p>
              <p className="range-value">
                {fmtUSD(result.equityValueMinUSD)} — {fmtUSD(result.equityValueMaxUSD)}
              </p>
            </div>
            <div className="range-card secondary">
              <p className="range-label">Valor del Equity (ARS)</p>
              <p className="range-value small">
                {fmtARS(result.equityValueMinARS)} — {fmtARS(result.equityValueMaxARS)}
              </p>
            </div>
            <div className="meta">
              <span>Múltiplo EV/EBITDA: {result.multiploMin}x — {result.multiploMax}x</span>
              <span>Dólar blue: ${result.tipoDolarBlue}</span>
            </div>
            <p className="disclaimer">
              Este resultado es una referencia orientativa. No constituye asesoramiento financiero.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
