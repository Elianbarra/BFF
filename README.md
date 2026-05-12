# BFF — Hospital San Rafael

Backend for Frontend construido con **Next.js 16 + TypeScript** que actúa como capa intermedia entre el frontend del hospital y dos microservicios Java (Spring Boot).

---

## Arquitectura general

```
Browser / App
     │
     ▼
┌─────────────────────────────┐
│           BFF               │  ← Next.js (este proyecto)
│  Next.js API Routes +       │     Puerto 3000
│  Frontend (App Router)      │
└────────────┬────────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
┌─────────┐     ┌──────────┐
│ ms-auth │     │ ms-user  │
│  :8080  │     │  :8081   │
└─────────┘     └──────────┘
```

El BFF expone una sola URL al frontend, abstrae la comunicación con los microservicios y sirve las páginas del portal hospitalario.

---

## Patrones de diseño aplicados

### 1. Screaming Architecture
La estructura de carpetas refleja el **dominio del negocio**, no la capa técnica. Al ver `src/features/auth` y `src/features/users` queda claro qué hace la aplicación sin necesidad de leer código.

### 2. Repository Pattern
Cada microservicio tiene una **interfaz** (`IAuthRepository`, `IUsersRepository`) y una **implementación** concreta que encapsula las llamadas HTTP. El `Service` depende de la interfaz, lo que permite intercambiar implementaciones (p. ej., mocks para tests) sin tocar la lógica de negocio.

```
Feature
  ├── types.ts          → Tipos e interfaz del repositorio
  ├── *.repository.ts   → Implementación HTTP (fetch hacia el microservicio)
  └── *.service.ts      → Lógica de negocio, usa el repositorio por inyección
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/                          ← API Routes (BFF endpoints)
│   │   ├── auth/
│   │   │   ├── login/route.ts        POST /api/auth/login
│   │   │   └── validate/route.ts     GET  /api/auth/validate?token=
│   │   └── users/
│   │       ├── route.ts              GET  /api/users  |  POST /api/users
│   │       └── [id]/route.ts         GET / PUT / DELETE /api/users/:id
│   │
│   ├── components/
│   │   └── LoginForm.tsx             Formulario de login (cliente)
│   │
│   ├── dashboard/
│   │   └── page.tsx                  Panel del usuario autenticado
│   │
│   ├── register/
│   │   ├── page.tsx                  Registro de pacientes (público)
│   │   └── staff/
│   │       └── page.tsx              Registro de personal (solo ADMIN)
│   │
│   ├── page.tsx                      Landing + login
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   ├── auth/
│   │   ├── auth.types.ts             LoginRequest, AuthResponse, IAuthRepository
│   │   ├── auth.repository.ts        HTTP → ms-auth :8080
│   │   └── auth.service.ts
│   └── users/
│       ├── users.types.ts            CreateUserRequest, UserResponse, IUsersRepository
│       ├── users.repository.ts       HTTP → ms-user :8081
│       └── users.service.ts
│
└── lib/
    ├── api-error.ts                  Error tipado con status HTTP
    ├── env.ts                        Variables de entorno centralizadas
    ├── http-client.ts                Cliente fetch (GET / POST / PUT / DELETE)
    └── route-handler.ts              Helper de manejo de errores en rutas
```

---

## Microservicios conectados

### ms-auth — Puerto 8080
Gestiona autenticación y tokens JWT.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Devuelve JWT dado email + password |
| `POST` | `/api/auth/register` | Registra credenciales (llamado internamente por ms-user) |
| `GET`  | `/api/auth/validate?token=` | Valida un JWT y devuelve claims |

### ms-user — Puerto 8081
Gestiona el perfil de los usuarios del hospital.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Crea usuario y llama a ms-auth para registrar credenciales |
| `GET`  | `/api/users` | Lista todos los usuarios activos |
| `GET`  | `/api/users/:id` | Obtiene un usuario por ID |
| `PUT`  | `/api/users/:id` | Actualiza datos del usuario |
| `DELETE` | `/api/users/:id` | Desactiva (soft delete) un usuario |

---

## API Routes del BFF

El BFF expone estos endpoints en el puerto 3000:

| Método | Ruta BFF | Redirige a |
|--------|----------|------------|
| `POST` | `/api/auth/login` | ms-auth `POST /api/auth/login` |
| `GET`  | `/api/auth/validate` | ms-auth `GET /api/auth/validate` |
| `GET`  | `/api/users` | ms-user `GET /api/users` |
| `POST` | `/api/users` | ms-user `POST /api/users/register` |
| `GET`  | `/api/users/:id` | ms-user `GET /api/users/:id` |
| `PUT`  | `/api/users/:id` | ms-user `PUT /api/users/:id` |
| `DELETE` | `/api/users/:id` | ms-user `DELETE /api/users/:id` |

---

## Páginas del portal

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing page con formulario de login |
| `/register` | Público | Registro de pacientes |
| `/register/staff` | Solo ADMIN | Registro de médicos, enfermeros y personal |
| `/dashboard` | Autenticado | Perfil del usuario logueado |

---

## Roles del sistema

| Rol | Descripción | Puede registrarse en |
|-----|-------------|----------------------|
| `PATIENT` | Paciente | `/register` (público) |
| `DOCTOR` | Médico | `/register/staff` (admin) |
| `NURSE` | Enfermero/a | `/register/staff` (admin) |
| `ADMIN` | Administrador | `/register/staff` (admin) |
| `RECEPTIONIST` | Recepcionista | `/register/staff` (admin) |

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
MS_AUTH_URL=http://localhost:8080
MS_USER_URL=http://localhost:8081
```

---

## Instalación y ejecución

### Prerrequisitos
- Node.js 18+
- ms-auth corriendo en puerto 8080
- ms-user corriendo en puerto 8081

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local si los puertos son distintos

# 3. Modo desarrollo
npm run dev
# → http://localhost:3000

# 4. Build de producción
npm run build
npm start
```

---

## Flujos principales

### Registro de paciente
```
/register → POST /api/users (role: PATIENT) → redirige a / con banner de éxito
```

### Registro de personal (admin)
```
/dashboard → clic en "Registrar personal" → /register/staff
→ POST /api/users (role: DOCTOR | NURSE | ADMIN | RECEPTIONIST)
→ muestra confirmación y permite registrar otro
```

### Login
```
/ → POST /api/auth/login → guarda token en storage → /dashboard
```

### Dashboard
```
/dashboard → GET /api/users/:userId → muestra perfil completo
           → (si ADMIN) botón "+ Registrar personal" visible
```

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16 | Framework fullstack (App Router) |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 3 | Estilos utilitarios |
| Node.js fetch | nativo | Cliente HTTP hacia microservicios |
