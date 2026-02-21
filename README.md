# 🚀 Crypto Shop Backend - Sistema de Autenticación Seguro

Sistema de backend con autenticación JWT, gestión de wallets TRON y base de datos MongoDB.

## 📋 Requisitos previos

- Node.js v16+
- npm o yarn
- MongoDB (local o Atlas)
- TRON API Key (opcional, para límites más altos)

## 🔧 Instalación

### 1. Clonar y instalar dependencias

```bash
git clone <repo>
cd crypto-shop-backend
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

En `.env`:

```
MONGODB_URI=mongodb://localhost:27017/crypto-shop
NODE_ENV=development
PORT=3000
TRON_NETWORK=https://nile.trongrid.io
ACCESS_TOKEN_SECRET=tu_secret_super_largo_aqui_min_32_chars
REFRESH_TOKEN_SECRET=otro_secret_super_largo_aqui_min_32_chars
CLIENT_URL=http://localhost:3000
```

### 3. Iniciar MongoDB

**Local:**

```bash
mongod
```

**O usar MongoDB Atlas (cloud):**

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/crypto-shop?retryWrites=true&w=majority
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

✅ Servidor corriendo en `http://localhost:3000`

---

## 📚 Funcionalidades

### ✅ Autenticación

- Registro con wallet automática
- Login seguro
- Logout
- Refresh token automático
- Tokens en cookies HttpOnly

### ✅ Autorizaciones

- Roles: usuario y administrador
- Middlewares de protección por rol
- Rutas protegidas

### ✅ Wallets

- Crear wallet automáticamente en registro
- Ver saldo TRX
- Enviar TRX

### ✅ Seguridad

- Bcryptjs para contrase`ñas
- JWT con expiry
- Rate limiting
- Helmet headers
- CORS
- Validación de entrada
- HPP (HTTP Parameter Pollution protection)

---

## 🔐 Flujo de Seguridad

```
1. Usuario registra → Crear wallet TRON + hash password
2. JWT tokens en cookies HttpOnly
3. Refresh token a los 15 min automáticamente
4. Rate limiting en login (5 intentos/15 min)
5. Contrasenas hasheadas con bcryptjs (salt=10)
6. Access denied si no está autenticado
```

---

## 📖 API Endpoints

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

**Resumen rápido:**

| Método | Ruta                      | Autenticadores | Descripción    |
| ------ | ------------------------- | -------------- | -------------- |
| POST   | `/api/auth/register`      | -              | Crear cuenta   |
| POST   | `/api/auth/login`         | -              | Iniciar sesión |
| POST   | `/api/auth/logout`        | ✅             | Cerrar sesión  |
| GET    | `/api/auth/profile`       | ✅             | Ver perfil     |
| POST   | `/api/auth/refresh-token` | -              | Renovar token  |
| GET    | `/api/wallet/balance`     | ✅             | Ver saldo      |
| POST   | `/api/wallet/send-trx`    | ✅             | Enviar TRX     |

---

## 🧪 Pruebas

### Con cURL

```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username123",
    "password": "password123",
    "passwordConfirm": "password123"
  }' \
  -c cookies.txt

# Ver perfil (usa cookies guardadas)
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt

# Ver saldo
curl -X GET http://localhost:3000/api/wallet/balance \
  -b cookies.txt

# Enviar TRX
curl -X POST http://localhost:3000/api/wallet/send-trx \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "toAddress": "TAddress...",
    "amount": 0.1
  }'
```

### Con Postman

1. Crear nueva colección
2. En "Pre-request Script" global:
   ```javascript

   ```
3. Importar endpoints desde `API_DOCUMENTATION.md`

---

## 📁 Estructura de carpetas

```
src/
├── api/
│   ├── auth/              # Autenticación
│   │   ├── authController.js
│   │   └── index.js
│   └── wallets/          # Wallets TRON
│       ├── getBalances.js
│       ├── walletController.js
│       └── index.js
├── config/
│   └── database.js       # Conexión MongoDB
├── middlewares/
│   ├── auth.js           # JWT + roles
│   └── validation.js     # Validación de entrada
├── models/
│   └── User.js           # Schema Mongoose
├── services/
│   └── tron.service.js   # Funciones TRON
├── utils/
│   └── tokenUtils.js     # JWT utilities
├── index.js              # Entrada principal
└── api/index.js          # Setup de Express
```

---

## ⚙️ Configuración avanzada

### Cambiar a Mainnet

En `.env`:

```
TRON_NETWORK=https://api.trongrid.io
```

⚠️ **CUIDADO CON DINERO REAL**

### Usar MongoDB Atlas

1. Crear cluster en [mongodb.com](https://mongodb.com)
2. Copiar connection string
3. En `.env`:

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/crypto-shop?retryWrites=true&w=majority
```

### Encriptar Private Keys (Producción)

En `src/models/User.js`, encriptar `wallet.privateKey`:

```javascript
import crypto from "crypto";

if (this.wallet?.privateKey) {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.ENCRYPTION_KEY);
  this.wallet.privateKey = cipher.update(this.wallet.privateKey, "utf8", "hex");
  this.wallet.privateKey += cipher.final("hex");
}
```

---

## 🐛 Troubleshooting

### Error: "MongoDB connection error"

- Verificar MongoDB está corriendo: `mongod`
- Verificar `MONGODB_URI` en `.env`

### Error: "Token is invalid"

- Limpiar cookies del navegador
- Asegurar que `ACCESS_TOKEN_SECRET` es suficientemente largo

### Error: "TRON address invalid"

- Asegurar dinero está en testnet (Nile: https://nile.trongrid.io)
- Verificar formato de dirección (debe ser base58 con `T`)

---

## 📝 Notas de seguridad

✅ **SIEMPRE EN PRODUCCIÓN:**

- Usar HTTPS (no HTTP)
- Usar variables de entorno seguros
- Encriptar private keys en BD
- Usar MongoDB con autenticación
- Aumentar JWT secrets
- Revisar CORS origins

⚠️ **NO HAGAS ESTO EN PRODUCCIÓN:**

- Guardar private keys sin encriptar
- Exponerlas en console.log
- Usar debug mode
- Confiar en contraseños débiles

---

## 📞 Soporte

Para preguntas o issues, [create an issue](link-al-repo)

---

## 📄 Licencia

ISC
