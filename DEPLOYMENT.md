# Guía de Despliegue - Windershop4 Backend

## Configuración para Producción con Proxy

El backend está configurado para funcionar tanto en local como en producción detrás de un proxy reverso.

### URLs

**Local:**
- API: `http://localhost:3000/api`
- Uploads: `http://localhost:3000/uploads`
- Health: `http://localhost:3000/health`

**Producción:**
- API: `https://rifaslsv.com/backendwinder/api`
- Uploads: `https://rifaslsv.com/backendwinder/uploads`
- Health: `https://rifaslsv.com/backendwinder/health`

## Configuración del Entorno

### 1. Variables de Entorno

Crear archivo `.env.production`:

```bash
cp .env.production.example .env.production
```

Editar `.env.production`:

```env
PORT=3000
NODE_ENV=production
BASE_PATH=/backendwinder
JWT_SECRET=tu_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
DATABASE_PATH=./database.sqlite
FRONTEND_URL=https://rifaslsv.com
```

### 2. Configuración del Proxy Reverso

#### Nginx

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
    
    # Timeout para requests largos
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

#### Apache

```apache
<Location /backendwinder>
    ProxyPass http://localhost:3000
    ProxyPassReverse http://localhost:3000
    
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
</Location>
```

## Instalación en Producción

### 1. Clonar el Repositorio

```bash
cd /var/www
git clone <tu-repositorio> windershop4-backend
cd windershop4-backend
```

### 2. Instalar Dependencias

```bash
npm install --production
```

### 3. Configurar Variables de Entorno

```bash
cp .env.production.example .env.production
nano .env.production
```

### 4. Inicializar Base de Datos

```bash
npm run seed
```

### 5. Crear Carpeta de Uploads

```bash
mkdir -p uploads
chmod 755 uploads
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name windershop4-backend --env production

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### Producción con systemd

Crear archivo `/etc/systemd/system/windershop4-backend.service`:

```ini
[Unit]
Description=Windershop4 Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/windershop4-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Habilitar y iniciar:

```bash
sudo systemctl enable windershop4-backend
sudo systemctl start windershop4-backend
sudo systemctl status windershop4-backend
```

## Verificación

### 1. Health Check

```bash
# Local
curl http://localhost:3000/health

# Producción
curl https://rifaslsv.com/backendwinder/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "basePath": "/backendwinder",
  "proxy": "enabled"
}
```

### 2. Test de API

```bash
# Producción
curl https://rifaslsv.com/backendwinder/api/products
```

### 3. Test de Uploads

```bash
# Producción
curl -I https://rifaslsv.com/backendwinder/uploads/placeholder-1.jpg
```

## Actualización del Frontend

El frontend debe apuntar a la URL de producción. Actualizar `.env.production`:

```env
VITE_API_URL=https://rifaslsv.com/backendwinder
```

## Logs

### PM2

```bash
# Ver logs en tiempo real
pm2 logs windershop4-backend

# Ver logs específicos
pm2 logs windershop4-backend --lines 100
```

### systemd

```bash
# Ver logs
sudo journalctl -u windershop4-backend -f

# Ver últimas 100 líneas
sudo journalctl -u windershop4-backend -n 100
```

## Troubleshooting

### Error 404 en rutas

Verificar que `BASE_PATH` esté configurado correctamente en `.env.production`

### CORS Error

Verificar que `FRONTEND_URL` incluya el dominio correcto en `.env.production`

### Imágenes no cargan

1. Verificar permisos de carpeta `uploads/`
2. Verificar configuración del proxy para archivos estáticos
3. Verificar headers CORS en respuesta

### Proxy no funciona

1. Verificar configuración de Nginx/Apache
2. Verificar que el backend esté corriendo en el puerto correcto
3. Verificar logs del proxy: `sudo tail -f /var/log/nginx/error.log`

## Seguridad

### Checklist de Producción

- [ ] Cambiar `JWT_SECRET` a un valor aleatorio y seguro
- [ ] Configurar `NODE_ENV=production`
- [ ] Configurar HTTPS en el proxy
- [ ] Configurar firewall para bloquear acceso directo al puerto 3000
- [ ] Configurar backups automáticos de la base de datos
- [ ] Configurar rotación de logs
- [ ] Revisar permisos de archivos y carpetas
- [ ] Configurar monitoreo (uptime, errores)

## Backup

### Base de Datos

```bash
# Backup manual
cp database.sqlite database.backup.$(date +%Y%m%d_%H%M%S).sqlite

# Backup automático (cron)
0 2 * * * cd /var/www/windershop4-backend && cp database.sqlite backups/database.$(date +\%Y\%m\%d).sqlite
```

### Uploads

```bash
# Backup de imágenes
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

## Monitoreo

### PM2 Monitoring

```bash
pm2 monit
```

### Uptime Monitoring

Configurar servicios como:
- UptimeRobot
- Pingdom
- StatusCake

URL a monitorear: `https://rifaslsv.com/backendwinder/health`
