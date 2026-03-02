# Configuración de Proxy - Resumen Rápido

## ✅ Cambios Realizados

El backend ahora soporta tanto desarrollo local como producción con proxy reverso.

## Configuración Rápida

### Local (Desarrollo)

**`.env`:**
```env
PORT=3000
NODE_ENV=development
BASE_PATH=
FRONTEND_URL=http://localhost:5173
```

**URLs:**
- API: `http://localhost:3000/api/products`
- Uploads: `http://localhost:3000/uploads/imagen.jpg`
- Health: `http://localhost:3000/health`

### Producción (Con Proxy)

**`.env.production`:**
```env
PORT=3000
NODE_ENV=production
BASE_PATH=/backendwinder
FRONTEND_URL=https://rifaslsv.com
```

**URLs:**
- API: `https://rifaslsv.com/backendwinder/api/products`
- Uploads: `https://rifaslsv.com/backendwinder/uploads/imagen.jpg`
- Health: `https://rifaslsv.com/backendwinder/health`

## Características

### ✅ Rutas Dinámicas
- Todas las rutas se ajustan automáticamente según `BASE_PATH`
- Compatible con local y producción sin cambios de código

### ✅ CORS Mejorado
- Soporta múltiples orígenes
- Configuración flexible para desarrollo y producción
- Permite requests sin origin (mobile apps)

### ✅ Archivos Estáticos
- Uploads servidos correctamente con el proxy
- Headers de cache optimizados
- CORS configurado para acceso público

### ✅ Trust Proxy
- Obtiene la IP real del cliente detrás del proxy
- Necesario para rate limiting y logs

### ✅ Health Check Mejorado
- Muestra información del entorno
- Indica si el proxy está habilitado
- Útil para monitoreo

## Configuración del Proxy (Nginx)

```nginx
location /backendwinder/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Testing

### 1. Test Local

```bash
# Iniciar servidor
npm run dev

# Test health
curl http://localhost:3000/health

# Test API
curl http://localhost:3000/api/products
```

### 2. Test Producción

```bash
# Test health
curl https://rifaslsv.com/backendwinder/health

# Test API
curl https://rifaslsv.com/backendwinder/api/products

# Test uploads
curl -I https://rifaslsv.com/backendwinder/uploads/placeholder-1.jpg
```

## Actualizar Frontend

El frontend debe usar la URL correcta según el entorno:

**`.env.local` (desarrollo):**
```env
VITE_API_URL=http://localhost:3000
```

**`.env.production` (producción):**
```env
VITE_API_URL=https://rifaslsv.com/backendwinder
```

## Archivos Modificados

1. ✅ `src/app.js` - Soporte para proxy y rutas dinámicas
2. ✅ `.env.example` - Variable `BASE_PATH` agregada
3. ✅ `.env.production.example` - Configuración de producción
4. ✅ `DEPLOYMENT.md` - Guía completa de despliegue
5. ✅ `PROXY_SETUP.md` - Este archivo (resumen rápido)

## Troubleshooting

**Problema:** 404 en todas las rutas
- **Solución:** Verificar que `BASE_PATH=/backendwinder` en `.env.production`

**Problema:** CORS error
- **Solución:** Verificar que `FRONTEND_URL` sea correcto en `.env.production`

**Problema:** Imágenes no cargan
- **Solución:** Verificar configuración del proxy para archivos estáticos

**Problema:** IP del cliente incorrecta
- **Solución:** Verificar que `trust proxy` esté habilitado en producción

## Comandos Útiles

```bash
# Ver configuración actual
curl http://localhost:3000/health

# Ver logs en producción (PM2)
pm2 logs windershop4-backend

# Reiniciar en producción
pm2 restart windershop4-backend

# Ver estado
pm2 status
```

## Próximos Pasos

1. Configurar el proxy en el servidor
2. Copiar `.env.production.example` a `.env.production`
3. Configurar variables de entorno
4. Desplegar con PM2 o systemd
5. Actualizar frontend con la URL de producción
6. Verificar health check
7. Probar todas las rutas

Ver `DEPLOYMENT.md` para instrucciones detalladas.
