# Guía de Desarrollo - SportPlanner

## Requisitos del Sistema

### Herramientas Requeridas

#### Backend (.NET)
- **[.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)**: ≥ 8.0.0
- **[PostgreSQL](https://www.postgresql.org/download/)**: ≥ 14.0
- **[Visual Studio 2022](https://visualstudio.microsoft.com/vs/)** o **[Visual Studio Code](https://code.visualstudio.com/)**
- **[Git](https://git-scm.com/)**: Para control de versiones

#### Frontend (Angular)
- **[Node.js](https://nodejs.org/)**: ≥ 18.18.0 (LTS recomendado)
- **[npm](https://www.npmjs.com/)**: ≥ 10.0.0 (incluido con Node.js)
- **[Angular CLI](https://angular.io/cli)**: ≥ 20.0.0

#### Base de Datos
- **PostgreSQL Server**: ≥ 14.0
- **pgAdmin** (opcional): Para administración visual de BD

#### Servicios Externos
- **[Supabase Account](https://supabase.com/)**: Para autenticación JWT
- **[Git](https://git-scm.com/)**: Para control de versiones

### Verificación de Requisitos

```bash
# Verificar versiones instaladas
node --version          # ≥ 18.18.0
npm --version           # ≥ 10.0.0
dotnet --version        # ≥ 8.0.0
git --version          # Cualquier versión reciente
psql --version         # ≥ 14.0
```

## Setup del Entorno de Desarrollo

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sportplanner.git
cd sportplanner
```

### 2. Configurar Base de Datos PostgreSQL

#### Instalar PostgreSQL
```bash
# Windows (usando winget)
winget install PostgreSQL.PostgreSQL

# macOS (usando Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Crear Base de Datos
```bash
# Conectar a PostgreSQL como superusuario
sudo -u postgres psql

# Dentro de psql, crear usuario y base de datos
CREATE USER sportplanner_dev WITH PASSWORD 'password_dev_2024';
CREATE DATABASE sportplanner_dev OWNER sportplanner_dev;
GRANT ALL PRIVILEGES ON DATABASE sportplanner_dev TO sportplanner_dev;
\q
```

### 3. Configurar Variables de Entorno

#### Backend - appsettings.Development.json
Crear archivo en `/src/back/SportPlanner/SportPlanner/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sportplanner_dev;Username=sportplanner_dev;Password=password_dev_2024"
  },
  "Supabase": {
    "Url": "https://tu-proyecto.supabase.co",
    "Key": "tu-supabase-anon-key",
    "JwtSecret": "tu-jwt-secret"
  },
  "AllowedHosts": "*"
}
```

#### Frontend - environment.development.ts
Crear archivo en `/src/front/SportPlanner/src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api',
  supabaseUrl: 'https://tu-proyecto.supabase.co',
  supabaseAnonKey: 'tu-supabase-anon-key'
};
```

### 4. Configurar Supabase

#### Crear Proyecto en Supabase
1. Ir a [https://supabase.com/](https://supabase.com/)
2. Crear nueva cuenta o iniciar sesión
3. Crear nuevo proyecto
4. Copiar URL y Anon Key desde Settings > API

#### Configuración de Autenticación
1. En Supabase Dashboard: Authentication > Settings
2. Configurar Site URL: `http://localhost:4200`
3. Agregar redirect URLs:
   - `http://localhost:4200/auth/callback`
   - `https://localhost:7000/auth/callback`

## Instalación de Dependencias

### Backend (.NET)

```bash
# Navegar al directorio del backend
cd src/back/SportPlanner/SportPlanner

# Restaurar paquetes NuGet
dotnet restore

# Verificar que no hay errores
dotnet build
```

### Frontend (Angular)

```bash
# Navegar al directorio del frontend
cd src/front/SportPlanner

# Instalar Angular CLI globalmente (si no está instalado)
npm install -g @angular/cli@20

# Instalar dependencias del proyecto
npm install

# Verificar instalación
ng version
```

## Migraciones de Base de Datos

### Ejecutar Migraciones Existentes

```bash
# Desde el directorio del backend
cd src/back/SportPlanner/SportPlanner

# Aplicar migraciones existentes
dotnet ef database update

# Verificar que las tablas se crearon correctamente
# Conectar a la base de datos y ejecutar:
# \dt para listar tablas en psql
```

### Crear Nueva Migración (cuando sea necesario)

```bash
# Generar nueva migración después de cambios en modelos
dotnet ef migrations add NombreDeLaMigracion

# Aplicar la nueva migración
dotnet ef database update
```

### Comandos Útiles de Entity Framework

```bash
# Ver migraciones pendientes
dotnet ef migrations list

# Revertir a migración específica
dotnet ef database update MigracionAnterior

# Generar script SQL de migración
dotnet ef migrations script

# Eliminar última migración (solo si no se aplicó)
dotnet ef migrations remove
```

## Ejecutar la Aplicación

### Desarrollo - Ambos Servicios Simultáneamente

#### Terminal 1 - Backend
```bash
cd src/back/SportPlanner/SportPlanner
dotnet watch run
```
La API estará disponible en: `https://localhost:7000`
Swagger UI: `https://localhost:7000/swagger`

#### Terminal 2 - Frontend
```bash
cd src/front/SportPlanner
ng serve
```
La aplicación estará disponible en: `http://localhost:4200`

### Opciones de Desarrollo

#### Backend con Hot Reload
```bash
# Desarrollo con recarga automática
dotnet watch run

# Desarrollo sin HTTPS (opcional)
dotnet run --urls="http://localhost:5000"

# Modo release para testing de performance
dotnet run --configuration Release
```

#### Frontend con Configuraciones Específicas
```bash
# Desarrollo estándar
ng serve

# Con puerto específico
ng serve --port 4201

# Con configuración de producción
ng serve --configuration production

# Con SSL (requiere certificados)
ng serve --ssl --ssl-cert path/to/cert.pem --ssl-key path/to/key.pem

# Build para producción
ng build --configuration production
```

## Testing

### Backend - Tests Unitarios

```bash
cd src/back/SportPlanner/SportPlanner

# Ejecutar todos los tests
dotnet test

# Con coverage
dotnet test --collect:"XPlat Code Coverage"

# Tests específicos
dotnet test --filter "TestMethod"

# Tests en modo watch
dotnet watch test
```

### Frontend - Tests con Karma/Jasmine

```bash
cd src/front/SportPlanner

# Tests unitarios
ng test

# Tests en modo headless (CI)
ng test --watch=false --browsers=ChromeHeadless

# Tests con coverage
ng test --code-coverage

# E2E tests (cuando estén configurados)
ng e2e
```

## Debugging

### Backend - Visual Studio/VS Code

#### Visual Studio 2022
1. Abrir `/src/back/SportPlanner/SportPlanner.sln`
2. Configurar proyecto de inicio
3. F5 para debug o Ctrl+F5 para ejecutar sin debug

#### Visual Studio Code
1. Instalar extensión C# Dev Kit
2. Abrir carpeta del backend
3. Configurar launch.json:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/bin/Debug/net8.0/SportPlanner.dll",
      "args": [],
      "cwd": "${workspaceFolder}",
      "stopAtEntry": false,
      "serverReadyAction": {
        "action": "openExternally",
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
      },
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "sourceFileMap": {
        "/Views": "${workspaceFolder}/Views"
      }
    }
  ]
}
```

### Frontend - Chrome DevTools

#### Angular DevTools
1. Instalar [Angular DevTools](https://angular.io/guide/devtools) extension
2. Abrir Chrome DevTools (F12)
3. Tab "Angular" para debugging de componentes

#### Debugging de Aplicación
```bash
# Servir con source maps para debugging
ng serve --source-map

# Build de debug con más información
ng build --configuration development
```

## Code Quality y Linting

### Backend - .NET Standards

```bash
# Análisis estático con .NET analyzers
dotnet build --verbosity normal

# Formateo de código
dotnet format

# Verificar estilo de código
dotnet format --verify-no-changes
```

### Frontend - ESLint y Prettier

```bash
cd src/front/SportPlanner

# Verificar linting
ng lint

# Formatear código con Prettier
npx prettier --write "src/**/*.{ts,html,css,scss,json}"

# Verificar TypeScript
npx tsc --noEmit
```

### Configuración de EditorConfig
Crear `.editorconfig` en la raíz del proyecto:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{cs,vb}]
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

## Estructura de Trabajo Recomendada

### Git Workflow

#### Branch Strategy
```bash
main                 # Rama principal (producción)
├── develop         # Rama de desarrollo
├── feature/xxx     # Nuevas funcionalidades
├── bugfix/xxx      # Corrección de bugs
└── hotfix/xxx      # Fixes urgentes para producción
```

#### Comandos Git Típicos
```bash
# Crear nueva feature branch
git checkout -b feature/nueva-funcionalidad develop

# Commit con mensaje descriptivo
git add .
git commit -m "feat: agregar autenticación de usuarios"

# Push de la nueva rama
git push -u origin feature/nueva-funcionalidad

# Merge a develop (después de PR review)
git checkout develop
git merge --no-ff feature/nueva-funcionalidad
git branch -d feature/nueva-funcionalidad
```

### Daily Development Workflow

```bash
# 1. Actualizar código
git checkout develop
git pull origin develop

# 2. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 3. Ejecutar aplicación en desarrollo
# Terminal 1:
cd src/back/SportPlanner/SportPlanner && dotnet watch run

# Terminal 2:
cd src/front/SportPlanner && ng serve

# 4. Desarrollar y testear
# Hacer cambios...
dotnet test                    # Backend tests
ng test --watch=false          # Frontend tests

# 5. Commit y push
git add .
git commit -m "feat: descripción del cambio"
git push -u origin feature/nueva-funcionalidad
```

## Troubleshooting Común

### Problemas de Base de Datos

```bash
# Error de conexión a PostgreSQL
# Verificar que el servicio esté ejecutándose
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Recrear base de datos si hay problemas
dropdb sportplanner_dev
createdb sportplanner_dev -O sportplanner_dev
dotnet ef database update
```

### Problemas de Dependencias

```bash
# Backend - limpiar y restaurar
dotnet clean
dotnet restore
rm -rf bin obj
dotnet build

# Frontend - limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Problemas de CORS

Si hay errores de CORS, verificar:
1. Configuración en `Program.cs` del backend
2. URLs correctas en `environment.ts` del frontend
3. Configuración de Supabase para las URLs correctas

### Problemas de SSL/HTTPS

```bash
# Generar certificados de desarrollo para .NET
dotnet dev-certs https --trust

# Para problemas persistentes de certificados
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

## Herramientas de Desarrollo Recomendadas

### Visual Studio Code Extensions

#### Esenciales
- **C# Dev Kit**: Desarrollo .NET completo
- **Angular Language Service**: Soporte completo para Angular
- **Angular Snippets**: Snippets útiles para Angular
- **Auto Rename Tag**: Renombrado automático de tags HTML
- **Bracket Pair Colorizer**: Colores para brackets matching
- **GitLens**: Git supercharged para VS Code
- **Prettier**: Formateo automático de código
- **ESLint**: Linting para TypeScript/JavaScript
- **Thunder Client**: Cliente REST integrado (alternativa a Postman)

#### Productividad
- **Auto Import - ES6**: Imports automáticos
- **Path Intellisense**: Autocompletado de paths
- **TODO Highlight**: Resaltar comentarios TODO
- **Better Comments**: Comentarios más legibles
- **Rest Client**: Testing de APIs directamente en VS Code

### Herramientas Externas

#### Database Management
- **pgAdmin**: Interfaz gráfica para PostgreSQL
- **DBeaver**: Cliente universal de base de datos
- **Azure Data Studio**: Cliente multiplataforma de Microsoft

#### API Testing
- **Postman**: Testing y documentación de APIs
- **Insomnia**: Cliente REST alternativo
- **Swagger UI**: Documentación interactiva (integrado en el proyecto)

#### Git GUI
- **GitKraken**: Cliente Git visual
- **SourceTree**: Cliente Git de Atlassian
- **GitHub Desktop**: Cliente oficial de GitHub

---

*Guía de desarrollo para SportPlanner v1.0 - Setup completo para desarrollo local*