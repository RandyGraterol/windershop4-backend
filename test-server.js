/**
 * Script de prueba rápida del servidor
 * 
 * Este script verifica que el servidor se inicia correctamente
 * y responde a peticiones básicas
 */

const http = require('http');

// Esperar 3 segundos para que el servidor inicie
setTimeout(() => {
  // Hacer petición al endpoint de health
  http.get('http://localhost:3000/health', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\n✅ Prueba exitosa!');
      console.log('Status Code:', res.statusCode);
      console.log('Response:', data);
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('\n❌ Error en la prueba:', err.message);
    process.exit(1);
  });
}, 3000);

console.log('Esperando 3 segundos para que el servidor inicie...');
