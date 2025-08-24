# SportPlanner Project Setup Script
# Este script configura el entorno de desarrollo completo

Write-Host "🚀 Configurando SportPlanner..." -ForegroundColor Green

# Verificar requisitos previos
Write-Host "📋 Verificando requisitos previos..." -ForegroundColor Yellow

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Por favor instala Node.js 18+" -ForegroundColor Red
    exit 1
}

# Verificar .NET 8
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET encontrado: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET 8 SDK no encontrado. Por favor instala .NET 8 SDK" -ForegroundColor Red
    exit 1
}

# Verificar Angular CLI
try {
    $ngVersion = ng version --skip-git 2>$null
    Write-Host "✅ Angular CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Angular CLI no encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g @angular/cli@20
}

# Configurar Frontend
Write-Host "🎨 Configurando Frontend (Angular 20)..." -ForegroundColor Yellow
Set-Location "src/front/SportPlanner"

# Verificar estructura Angular existente
if (Test-Path "src") {
    Write-Host "✅ Proyecto Angular ya configurado" -ForegroundColor Green
} else {
    Write-Host "❌ Estructura Angular no encontrada" -ForegroundColor Red
    Write-Host "Por favor, verifica que el proyecto Angular esté en src/front/SportPlanner" -ForegroundColor Yellow
}

# Instalar dependencias del frontend
if (Test-Path "package.json") {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencias del frontend instaladas" -ForegroundColor Green
    } else {
        Write-Host "❌ Error instalando dependencias del frontend" -ForegroundColor Red
    }
}

# Volver al directorio raíz
Set-Location "../../.."

# Configurar Backend
Write-Host "⚙️ Configurando Backend (.NET 8)..." -ForegroundColor Yellow
Set-Location "src/backend"

# Crear estructura de proyectos .NET
if (!(Test-Path "SportPlanner.Core")) {
    Write-Host "📁 Creando estructura de proyectos .NET..." -ForegroundColor Cyan
    
    # Crear proyectos de Clean Architecture
    dotnet new classlib -n "SportPlanner.Core" --force
    dotnet new classlib -n "SportPlanner.Application" --force
    dotnet new classlib -n "SportPlanner.Infrastructure" --force
    
    # Agregar referencias entre proyectos
    dotnet add "SportPlanner.Application" reference "SportPlanner.Core"
    dotnet add "SportPlanner.Infrastructure" reference "SportPlanner.Core"
    dotnet add "SportPlanner.Infrastructure" reference "SportPlanner.Application"
    
    Write-Host "✅ Estructura de proyectos .NET creada" -ForegroundColor Green
}

# Restaurar paquetes NuGet
if (Test-Path "SportPlanner.Api.csproj") {
    Write-Host "📦 Restaurando paquetes NuGet..." -ForegroundColor Cyan
    dotnet restore
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Paquetes NuGet restaurados" -ForegroundColor Green
    } else {
        Write-Host "❌ Error restaurando paquetes NuGet" -ForegroundColor Red
    }
}

# Volver al directorio raíz
Set-Location "../.."

# Configurar variables de entorno
Write-Host "🔧 Configurando variables de entorno..." -ForegroundColor Yellow

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado desde .env.example" -ForegroundColor Green
    Write-Host "⚠️ Por favor, configura las variables en el archivo .env" -ForegroundColor Yellow
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Crear directorios adicionales
Write-Host "📁 Creando directorios adicionales..." -ForegroundColor Yellow

$directories = @(
    "logs",
    "uploads",
    "temp",
    "backups"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Directorio '$dir' creado" -ForegroundColor Green
    }
}

# Crear archivo .gitignore si no existe
if (!(Test-Path ".gitignore")) {
    Write-Host "📝 Creando archivo .gitignore..." -ForegroundColor Cyan
    
    $gitignoreContent = @"
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
dist/
build/
bin/
obj/

# Environment files
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Uploads
uploads/
temp/

# Database
*.db
*.sqlite

# .NET
*.user
*.suo
*.cache
*.docstates
[Bb]in/
[Oo]bj/
[Dd]ebug/
[Rr]elease/

# Angular
.angular/

# Backup files
backups/
"@
    
    $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ Archivo .gitignore creado" -ForegroundColor Green
}

# Resumen final
Write-Host ""
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Configura las variables en el archivo .env" -ForegroundColor White
Write-Host "2. Configura tu proyecto Supabase" -ForegroundColor White
Write-Host "3. Ejecuta las migraciones de base de datos" -ForegroundColor White
Write-Host "4. Inicia el desarrollo:" -ForegroundColor White
Write-Host "   - Frontend: cd src/front/SportPlanner && npm start" -ForegroundColor Cyan
Write-Host "   - Backend: cd src/backend && dotnet run" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentación disponible en:" -ForegroundColor Yellow
Write-Host "   - .claude/specs/sportplanner/" -ForegroundColor Cyan
Write-Host "   - .claude/project-state/" -ForegroundColor Cyan
Write-Host ""
Write-Host "¡Feliz desarrollo! 🚀" -ForegroundColor Green