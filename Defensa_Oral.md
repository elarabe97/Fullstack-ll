# Puntos para Defensa Oral (EP3)

## 1. Introducción
- "Buenas tardes, presento la integración Fullstack de Level-Up Gamer."
- "El objetivo fue conectar el frontend React existente con un nuevo backend Spring Boot seguro y robusto."

## 2. Arquitectura y Tecnologías
- "Utilicé **Spring Boot 3** para el backend por su facilidad de configuración y manejo de dependencias."
- "Para la seguridad, implementé **Spring Security con JWT**. Esto permite que la API sea 'stateless' (sin estado), ideal para escalar."
- "La base de datos es **H2** (en memoria) para desarrollo rápido, pero el uso de **JPA/Hibernate** permite cambiar a MySQL/PostgreSQL fácilmente."

## 3. Desafíos y Soluciones
- **Seguridad**: "El mayor desafío fue configurar el filtro JWT (`JwtAuthenticationFilter`) para interceptar peticiones y validar el token antes de llegar a los controladores."
- **CORS**: "Tuve que configurar CORS para permitir que el frontend (puerto 5173) hable con el backend (puerto 8080)."
- **Lógica de Negocio**: "Centralicé el cálculo de descuentos y puntos en el `OrderService` del backend para asegurar que el usuario no pueda manipular los precios desde el frontend."

## 4. Demostración (Flujo Clave)
- "Si me permiten, mostraré el flujo de un usuario DUOC:"
  1. "Login con `cliente@duoc.cl`."
  2. "Agregar producto al carrito."
  3. "Mostrar que el descuento del 20% se aplica automáticamente."
  4. "Finalizar compra y verificar que los puntos aumentaron."

## 5. Conclusión
- "El sistema cumple con todos los requisitos: seguridad, roles, reglas de negocio y documentación API."
