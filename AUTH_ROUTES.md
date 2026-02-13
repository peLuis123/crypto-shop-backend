# 🔐 Rutas de Autenticación

## 📝 POST /api/auth/register

Crear una nueva cuenta con wallet automática

### Request

```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

### Response (201)

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "672abc...",
    "email": "user@example.com",
    "username": "username123",
    "role": "user",
    "wallet": "TAddress..."
  }
}
```

### Notas

- ✅ Guarda tokens en cookies automáticamente
- ✅ Crea wallet TRON automáticamente
- ✅ La contraseña se hashea con bcryptjs
- ⚠️ Contraseña mínimo 8 caracteres
- ⚠️ Email debe ser único

---

## 🔑 POST /api/auth/login

Iniciar sesión

### Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response (200)

```json
{
  "message": "Login successful",
  "user": {
    "id": "672abc...",
    "email": "user@example.com",
    "username": "username123",
    "role": "user",
    "wallet": "TAddress..."
  }
}
```

### Notas

- ✅ Guarda tokens en cookies
- ✅ Actualiza lastLogin
- ⚠️ Máximo 5 intentos fallidos en 15 minutos (rate limiting)

---

## 🚪 POST /api/auth/logout

Cerrar sesión

### Request

```
Sin body
Headers: Cookie (accessToken requerido)
```

### Response (200)

```json
{
  "message": "Logout successful"
}
```

### Notas

- ✅ Limpia cookies de accessToken y refreshToken

---

## 🔄 POST /api/auth/refresh-token

Renovar access token sin re-autenticarse

### Request

```
Sin body
Headers: Cookie (refreshToken requerido)
```

### Response (200)

```json
{
  "message": "Token refreshed"
}
```

### Notas

- ✅ Access Token: 15 minutos
- ✅ Refresh Token: 7 días
- ✅ Se puede usar automáticamente cada vez que expire el access token

---

## 👤 GET /api/auth/profile

Obtener perfil del usuario autenticado

### Request

```
Sin body
Headers: Cookie (accessToken requerido)
```

### Response (200)

```json
{
  "user": {
    "id": "672abc...",
    "email": "user@example.com",
    "username": "username123",
    "role": "user",
    "wallet": "TAddress...",
    "createdAt": "2026-02-12T10:30:00Z",
    "lastLogin": "2026-02-12T11:45:00Z"
  }
}
```

### Notas

- ✅ Requiere estar autenticado
- ✅ Devuelve información completa del usuario

---

## 🧪 Ejemplos con cURL

### 1. Registrarse

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "passwordConfirm": "password123"
  }' \
  -c cookies.txt
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 3. Ver perfil (con cookies)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

### 4. Renovar token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -b cookies.txt
```

### 5. Cerrar sesión

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## ⚠️ Códigos de Error

| Código | Mensaje                                | Causa                          |
| ------ | -------------------------------------- | ------------------------------ |
| 400    | All fields are required                | Falta algún campo              |
| 400    | Passwords do not match                 | Las contraseñas no coinciden   |
| 400    | Password must be at least 8 characters | Contraseña muy corta           |
| 400    | Email already registered               | Email ya existe                |
| 401    | Invalid email or password              | Credenciales incorrectas       |
| 401    | User account is inactive               | Cuenta desactivada             |
| 401    | No token, authorization denied         | No hay token en cookies        |
| 401    | Token is invalid or expired            | Token expirado o inválido      |
| 429    | Too many login attempts                | Rate limit excedido (5/15 min) |
| 500    | Error message                          | Error del servidor             |

---

## 🍪 Cookies

Los tokens se guardan automáticamente en cookies HttpOnly:

```
accessToken     → 15 minutos
refreshToken    → 7 días
```

**Atributos de seguridad:**

- ✅ HttpOnly: No accesible desde JavaScript
- ✅ Secure: Solo en HTTPS (production)
- ✅ SameSite: Strict
- ✅ MaxAge: Tiempo de expiración

---

## 📋 Validaciones

### Email

- Debe ser un email válido
- Debe ser único en la BD

### Username

- Mínimo 3 caracteres
- Debe ser único en la BD

### Password

- Mínimo 8 caracteres
- Se hashea automáticamente con bcryptjs (10 salt rounds)
- Nunca se devuelve en responses

---

## 🔐 Seguridad

✅ Contraseñas hasheadas con bcryptjs
✅ JWT con expiración
✅ Refresh tokens para renovación
✅ Rate limiting en login
✅ HttpOnly cookies
✅ Validación de entrada
✅ CORS restringido
