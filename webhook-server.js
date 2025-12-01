const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = 4000;
const SECRET = 'Level-Up';

// Validar firma del webhook
function verifySignature(req, rawBody) {
  const signature256 = `sha256=${crypto
    .createHmac('sha256', SECRET)
    .update(rawBody)
    .digest('hex')}`;

  const githubSignature = req.headers['x-hub-signature-256'];

  console.log('Generated:', signature256);
  console.log('Received:', githubSignature);

  if (!githubSignature) {
    console.error('❌ Missing X-Hub-Signature-256 header');
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature256),
      Buffer.from(githubSignature)
    );
  } catch (error) {
    console.error('❌ timingSafeEqual error:', error);
    return false;
  }
}

// Ejecutar comando
function ejecutarComando(comando, descripcion) {
  console.log(`🔄 Running: ${descripcion}`);
  exec(comando, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error in "${descripcion}":`, stderr);
      return;
    }
    console.log(`✅ Completed: ${descripcion}`);
    console.log(stdout);
  });
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let rawBody = '';

    req.on('data', chunk => {
      rawBody += chunk;
    });

    req.on('end', () => {
      console.log('📩 Webhook received');

      // Validación firma
      if (!verifySignature(req, rawBody)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Invalid signature');
        return;
      }

      // Parsear JSON
      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch (err) {
        console.error('❌ Invalid JSON:', err);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
        return;
      }

      // Verificar rama
      if (payload.ref === 'refs/heads/main') {
        console.log('🔄 Changes detected in main branch');

        ejecutarComando(
          '/home/ubuntu/Fullstack-ll/deploy.sh',
          'Automatic Deployment'
        );
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');
    });

    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
});
