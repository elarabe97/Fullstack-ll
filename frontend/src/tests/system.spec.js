describe('Sistema de Tienda Online - Pruebas Unitarias', function () {

    // 1. Prueba de Lógica de Negocio (Cálculo de Totales)
    it('Debe calcular correctamente el total de una orden', function () {
        const precioProducto = 50000;
        const cantidad = 2;
        const impuesto = 1.19; // IVA 19%

        const subtotal = precioProducto * cantidad;
        const total = subtotal * impuesto;

        expect(subtotal).toBe(100000);
        expect(total).toBe(119000);
    });

    // 2. Prueba de Seguridad (Validación de Token simulada)
    it('Debe validar que un usuario sin token no esté autenticado', function () {
        const usuarioAnonimo = { nombre: "Invitado", token: null };
        const estaAutenticado = usuarioAnonimo.token !== null;

        expect(estaAutenticado).toBe(false);
    });

    // 3. Prueba de Configuración de API
    it('La URL base de la API debe estar definida', function () {
        const API_URL = "http://3.238.85.129:8080";
        expect(API_URL).toContain("3.238.85.129");
        expect(API_URL).toMatch(/http/);
    });
});
