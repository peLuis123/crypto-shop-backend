# 📚 Swagger API Documentation

## Acceso a la Documentación

Una vez que el servidor está corriendo, accede a:

👉 **http://localhost:3000/api/docs**

## Características

✅ **Documentación interactiva** - Prueba los endpoints directamente desde el navegador
✅ **Esquemas JSON** - Modelos de datos completamente documentados
✅ **Ejemplos de request/response** - Ejemplos reales para cada endpoint
✅ **Autenticación** - Prueba endpoints protegidos con JWT
✅ **Organización por tags** - Endpoints agrupados por módulo:

- 🔐 Auth (registro, login, logout)
- 👤 Users (perfil, contraseña, wallet)
- 💰 Wallet (balance, enviar TRX)
- 📦 Products (CRUD)
- 🛒 Orders (crear, pagar, rastrear)
- 💳 Transactions (historial)
- 📱 Sessions (dispositivos activos)
- 🔒 Security (2FA)

## Cómo Probar Endpoints Autenticados

1. **Registra un usuario primero:**
   - POST `/api/auth/register`
   - El token se guarda automáticamente en cookies

2. **Prueba un endpoint autenticado:**
   - GET `/api/users/profile`
   - El Swagger enviará automáticamente el token

## Estructura de Respuestas

Todas las respuestas siguen este patrón:

```json
{
  "success": true,
  "message": "Descripción",
  "data": { ... }
}
```

## Tipos de Error

| Código | Significado                                            |
| ------ | ------------------------------------------------------ |
| `400`  | Validación fallida (faltan campos, formato inválido)   |
| `401`  | No autenticado o token inválido                        |
| `403`  | No autorizado (ej: usuario intentando acceso de admin) |
| `404`  | Recurso no encontrado                                  |
| `500`  | Error del servidor                                     |

## Notas Importantes

- **Contraseña mínima**: 8 caracteres
- **Precio**: Siempre en TRX
- **Billetera**: Se crea automáticamente al registrarse
- **2FA**: Es opcional, se activa en `/api/security/2fa/enable`
- **Sessions**: Rastrean dispositivos desde donde accedes

## Ejemplo de Uso con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt

# Obtener perfil (usando cookies)
curl -X GET http://localhost:3000/api/users/profile \
  -b cookies.txt
```

## Prueba de Endpoints Importantes

### 1. **Crear Orden y Pagar con TRX**

```
POST /api/orders → Crear
POST /api/orders/{id}/pay → Pagar con TRX
GET /api/transactions → Ver historial
```

### 2. **Gestión de Productos (Admin)**

```
GET /api/products → Ver todos
POST /api/products → Crear (solo admin)
PUT /api/products/:id → Actualizar (solo admin)
DELETE /api/products/:id → Eliminar (solo admin)
```

### 3. **Seguridad 2FA**

```
POST /api/security/2fa/enable → Genera QR
POST /api/security/2fa/verify → Verifica código
```

---

**¡La documentación se actualiza automáticamente con cada endpoint nuevo!** 🚀
