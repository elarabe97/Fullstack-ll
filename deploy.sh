#!/bin/bash

# ============================================
# Script de Despliegue Automático - Fullstack-ll
# ============================================

PROJECT_DIR=~/Fullstack-ll/frontend
LOG_FILE=~/Fullstack-ll/deploy.log
BACKEND_JAR=~/Fullstack-ll/backend/target/backend-0.0.1-SNAPSHOT.jar

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "===== Inicio del despliegue ====="


# =========================
# GIT PULL
# =========================
cd $PROJECT_DIR || { log "ERROR: No se pudo acceder a frontend"; exit 1; }

log "Obteniendo cambios desde GitHub..."
git pull origin main >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "ERROR: Git pull falló"
    exit 1
fi


# =========================
# BACKEND
# =========================
log "Construyendo backend..."
cd ~/Fullstack-ll/backend || { log "ERROR: No se pudo acceder al backend"; exit 1; }

./mvnw clean package -DskipTests >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "ERROR: Build del backend falló"
    exit 1
fi

log "Backend construido exitosamente"

log "Reiniciando backend..."
pm2 describe levelup-backend > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pm2 restart levelup-backend
else
    pm2 delete levelup-backend > /dev/null 2>&1
    pm2 start "java -jar $BACKEND_JAR" --name levelup-backend
fi


# =========================
# FRONTEND VITE
# =========================
log "Construyendo frontend..."
cd $PROJECT_DIR

# Instalar dependencias si package.json cambió
if git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep -q "package.json"; then
    log "package.json cambió, instalando dependencias..."
    npm install >> $LOG_FILE 2>&1
fi

# Eliminar build anterior
rm -rf $PROJECT_DIR/dist

log "Generando build con Vite..."
npm run build >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "ERROR: Build del frontend falló"
    exit 1
fi

log "Frontend construido exitosamente"

# Copiar al NGINX ROOT
log "Copiando frontend a /var/www/html..."
sudo rm -rf /var/www/html/*
sudo cp -r $PROJECT_DIR/dist/* /var/www/html/
sudo chmod -R 755 /var/www/html

log "Frontend desplegado correctamente"


# =========================
# FINAL
# =========================

pm2 save

log "===== Despliegue completado ====="


echo ""
echo "✅ Deploy exitoso"
echo "🌐 Frontend: http://fullstack2-pagina.duckdns.org"
echo "🔧 Backend: http://fullstack2-pagina.duckdns.org:8080/api"
echo "📄 Log: tail -f $LOG_FILE"
echo ""

