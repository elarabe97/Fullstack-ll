@echo off
echo ==========================================
echo   ACTUALIZANDO SERVIDOR AWS
echo ==========================================
echo.
echo Conectando a fullstack2-pagina.duckdns.org...
echo.

ssh -i aws_key.pem -o StrictHostKeyChecking=no ubuntu@fullstack2-pagina.duckdns.org "cd ~/Fullstack-ll && ./deploy.sh"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudo conectar o actualizar.
    echo Verifica que tu IP este permitida en el Security Group de AWS (Puerto 22).
    pause
    exit /b %errorlevel%
)

echo.
echo [EXITO] Servidor actualizado correctamente.
echo.
pause
