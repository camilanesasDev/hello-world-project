# hello-world-project

Proyecto full-stack con **Kotlin + Spring Boot** (backend) y **React JS + Vite** (frontend).

## Estructura

```
hello-world-project/
├── backend/    # Kotlin + Spring Boot (puerto 8080)
├── frontend/   # React JS + Vite (puerto 3000)
└── README.md
```

## Requisitos

- Java 17+
- Node.js 18+
- npm 9+

## Correr el proyecto

### Backend
```bash
cd backend
./gradlew bootRun
```
La API quedará disponible en `http://localhost:8080/api/hello`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
La app quedará disponible en `http://localhost:3000`

## Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/hello` | Retorna `{ "message": "¡Hola Mundo desde Kotlin!" }` |
