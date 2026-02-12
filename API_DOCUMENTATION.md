# 📖 API Documentation

## Authentication Endpoints

### 1. Register

```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "passwordConfirm": "password123"
}
Response: {
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "role": "user",
    "wallet": "TAddress..."
  }
}
```

- Crea automáticamente una wallet TRON
- Genera Access Token (15 min) y Refresh Token (7 días)
- Tokens se guardan en cookies

---

### 2. Login

```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "message": "Login successful",
  "user": {...}
}
```

---

### 3. Logout

```
POST /api/auth/logout
Headers: Cookie (accessToken requerido)
Response: {
  "message": "Logout successful"
}
```

---

### 4. Refresh Token

```
POST /api/auth/refresh-token
Headers: Cookie (refreshToken requerido)
Response: {
  "message": "Token refreshed"
}
```

- Genera nuevos tokens sin re-autenticarse

---

### 5. Get Profile

```
GET /api/auth/profile
Headers: Cookie (accessToken requerido)
Response: {
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "role": "user|admin",
    "wallet": "TAddress...",
    "createdAt": "...",
    "lastLogin": "..."
  }
}
```

---

## Wallet Endpoints (Requieren autenticación)

### 1. Get Balance

```
GET /api/wallet/balance
Headers: Cookie (accessToken requerido)
Response: {
  "address": "TAddress...",
  "TRX": 100.5
}
```

- Obtiene el saldo TRX de la wallet del usuario autenticado

---

### 2. Send TRX

```
POST /api/wallet/send-trx
Headers: Cookie (accessToken requerido)
Body: {
  "toAddress": "TDestinationAddress...",
  "amount": 10.5
}
Response: {
  "message": "TRX sent successfully",
  "transaction": {...}
}
```

- Envía TRX desde la wallet del usuario autenticado
- Incluye fees

---

## Security Features

✅ **JWT Authentication** - Access Token + Refresh Token
✅ **HttpOnly Cookies** - Tokens seguros (no accesibles desde JS)
✅ **SSL/Secure en Prod** - SameSite=Strict
✅ **Rate Limiting** - 5 intentos/15 min en auth, 100 general
✅ **Helmet** - Headers de seguridad HTTP
✅ **HPP** - Protección contra parámetros duplicados
✅ **Bcryptjs** - Contraseñas hasheadas con salt
✅ **CORS** - Restricción de origen
✅ **Input Validation** - express-validator en todas las rutas

---

## Roles & Permissions

- **user**: Acceso a wallet (balance, send), profile
- **admin**: Acceso completo (a implementar)

---

## Error Handling

Todos los errores devuelven:

```json
{
  "error": "Error message"
}
```

Códigos HTTP:

- 400: Bad Request (validación)
- 401: Unauthenticated
- 403: Unauthorized (roles)
- 404: Not Found
- 429: Too Many Requests (rate limit)
- 500: Server Error

---

## Environment Variables

Ver `.env.example` para configuración
