const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = 4000;
const SECRET = 'Level-Up';

// Verificar la firma del webhook usando el JSON real
function verifySignature(req, body) {
  const signature = `sha256=${crypto
    .createHmac('sha256', SECRET)
    .update(body)
    .digest('hex')}`;
  const headerSignature = req.headers['x-hub-signature-256'];

  console.log('Generated Signature:', signature);
  console.log('Header Signature:', headerSignature);

  if (!headerSignature) {
    console.error('❌ No se recibió el encabezado X-Hub-Signature-256');
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(headerSignature)
  );
}

// Ejecutar comandos
function ejecutarComando(comando, descripcion, callback) {
  console.log(`🔄 Ejecutando: ${descripcion}`);
  exec(comando, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error en "${descripcion}":`, stderr);
      callback(err);
      return;
    }
    console.log(`✅ Completado: ${descripcion}`);
    console.log(stdout);
    callback(null);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let jsonBody = body;

      // Detectar cuando GitHub envía application/x-www-form-urlencoded
      if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body);
        jsonBody = params.get('payload'); // Extraer el JSON real
      }

      // Verificar firma usando jsonBody, NO el body completo
      if (!verifySignature(req, jsonBody)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Invalid signature');
        return;
      }

      let payload;
      try {
        payload = JSON.parse(jsonBody);
      } catch (e) {
        console.error('❌ Error al parsear el JSON:', e);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
        return;
      }

      // Disparar deploy si fue push a main
      if (payload.ref === 'refs/heads/main') {
        console.log('🔄 Recibiendo cambios del repositorio...');
        ejecutarComando(
          '/home/ubuntu/Fullstack-ll/deploy.sh',
          'Despliegue automático',
          (err) => {
            if (err) return;
            console.log('🚀 Despliegue completado con éxito.');
          }
        );
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Webhook recibido');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Webhook server corriendo en http://localhost:${PORT}`);
});
