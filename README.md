# Crypto-Shop Backend

Proyecto: **Crypto-Shop**
Desarrollado por: **Pedro Luis Ramos Calla**

Backend de e-commerce con pagos en TRX (TRON), autenticacion JWT con cookies HttpOnly, ordenes, productos, usuarios y panel administrativo con estadisticas y operaciones en tiempo real.

---

## Resumen ejecutivo

Crypto-Shop es un backend listo para produccion que soporta:

- Autenticacion y autorizacion por roles (user/admin)
- Pagos en TRX con confirmacion en blockchain
- Ordenes y transacciones con estados consistentes
- Panel admin con estadisticas, ventas, clientes y productos
- Notificaciones en tiempo real via Socket.io

---

## Stack tecnico

- Node.js + Express
- MongoDB + Mongoose
- TRON (TronWeb)
- JWT (cookies HttpOnly)
- Socket.io (notificaciones en tiempo real)
- Swagger OpenAPI

---

## Arquitectura funcional

1. El usuario crea una orden.
2. El pago se envia a la wallet del merchant.
3. La transaccion queda en estado `pending`.
4. Un listener valida la confirmacion en blockchain.
5. Se actualiza la orden a `completed`.
6. Se notifica al frontend via socket.

---

## Requisitos

- Node.js v16+
- MongoDB (local o Atlas)
- Acceso a red TRON (Nile/Testnet o Mainnet)

---

## Instalacion

```bash
npm install
```

---

## Variables de entorno

Crea `.env`:

```
MONGODB_URI=mongodb://localhost:27017/crypto-shop
NODE_ENV=development
PORT=3000
TRON_NETWORK=https://nile.trongrid.io
ACCESS_TOKEN_SECRET=tu_secret_largo_aqui
REFRESH_TOKEN_SECRET=otro_secret_largo_aqui
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
MERCHANT_WALLET_ADDRESS=TU_WALLET_MERCHANT
```

---

## Ejecutar

```bash
npm run dev
```

Servidor por defecto en: `http://localhost:3000`

---

## Swagger

Swagger disponible en:

`/api/docs`

---

## Funcionalidades principales

### Autenticacion

- Registro con wallet
- Login / logout
- Refresh token
- Cookies HttpOnly

### Ordenes y pagos

- Crear orden
- Pagar en TRX
- Confirmacion asincrona
- Prevencion de doble compra pendiente

### Panel admin

- Dashboard con metricas y tendencias
- Ventas con filtros
- Clientes con totalSpent
- Productos (CRUD)
- Reembolsos on-chain

### Socket.io

- Evento `transaction:confirmed` al confirmar pago

---

## Endpoints clave

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/auth/refresh-token`

### Orders

- POST `/api/orders`
- POST `/api/orders/:id/pay`
- GET `/api/orders`

### Admin

- GET `/api/admin/stats`
- GET `/api/admin/sales`
- PATCH `/api/admin/orders/:id/status`
- POST `/api/admin/orders/:id/refund`
- GET `/api/admin/customers`
- PATCH `/api/admin/customers/:id/block`
- POST `/api/admin/customers/export`
- GET `/api/admin/products`
- POST `/api/admin/products`
- PATCH `/api/admin/products/:id`
- DELETE `/api/admin/products/:id`

---

## Socket.io (frontend)

El frontend debe conectarse y unirse al room del usuario:

```javascript
socket.emit("join-user", userId);

socket.on("transaction:confirmed", (data) => {
  // data: { orderId, txHash, message, timestamp }
});
```

---

## Estado de ordenes

- pending
- completed
- refunded

---

## Estructura del proyecto

```
src/
  api/
  config/
  middlewares/
  models/
  services/
  utils/
  index.js
```

---

## Contacto

Pedro Luis Ramos Calla

Si necesitas soporte tecnico o detalles de implementacion, no dudes en contactarme.
