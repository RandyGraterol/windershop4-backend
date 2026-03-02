# Windershop4 Backend

Backend REST API para e-commerce de camisas construido con Express.js, SQLite y Sequelize.

## Estructura del Proyecto

```
windershop4-backend/
├── src/
│   ├── config/          # Configuraciones (database, jwt, multer)
│   ├── models/          # Modelos de Sequelize
│   ├── middleware/      # Middleware de Express
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── utils/           # Utilidades
│   └── seeders/         # Datos iniciales
├── uploads/             # Imágenes de productos
├── tests/               # Tests
│   ├── unit/           # Tests unitarios
│   ├── property/       # Property-based tests
│   └── integration/    # Tests de integración
├── .env                 # Variables de entorno (crear desde .env.example)
└── server.js            # Punto de entrada

```

## Instalación

```bash
npm install
```

## Configuración

Copiar `.env.example` a `.env` y configurar las variables:

```bash
cp .env.example .env
```

## Datos Iniciales (Seed)

El sistema incluye un seeder que crea datos iniciales:
- Usuario administrador (admin/admin123)
- Configuración de WhatsApp por defecto
- 8 productos de ejemplo

### Ejecutar Seed

```bash
# Ejecutar seed (mantiene datos existentes)
npm run seed

# Resetear BD y ejecutar seed desde cero
npm run seed:fresh
```

**Nota:** El seed se ejecuta automáticamente al iniciar el servidor con `npm start` o `npm run dev`.

### Datos Creados

**Usuario Admin:**
- Username: `admin`
- Password: `admin123`

**Productos de Ejemplo:**
- 8 productos variados (camisas, polos, camisetas)
- Precios entre $29.99 y $69.99
- Con categorías, descripciones, tallas y colores
- Algunos marcados como destacados (featured)

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Testing

```bash
# Todos los tests
npm test

# Tests unitarios
npm run test:unit

# Property-based tests
npm run test:property

# Con cobertura
npm run test:coverage
```
