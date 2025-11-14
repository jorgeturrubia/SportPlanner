# 3.1. STACK TECNOLOGICO - SPORTPLANNER

---

## RESUMEN EJECUTIVO

**Stack seleccionado:** Full-Stack TypeScript + .NET

| Capa | Tecnologia | Version | Justificacion Principal |
|------|-----------|---------|------------------------|
| **Frontend** | Angular | 20.0+ | Framework empresarial, TypeScript nativo, ecosistema maduro |
| **Estilos** | Tailwind CSS | 4.0+ | Utility-first, rapid prototyping, bundle pequeno |
| **Canvas** | Fabric.js | 6.0+ | Manipulacion avanzada de canvas HTML5 |
| **Animaciones** | GSAP | 3.12+ | Animaciones profesionales de alta performance |
| **Backend** | .NET | 8.0 LTS | Performance excepcional, type-safe, maduro para APIs REST |
| **ORM** | Entity Framework Core | 8.0+ | ORM robusto con migraciones, integrado con .NET |
| **Base de Datos** | PostgreSQL | 15+ | ACID, JSON support, RLS (Row Level Security) |
| **BaaS** | Supabase | Latest | Auth + Storage + Realtime, PostgreSQL managed |
| **Hosting Frontend** | Vercel | - | Deploy automatico, CDN global, free tier generoso |
| **Hosting Backend** | Railway | - | PaaS simple, PostgreSQL incluido, pricing accesible |

**Filosofia:** Equilibrio entre **developer experience** (velocidad de desarrollo) y **production readiness** (escalabilidad y mantenibilidad).

---

## FRONTEND

### Angular 20+

**Version:** 20.0.0 o superior (usando standalone components)

**Paquetes principales:**

```json
{
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "rxjs": "^7.8.0",
    "tslib": "^2.6.0",
    "zone.js": "^0.14.0"
  }
}
```

**Caracteristicas clave usadas:**
- **Standalone Components:** Sin NgModules, arquitectura mas simple
- **Signals:** Nuevo sistema de reactividad (reemplazo gradual de RxJS donde tenga sentido)
- **Control Flow moderno:** `@if`, `@for`, `@switch` (sintaxis nueva vs `*ngIf`, `*ngFor`)
- **Lazy Loading:** Carga de rutas bajo demanda
- **SSR (Server-Side Rendering):** Opcional para SEO (no critico en MVP)

**Por que Angular:**
- TypeScript nativo (type-safety end-to-end)
- CLI potente (generacion de codigo, build optimizado)
- Inyeccion de dependencias nativa
- Estructura clara para equipos (aunque seas solo tu, buenas practicas)
- Ecosistema maduro (Angular Material, CDK, etc.)

---

### Tailwind CSS 4.0+

**Version:** 4.0.0 o superior

**Configuracion:**

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... paleta completa
          900: '#0c4a6e',
        },
        secondary: {
          // ... paleta complementaria
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ]
}
```

**Por que Tailwind:**
- Desarrollo rapido (utility classes)
- Bundle pequeno (solo CSS usado)
- Consistent design system
- Responsive facil
- Dark mode sencillo

**Alternativas descartadas:**
- Bootstrap: Demasiado opinionado, dificil customizar
- Material Design (Angular Material): Overhead innecesario para MVP

---

### Fabric.js 6.0+

**Version:** 6.0.0 o superior

**Uso:** Editor visual de ejercicios (canvas de cancha deportiva)

```typescript
import { Canvas, Circle, Line, Text } from 'fabric';

const canvas = new Canvas('canvas-ejercicio', {
  width: 800,
  height: 600,
  backgroundColor: '#2d5016' // verde cancha
});

// Anadir jugador
const jugador = new Circle({
  radius: 20,
  fill: 'blue',
  left: 100,
  top: 100,
  selectable: true
});

canvas.add(jugador);
```

**Caracteristicas clave usadas:**
- Manipulacion de objetos (drag & drop, resize, rotate)
- Eventos de mouse/touch
- Serializacion a JSON (guardar estado del canvas)
- Exportar a imagen (toDataURL)
- Animaciones (para preview de ejercicios)

**Por que Fabric.js:**
- API limpia y potente
- Performance excelente para canvas complejos
- Soporte para eventos tactiles (mobile)
- Serializacion nativa (guardar/cargar canvas)

**Alternativa descartada:**
- Konva.js: Mas limitado, menos maduro

---

### GSAP (GreenSock Animation Platform) 3.12+

**Version:** 3.12.0 o superior

**Uso:** Animaciones de ejercicios (movimientos de jugadores, trayectorias de balon)

```typescript
import gsap from 'gsap';

// Animar movimiento de jugador
gsap.to(jugadorElement, {
  x: 200,
  y: 150,
  duration: 2,
  ease: 'power2.inOut',
  onComplete: () => console.log('Animacion completada')
});

// Timeline para secuencia completa
const tl = gsap.timeline();
tl.to('.jugador1', { x: 100, duration: 1 })
  .to('.balon', { x: 100, y: 50, duration: 0.5 }, '-=0.5')
  .to('.jugador2', { x: 200, duration: 1 });
```

**Por que GSAP:**
- Performance superior (usa requestAnimationFrame)
- Timeline avanzados (secuencias complejas)
- Easing potente
- Control total (play, pause, reverse, seek)

**Alternativa descartada:**
- CSS Animations: Limitadas para animaciones complejas
- Angular Animations: No suficiente para canvas

---

### Librerias Auxiliares Frontend

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "date-fns": "^3.0.0",
    "lodash-es": "^4.17.21",
    "ngx-charts": "^20.1.0",
    "ngx-toastr": "^18.0.0"
  }
}
```

**Descripcion:**
- **@supabase/supabase-js:** Cliente para Supabase (auth, storage, realtime)
- **date-fns:** Manipulacion de fechas (calendario)
- **lodash-es:** Utilidades JS (debounce, groupBy, etc.)
- **ngx-charts:** Graficos (dashboard de progreso)
- **ngx-toastr:** Notificaciones toast

---

## BACKEND

### .NET 8.0 LTS

**Version:** 8.0 (Long-Term Support)

**Estructura del proyecto:**

```
SportPlanner.API/
├── Controllers/          # Endpoints REST
├── Services/             # Logica de negocio
├── Repositories/         # Acceso a datos
├── Models/               # DTOs y entidades
├── Middleware/           # Auth, logging, error handling
├── Data/                 # DbContext, migraciones
└── Program.cs            # Entry point
```

**Paquetes NuGet principales:**

```xml
<ItemGroup>
  <!-- Framework -->
  <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
  
  <!-- Entity Framework Core -->
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
  
  <!-- Autenticacion -->
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
  
  <!-- Validacion -->
  <PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
  
  <!-- Documentacion -->
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  
  <!-- Utilidades -->
  <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
  <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
</ItemGroup>
```

**Caracteristicas clave usadas:**
- **Minimal APIs:** Sintaxis concisa para endpoints
- **Dependency Injection:** Nativo del framework
- **Middleware pipeline:** Para auth, logging, error handling
- **CORS:** Configurado para frontend en Vercel
- **Rate Limiting:** Proteccion contra abuso

**Por que .NET 8:**
- Performance excepcional (top 3 en benchmarks)
- Type-safe como TypeScript (C# es robusto)
- Async/await nativo (escalabilidad)
- Ecosistema maduro (NuGet)
- LTS (soporte hasta 2026)

---

### Entity Framework Core 8.0

**Version:** 8.0.0

**Uso:** ORM para PostgreSQL

```csharp
public class SportPlannerDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserPlanificacion> Planificaciones { get; set; }
    public DbSet<UserObjetivo> Objetivos { get; set; }
    public DbSet<UserEjercicio> Ejercicios { get; set; }
    public DbSet<UserSesion> Sesiones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuracion de relaciones, indices, constraints
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SportPlannerDbContext).Assembly);
    }
}
```

**Caracteristicas clave:**
- **Code-First:** Modelos C# -> Schema SQL
- **Migraciones:** Versionado de schema
- **LINQ:** Queries type-safe
- **Lazy/Eager Loading:** Control de carga de relaciones
- **Raw SQL:** Para queries complejas (algoritmo progresion)

**Por que EF Core:**
- Integracion nativa con .NET
- Migraciones automaticas
- Type-safety total
- Performance aceptable (para escala MVP)

**Alternativa descartada:**
- Dapper: Mas rapido pero requiere mas codigo boilerplate

---

### Librerias Auxiliares Backend

**Autenticacion:**
- JWT Bearer: Tokens para auth stateless
- Integracion con Supabase Auth (validar tokens generados por Supabase)

**Validacion:**
- FluentValidation: Validacion de DTOs (mas expresivo que Data Annotations)

**Logging:**
- Serilog: Logs estructurados (JSON) con sinks a archivos/servicios

**Documentacion:**
- Swagger/OpenAPI: Documentacion interactiva de API

---

## BASE DE DATOS

### PostgreSQL 15+

**Version:** 15 o superior (via Supabase)

**Por que PostgreSQL:**
- ACID compliant (transacciones robustas)
- JSON/JSONB support (canvas_data, estructura de sesiones)
- Arrays nativos (objetivos_ids, tags)
- Full-text search (para marketplace)
- Row Level Security (RLS) - critico para multi-tenancy
- Triggers y funciones (update_rating_promedio)
- Indices avanzados (GIN para JSONB, arrays)
- Maduro y confiable

**Alternativas descartadas:**
- MySQL: Sin RLS nativo, JSONB inferior
- MongoDB: Relaciones complejas (planificacion-objetivos-sesiones-ejercicios) hacen SQL mejor opcion
- SQLite: No apto para produccion con multiples usuarios

**Caracteristicas usadas:**
- JSONB para canvas_data (flexibilidad sin perder queryability)
- Arrays para relaciones simples (objetivos_ids)
- Triggers para calculos automaticos (rating_promedio)
- RLS policies para seguridad multi-tenant
- Indices compuestos para queries frecuentes

---

## BAAS (BACKEND AS A SERVICE)

### Supabase

**Servicios usados:**

1. **Supabase Auth**
   - Registro/login con email/password
   - JWT tokens automaticos
   - Row Level Security integrado con PostgreSQL
   - Refresh tokens
   
2. **Supabase Storage**
   - Almacenamiento de imagenes (thumbnails de ejercicios, canvas exportados)
   - Buckets publicos y privados
   - CDN integrado
   
3. **Supabase Realtime** (Opcional - Fase 2)
   - WebSocket para notificaciones en tiempo real
   - Broadcast de cambios en planificaciones (Director -> Entrenadores)

4. **Supabase Database**
   - PostgreSQL managed
   - Backups automaticos
   - Dashboard para queries

**Por que Supabase:**
- PostgreSQL nativo (no como Firebase que es NoSQL)
- RLS built-in (seguridad multi-tenant sin codigo backend)
- Auth ya resuelto (no reinventar la rueda)
- Free tier generoso (50K usuarios MAU, 500MB storage, 2GB bandwidth)
- Open-source (no vendor lock-in total)

**Alternativas descartadas:**
- Firebase: NoSQL no apto para relaciones complejas
- AWS Amplify: Mas complejo, menor DX
- Auth0: Solo auth, no incluye DB/Storage

---

## HOSTING E INFRAESTRUCTURA

### Frontend: Vercel

**Plan:** Free tier (suficiente para MVP)

**Caracteristicas:**
- Deploy automatico desde GitHub (CI/CD integrado)
- CDN global (Edge Network)
- Preview deployments por PR
- Analytics basicos
- HTTPS automatico
- Escalado automatico

**Por que Vercel:**
- Especializado en frameworks frontend (Angular, React, etc.)
- Deploy en segundos
- Free tier muy generoso (100GB bandwidth/mes)
- DX excepcional

**Alternativa descartada:**
- Netlify: Similar pero menos optimizado para Angular
- AWS S3 + CloudFront: Mas complejo de configurar

---

### Backend: Railway

**Plan:** Hobby ($5/mes) o Pro ($20/mes segun uso)

**Caracteristicas:**
- Deploy desde GitHub
- PostgreSQL incluido (no necesita Supabase DB si prefieres)
- Variables de entorno faciles
- Logs en tiempo real
- Escalado vertical simple
- Redis opcional (cache)

**Por que Railway:**
- PaaS simple (menos complejo que AWS/Azure)
- PostgreSQL managed incluido
- Pricing predecible
- DX excelente
- Integracion con GitHub

**Alternativas descartadas:**
- Heroku: Mas caro, menos features
- Render: Similar pero Railway tiene mejor UI
- AWS ECS: Overkill para MVP, complejo

---

### Alternativa: Todo en Supabase

**Opcion simplificada:** Si quieres minimizar costos y complejidad inicial:

1. **Frontend:** Vercel (Angular SPA)
2. **Backend:** Supabase Edge Functions (Deno/TypeScript)
3. **Database:** Supabase PostgreSQL
4. **Auth + Storage:** Supabase

**Ventajas:**
- Un solo proveedor (facturacion unificada)
- Menor costo inicial (Supabase free tier cubre mas)
- Menos configuracion

**Desventajas:**
- Edge Functions son menos maduras que .NET
- Menos control sobre backend
- Vendor lock-in mayor

**Recomendacion:** Empezar con Stack propuesto (Vercel + Railway + Supabase) porque:
- .NET backend es mas profesional y escalable
- Mejor separacion de concerns
- Mas facil migrar si Supabase no escala

---

## HERRAMIENTAS DE DESARROLLO

### Control de Versiones

- **Git** + **GitHub**
- Repositorio monorepo (frontend + backend en un solo repo) o separados
- GitHub Actions para CI/CD

### IDE Recomendados

- **Visual Studio Code** (frontend)
  - Extensiones: Angular Language Service, Tailwind CSS IntelliSense, ESLint, Prettier
- **Visual Studio 2022** o **Rider** (backend)
  - Para .NET development

### Package Managers

- **npm** (frontend)
- **NuGet** (backend)

### Testing

- **Frontend:**
  - Jest (unit tests)
  - Cypress (E2E tests)
  
- **Backend:**
  - xUnit (unit tests)
  - Testcontainers (integration tests con PostgreSQL)

### Linting y Formateo

- **Frontend:**
  - ESLint + Prettier
  - Husky (pre-commit hooks)
  
- **Backend:**
  - StyleCop (C# linting)
  - .editorconfig

### Documentacion API

- **Swagger/OpenAPI:** Auto-generado desde .NET controllers
- **Postman:** Colecciones de requests para testing manual

---

## SERVICIOS DE TERCEROS

### Email

**SendGrid** (Free tier: 100 emails/dia)

**Uso:** 
- Emails de confirmacion de registro
- Notificaciones de entrenamiento proximo
- Reportes semanales (opcional)

**Alternativa:** Resend (mas moderno, mejor DX)

---

### Monitoreo y Error Tracking

**Sentry** (Free tier)

**Uso:**
- Captura de errores frontend y backend
- Alertas de errores criticos
- Performance monitoring

---

### Analytics (Opcional - Fase 2)

**Mixpanel** o **PostHog**

**Uso:**
- Tracking de eventos (usuario crea planificacion, importa ejercicio, etc.)
- Funnels de conversion
- Retention analysis

---

## RESUMEN DE COSTOS MENSUALES (MVP)

| Servicio | Plan | Costo |
|----------|------|-------|
| Vercel | Free | $0 |
| Railway | Hobby | $5 |
| Supabase | Free | $0 |
| SendGrid | Free | $0 |
| Sentry | Free | $0 |
| Dominio | Namecheap | ~$12/ano |
| **TOTAL MENSUAL** | - | **~$5-6** |

**Escalabilidad de costos:**
- Con 100 usuarios: $5-10/mes
- Con 500 usuarios: $20-30/mes (Railway Pro)
- Con 1000+ usuarios: $50-100/mes (Supabase Pro + Railway scaling)

---

## DEPENDENCIAS Y VERSIONES (Resumen)

### Frontend (package.json)

```json
{
  "name": "sportplanner-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build --configuration production",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/router": "^20.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "fabric": "^6.0.0",
    "gsap": "^3.12.0",
    "tailwindcss": "^4.0.0",
    "date-fns": "^3.0.0",
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "typescript": "~5.4.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0"
  }
}
```

### Backend (.csproj)

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
    <PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
  </ItemGroup>
</Project>
```

---

**Version:** 1.0  
**Ultima actualizacion:** 2025-11-14  
**Estado:** Completo  
**Siguiente:** ADRs (Architecture Decision Records)
