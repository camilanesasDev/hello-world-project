# Valuador M&A

Simulador de valuación de empresas de capital cerrado para transacciones M&A. Permite a socios de PyMEs e inversores obtener una referencia del valor de una compañía a partir de sus datos financieros.

## Stack

- **Backend:** Kotlin + Spring Boot — API REST
- **Frontend:** React + Vite — interfaz de usuario
- **Deploy:** Railway (backend) + Vercel (frontend)

## Estructura

```
hello-world-project/
├── backend/    # Kotlin + Spring Boot (puerto 8080)
├── frontend/   # React + Vite (puerto 3000)
└── README.md
```

## Funcionalidades

- Ingreso de datos financieros: ingresos, EBITDA, deuda neta y sector
- Cálculo del rango de valuación usando múltiplos EV/EBITDA por sector
- Conversión automática a USD usando el dólar blue en tiempo real (dolarapi.com)
- Resultado expresado como rango en USD y ARS

### Múltiplos por sector

| Sector | Mínimo | Máximo |
|--------|--------|--------|
| Tecnología / Software | 6x | 8x |
| Salud / Farma | 5x | 8x |
| Construcción / Real Estate | 5x | 7x |
| Servicios Profesionales | 4x | 6x |
| Manufactura / Industria | 4x | 6x |
| Agro / Agroindustria | 4x | 6x |
| Retail / Comercio | 3x | 5x |
| Medios / Entretenimiento | 3x | 6x |

## Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/dolar` | Retorna el valor del dólar blue en tiempo real |
| POST | `/api/valuation` | Calcula el rango de valuación de la empresa |

### POST /api/valuation

**Request:**
```json
{
  "ingresos": 50000000,
  "ebitda": 12000000,
  "deudaNeta": 5000000,
  "sector": "tecnologia"
}
```

**Response:**
```json
{
  "equityValueMinUSD": 47517,
  "equityValueMaxUSD": 64539,
  "equityValueMinARS": 67000000,
  "equityValueMaxARS": 91000000,
  "evMinUSD": 51063,
  "evMaxUSD": 68085,
  "multiploMin": 6.0,
  "multiploMax": 8.0,
  "tipoDolarBlue": 1410.0,
  "sector": "tecnologia"
}
```

## Correr en local

### Requisitos

- Java 21+
- Node.js 18+

### Backend
```bash
cd backend
./gradlew bootRun
```
API disponible en `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App disponible en `http://localhost:3000`

### Variable de entorno (producción)

El frontend usa `VITE_API_URL` para apuntar al backend en producción:

```
VITE_API_URL=https://<tu-backend>.up.railway.app
```
