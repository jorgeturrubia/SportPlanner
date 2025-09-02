# Guía de Deployment - SportPlanner

## Descripción General

Esta guía cubre el deployment completo de SportPlanner en diferentes entornos, desde desarrollo hasta producción. La aplicación consta de tres componentes principales que requieren despliegue coordinado: Frontend (Angular), Backend (ASP.NET Core) y Base de Datos (PostgreSQL).

## Arquitecturas de Deployment

### Opción 1: Traditional Hosting (IIS + Linux VPS)
```
Internet → Nginx/IIS → Angular (Static Files)
       → Nginx/IIS → ASP.NET Core API
       → PostgreSQL Server
       → Supabase (Authentication)
```

### Opción 2: Cloud Hosting (Azure/AWS)
```
CDN → Static Web Apps (Angular)
    → App Service (ASP.NET Core)
    → Azure Database for PostgreSQL
    → Supabase (Authentication)
```

### Opción 3: Containerized (Docker + Kubernetes)
```
Load Balancer → Frontend Container (Nginx + Angular)
              → Backend Container (ASP.NET Core)
              → PostgreSQL Container/Managed DB
              → Supabase (Authentication)
```

## Preparación para Producción

### 1. Configuración de Entornos

#### Backend - appsettings.Production.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Error"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=prod-db-server;Database=sportplanner_prod;Username=sportplanner_user;Password=${DB_PASSWORD};SslMode=Require;"
  },
  "Supabase": {
    "Url": "${SUPABASE_URL}",
    "Key": "${SUPABASE_ANON_KEY}",
    "JwtSecret": "${SUPABASE_JWT_SECRET}"
  },
  "AllowedHosts": "*.sportplanner.com,sportplanner.com"
}
```

#### Frontend - environment.production.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.sportplanner.com',
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key-here'
};
```

### 2. Variables de Entorno de Producción

#### Backend (ASP.NET Core)
```bash
# Base de datos
DB_PASSWORD=your-secure-database-password

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Aplicación
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=https://+:443;http://+:80
ASPNETCORE_HTTPS_PORT=443
```

#### Frontend Build
```bash
# Variables para build
NODE_ENV=production
NG_CLI_ANALYTICS=false
```

## Deployment Tradicional (IIS/Linux)

### 1. Preparar Base de Datos de Producción

#### Crear Base de Datos PostgreSQL
```sql
-- Conectar como superusuario
CREATE USER sportplanner_prod WITH PASSWORD 'secure_password_2024!';
CREATE DATABASE sportplanner_prod OWNER sportplanner_prod;

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE sportplanner_prod TO sportplanner_prod;
GRANT ALL ON SCHEMA public TO sportplanner_prod;

-- Configurar conexiones SSL (recomendado)
ALTER SYSTEM SET ssl = on;
SELECT pg_reload_conf();
```

#### Ejecutar Migraciones en Producción
```bash
# Desde el directorio del backend
cd src/back/SportPlanner/SportPlanner

# Generar script de migración
dotnet ef migrations script --output migration.sql

# O aplicar directamente (requiere acceso a BD)
dotnet ef database update --connection "Host=prod-server;Database=sportplanner_prod;Username=sportplanner_prod;Password=secure_password_2024!"
```

### 2. Backend - ASP.NET Core

#### Build para Producción
```bash
cd src/back/SportPlanner/SportPlanner

# Compilar en modo Release
dotnet publish -c Release -o ./publish

# Verificar archivos generados
ls -la ./publish/
```

#### Deployment en IIS (Windows)
```xml
<!-- web.config generado automáticamente -->
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\SportPlanner.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
    </system.webServer>
  </location>
</configuration>
```

#### Deployment en Linux (Systemd)
```ini
# /etc/systemd/system/sportplanner.service
[Unit]
Description=SportPlanner ASP.NET Core Web API
After=network.target

[Service]
WorkingDirectory=/var/www/sportplanner/api
ExecStart=/usr/bin/dotnet SportPlanner.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=sportplanner-api
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar servicio
sudo systemctl enable sportplanner.service
sudo systemctl start sportplanner.service
sudo systemctl status sportplanner.service
```

#### Configuración Nginx (Reverse Proxy)
```nginx
# /etc/nginx/sites-available/sportplanner-api
server {
    listen 80;
    server_name api.sportplanner.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.sportplanner.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin https://sportplanner.com;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    }
}
```

### 3. Frontend - Angular

#### Build para Producción
```bash
cd src/front/SportPlanner

# Build optimizado para producción
ng build --configuration production

# Verificar output
ls -la dist/SportPlanner/browser/
```

#### Deployment Files
```bash
dist/SportPlanner/
├── browser/                 # Archivos del cliente (subir al servidor web)
│   ├── index.html
│   ├── main-[hash].js
│   ├── polyfills-[hash].js
│   ├── styles-[hash].css
│   └── assets/
└── server/                 # Para SSR (opcional)
    └── server.mjs
```

#### Configuración Nginx (Frontend)
```nginx
# /etc/nginx/sites-available/sportplanner-frontend
server {
    listen 80;
    server_name sportplanner.com www.sportplanner.com;
    return 301 https://sportplanner.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.sportplanner.com;
    return 301 https://sportplanner.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sportplanner.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/sportplanner/frontend;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Angular routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # No cache for index.html
        location = /index.html {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
```

## Cloud Deployment (Azure)

### 1. Azure App Service (Backend)

#### Crear App Service
```bash
# Azure CLI
az login
az group create --name sportplanner-rg --location "East US"

# Crear App Service Plan
az appservice plan create \
    --name sportplanner-plan \
    --resource-group sportplanner-rg \
    --sku B1 \
    --is-linux

# Crear Web App
az webapp create \
    --resource-group sportplanner-rg \
    --plan sportplanner-plan \
    --name sportplanner-api \
    --runtime "DOTNETCORE:8.0"
```

#### Configurar Variables de Entorno
```bash
# Configurar app settings
az webapp config appsettings set \
    --resource-group sportplanner-rg \
    --name sportplanner-api \
    --settings \
        ASPNETCORE_ENVIRONMENT=Production \
        ConnectionStrings__DefaultConnection="Server=your-db-server;Database=sportplanner;User Id=user;Password=password;" \
        Supabase__Url="https://your-project.supabase.co" \
        Supabase__Key="your-key"
```

#### Deploy con GitHub Actions
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to Azure

on:
  push:
    branches: [ main ]
    paths: [ 'src/back/**' ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
        
    - name: Restore dependencies
      run: dotnet restore src/back/SportPlanner/SportPlanner.sln
      
    - name: Build
      run: dotnet build src/back/SportPlanner/SportPlanner.sln --no-restore -c Release
      
    - name: Test
      run: dotnet test src/back/SportPlanner/SportPlanner.sln --no-build --verbosity normal
      
    - name: Publish
      run: dotnet publish src/back/SportPlanner/SportPlanner/SportPlanner.csproj -c Release -o ${{env.DOTNET_ROOT}}/myapp
      
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'sportplanner-api'
        slot-name: 'production'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ${{env.DOTNET_ROOT}}/myapp
```

### 2. Azure Static Web Apps (Frontend)

#### Configuración automatizada
```yaml
# .github/workflows/deploy-frontend.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [ main ]
    paths: [ 'src/front/**' ]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [ main ]

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "src/front/SportPlanner"
          api_location: ""
          output_location: "dist/SportPlanner/browser"
          app_build_command: "npm run build -- --configuration production"
```

### 3. Azure Database for PostgreSQL

```bash
# Crear servidor PostgreSQL
az postgres flexible-server create \
    --resource-group sportplanner-rg \
    --name sportplanner-db-server \
    --location eastus \
    --admin-user sportplanner \
    --admin-password "SecurePassword123!" \
    --sku-name Standard_B1ms \
    --version 14 \
    --storage-size 32

# Configurar firewall (permitir Azure services)
az postgres flexible-server firewall-rule create \
    --resource-group sportplanner-rg \
    --name sportplanner-db-server \
    --rule-name AllowAzureServices \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# Crear base de datos
az postgres flexible-server db create \
    --resource-group sportplanner-rg \
    --server-name sportplanner-db-server \
    --database-name sportplanner
```

## Deployment con Docker

### 1. Backend Dockerfile

```dockerfile
# src/back/SportPlanner/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SportPlanner/SportPlanner.csproj", "SportPlanner/"]
RUN dotnet restore "SportPlanner/SportPlanner.csproj"
COPY . .
WORKDIR "/src/SportPlanner"
RUN dotnet build "SportPlanner.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SportPlanner.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SportPlanner.dll"]
```

### 2. Frontend Dockerfile

```dockerfile
# src/front/SportPlanner/Dockerfile
# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/dist/SportPlanner/browser /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER 1001

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose para Desarrollo/Testing

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: sportplanner
      POSTGRES_USER: sportplanner
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - sportplanner-network

  # Backend API
  api:
    build:
      context: ./src/back/SportPlanner
      dockerfile: Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=sportplanner;Username=sportplanner;Password=password
      - Supabase__Url=${SUPABASE_URL}
      - Supabase__Key=${SUPABASE_KEY}
    ports:
      - "5000:80"
    depends_on:
      - postgres
    networks:
      - sportplanner-network

  # Frontend
  frontend:
    build:
      context: ./src/front/SportPlanner
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - api
    networks:
      - sportplanner-network

volumes:
  postgres_data:

networks:
  sportplanner-network:
    driver: bridge
```

### 4. Comandos Docker

```bash
# Build y ejecutar todos los servicios
docker-compose up --build

# Solo backend
docker-compose up postgres api

# Logs de servicios específicos
docker-compose logs -f api

# Ejecutar migraciones
docker-compose exec api dotnet ef database update

# Parar y limpiar
docker-compose down -v
```

## CI/CD Pipeline Completo

### GitHub Actions - Pipeline Completo

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: sportplanner_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v4
    
    # Backend tests
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
        
    - name: Run backend tests
      run: |
        cd src/back/SportPlanner
        dotnet test --logger trx --collect:"XPlat Code Coverage"
        
    # Frontend tests
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: src/front/SportPlanner/package-lock.json
        
    - name: Install frontend dependencies
      run: |
        cd src/front/SportPlanner
        npm ci
        
    - name: Run frontend tests
      run: |
        cd src/front/SportPlanner
        npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Build and push Docker images
      run: |
        # Backend
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-api:latest ./src/back/SportPlanner
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-api:latest
        
        # Frontend
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest ./src/front/SportPlanner
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        # Aquí irían los comandos de deployment específicos
        # Por ejemplo, kubectl, terraform, o scripts de deployment
        echo "Deploying to production..."
```

## Monitoreo y Logging

### 1. Application Insights (Azure)

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry();

// Logging customizado
builder.Services.AddLogging(logging =>
{
    logging.AddApplicationInsights();
    if (builder.Environment.IsDevelopment())
    {
        logging.AddConsole();
        logging.AddDebug();
    }
});
```

### 2. Health Checks

```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString)
    .AddCheck<SupabaseHealthCheck>("supabase");

// Middleware
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
```

### 3. Structured Logging

```csharp
// Ejemplo de logging en controladores
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    using var scope = _logger.BeginScope(new Dictionary<string, object>
    {
        ["Action"] = "Login",
        ["Email"] = request.Email,
        ["Timestamp"] = DateTimeOffset.UtcNow
    });
    
    _logger.LogInformation("Login attempt started");
    
    try
    {
        var result = await _authService.AuthenticateAsync(request);
        _logger.LogInformation("Login successful");
        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Login failed");
        return Unauthorized();
    }
}
```

## Checklist de Deployment

### Pre-Deployment
- [ ] Configurar variables de entorno de producción
- [ ] Verificar conexiones de base de datos
- [ ] Validar certificados SSL
- [ ] Ejecutar tests completos
- [ ] Backup de base de datos existente
- [ ] Verificar configuración de Supabase

### Deployment
- [ ] Deploy de base de datos (migraciones)
- [ ] Deploy de backend (API)
- [ ] Deploy de frontend (aplicación web)
- [ ] Verificar health checks
- [ ] Validar endpoints críticos
- [ ] Verificar logging y monitoreo

### Post-Deployment
- [ ] Smoke tests en producción
- [ ] Verificar métricas de performance
- [ ] Confirmar funcionalidad de autenticación
- [ ] Revisar logs por errores
- [ ] Notificar a stakeholders
- [ ] Documentar cambios deployados

---

*Guía de deployment para SportPlanner v1.0 - Deployment en múltiples entornos y plataformas*