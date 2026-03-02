# Información sobre .gitignore

## Archivos y Carpetas Ignorados

### 📦 Node.js
- `node_modules/` - Dependencias (se instalan con npm install)
- Logs de npm, yarn, pnpm

### 🔐 Variables de Entorno
- `.env` y variantes - Contienen información sensible
- **IMPORTANTE**: Nunca subir archivos .env al repositorio

### 💾 Base de Datos
- `*.sqlite`, `*.db` - Archivos de base de datos SQLite
- Cada desarrollador debe crear su propia BD local

### 📁 Uploads
- `uploads/*` - Imágenes subidas por usuarios
- **Excepción**: Se mantienen los placeholders
- Cada entorno debe tener sus propias imágenes

### 📝 Logs
- Todos los archivos de log
- Se generan automáticamente durante desarrollo

### 🧪 Testing
- `coverage/` - Reportes de cobertura de tests
- `.nyc_output/` - Datos de cobertura

### 🏗️ Build
- `dist/`, `build/` - Archivos compilados
- Se generan con comandos de build

### 💻 Sistema Operativo
- `.DS_Store` (macOS)
- `Thumbs.db` (Windows)
- Archivos temporales de Linux

### 🛠️ IDEs
- `.vscode/`, `.idea/` - Configuraciones de editores
- Archivos temporales de Vim, Emacs, Sublime

### 🔒 Seguridad
- `*.pem`, `*.key` - Claves privadas
- `*.cert`, `*.crt` - Certificados
- Carpeta `secrets/`

## Archivos que SÍ se Versionan

✅ Código fuente (`src/`)
✅ Configuración del proyecto (`package.json`)
✅ README y documentación
✅ `.env.example` (plantilla sin datos sensibles)
✅ `uploads/.gitkeep` (mantiene la carpeta)
✅ Placeholders de imágenes

## Buenas Prácticas

### 1. Variables de Entorno
```bash
# Crear .env desde el ejemplo
cp .env.example .env

# Editar con tus valores locales
nano .env
```

### 2. Base de Datos
```bash
# Crear BD local
npm run seed
```

### 3. Uploads
- Las imágenes de producción NO se versionan
- Usar servicios de almacenamiento (S3, Cloudinary) en producción
- En desarrollo, cada uno sube sus propias imágenes de prueba

### 4. Lock Files
Los archivos `package-lock.json`, `yarn.lock` están comentados en el .gitignore.
- **Recomendado**: Versionarlos para garantizar versiones exactas
- Si trabajas solo, puedes ignorarlos

## Comandos Útiles

```bash
# Ver archivos ignorados
git status --ignored

# Limpiar archivos ignorados
git clean -fdX

# Verificar si un archivo está ignorado
git check-ignore -v archivo.txt

# Forzar agregar un archivo ignorado (no recomendado)
git add -f archivo.txt
```

## Estructura Recomendada del Repositorio

```
windershop4-backend/
├── .env.example          ✅ Versionado
├── .env                  ❌ Ignorado
├── .gitignore           ✅ Versionado
├── package.json         ✅ Versionado
├── package-lock.json    ✅ Versionado (recomendado)
├── README.md            ✅ Versionado
├── src/                 ✅ Versionado
├── node_modules/        ❌ Ignorado
├── database.sqlite      ❌ Ignorado
├── uploads/             
│   ├── .gitkeep        ✅ Versionado
│   ├── placeholder-*.jpg ✅ Versionado
│   └── user-uploads/   ❌ Ignorado
└── logs/               ❌ Ignorado
```

## Seguridad

⚠️ **NUNCA subir al repositorio:**
- Contraseñas
- API keys
- Tokens de autenticación
- Certificados privados
- Datos de usuarios reales
- Archivos de base de datos con datos reales

✅ **Usar en su lugar:**
- Variables de entorno
- Servicios de gestión de secretos
- Archivos .example como plantillas
