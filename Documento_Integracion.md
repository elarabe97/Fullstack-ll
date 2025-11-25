# Documento de Integración Backend-Frontend
## Proyecto: Level-Up Gamer (EP3)

### 1. Arquitectura del Sistema
El sistema sigue una arquitectura de **Cliente-Servidor** desacoplada:
- **Backend**: Spring Boot 3 (Java 17) exponiendo una API REST.
- **Frontend**: React (Vite) consumiendo la API mediante Axios.
- **Base de Datos**: H2 en memoria para persistencia temporal.
- **Seguridad**: JWT (JSON Web Tokens) para autenticación stateless.

### 2. Modelo de Datos (Entidades Principales)
- **User**: Usuarios con roles (ADMIN/CLIENT). Atributos clave: `email`, `password`, `duocEmail` (booleano para descuento), `points`.
- **Product**: Catálogo de juegos. Atributos: `code`, `name`, `price`, `img`.
- **Order**: Pedidos realizados. Relación 1:N con `OrderItem`. Calcula `subtotal`, `discount` (20% si es Duoc), `total`.
- **Review**: Reseñas de productos. Relación con `User` (nombre) y `Product` (código).

### 3. Endpoints REST y Seguridad
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de usuarios | Público |
| POST | `/api/auth/login` | Inicio de sesión | Público |
| GET | `/api/products` | Listar productos | Público |
| POST | `/api/products` | Crear producto | ADMIN |
| GET | `/api/reviews` | Listar reseñas | Público |
| POST | `/api/reviews` | Crear reseña | Autenticado |
| POST | `/api/orders` | Crear orden | Autenticado |

### 4. Flujos de Integración
#### 4.1 Autenticación
1. **Frontend**: Usuario ingresa credenciales en `/login`.
2. **Backend**: `AuthController` valida con `AuthenticationManager`. Si es correcto, genera JWT.
3. **Frontend**: Recibe `{ token, user }`. Guarda en `UserContext` y `localStorage`.
4. **Uso**: El token se envía en el header `Authorization: Bearer <token>` en requests protegidos.

#### 4.2 Catálogo y Carrito
1. **Catálogo**: `Catalog.jsx` hace GET `/api/products`.
2. **Carrito**: `CartContext` mantiene estado local de ítems.
3. **Checkout**:
   - `Cart.jsx` envía POST `/api/orders` con `{ items: [{code, qty}] }`.
   - **Backend**: `OrderService` busca precios reales en DB, calcula subtotal.
   - **Regla de Negocio**: Si `user.duocEmail` es true, aplica 20% descuento.
   - **Puntos**: `floor(total / 1000)` se suman al usuario.
   - **Respuesta**: Retorna la Orden creada. Frontend limpia carrito y muestra éxito.

#### 4.3 Comunidad
1. **Listar**: GET `/api/reviews` carga reseñas.
2. **Crear**: POST `/api/reviews` con token. Backend asocia la reseña al usuario autenticado.

### 5. Pruebas de Integración (Casos Esperados)
1. **Registro Duoc**: Registrar `alumno@duoc.cl`. Verificar que en el carrito se aplique 20% de descuento.
2. **Registro Menor**: Intentar registrar edad 15. Frontend debe bloquear. Backend (si se salta frontend) no tiene validación explícita en este código simplificado, pero frontend sí.
3. **Compra**: Comprar juego de $50.000.
   - Usuario Normal: Total $50.000. Puntos: 50.
   - Usuario Duoc: Descuento $10.000. Total $40.000. Puntos: 40.
4. **Acceso Admin**: Intentar POST `/api/products` con token de cliente. Debe dar 403 Forbidden.
