# Guía Integral de Arquitectura, Patrones, Antipatrones y Buenas Prácticas Angular 20 + TypeScript 5.9.2

## Resumen Ejecutivo
Esta guía está orientada a agentes automáticos y desarrolladores avanzados, cubriendo:
- Arquitectura limpia y escalable en Angular 20
- Patrones y antipatrones en Angular y TypeScript 5.9.2
- Control flow modernizado con bloques @if, @for, @switch (reemplazando directivas deprecadas)
- **Tailwind CSS v4** como framework de estilos oficial del proyecto
- **Componentización exhaustiva** para máxima reutilización
- **Separación obligatoria** de archivos `.ts`, `.html`, `.scss`
- **Modo Light y Dark** implementado en todos los componentes
- Mejores prácticas para estructuración de componentes en archivos separados
- Checklist para revisión automática y codificación asistida

---

## 🚨 CRÍTICO: MCP Server de Angular - Recurso Principal

**⚠️ IMPORTANTE: Este proyecto tiene acceso a un MCP (Model Context Protocol) Server de Angular que proporciona:**

- ✅ **Best Practices Guide oficial** de Angular actualizado constantemente
- ✅ **Búsqueda en documentación oficial** de Angular (https://angular.dev)
- ✅ **APIs, tutoriales, conceptos y ejemplos** directamente desde la fuente oficial
- ✅ **Información actualizada** sobre standalone components, signals, control flow, y todas las características modernas

### 📘 Herramientas MCP Disponibles

1. **`mcp_angular-cli_get_best_practices`**
   - Recupera la **Angular Best Practices Guide** completa
   - Contiene reglas y convenciones **imprescindibles** para desarrollo Angular moderno
   - **OBLIGATORIO consultarla** antes de escribir o modificar código Angular

2. **`mcp_angular-cli_search_documentation`**
   - Busca en la documentación oficial de Angular (angular.dev)
   - Devuelve contenido actualizado de la página con snippets relevantes
   - Úsala para resolver dudas sobre APIs específicas, sintaxis, o patrones

### 🎯 Workflow Obligatorio para Agentes

**ANTES de crear/modificar código Angular:**

1. **Consultar MCP Server primero:**
   ```
   - Usar mcp_angular-cli_get_best_practices para obtener guía completa
   - Usar mcp_angular-cli_search_documentation para APIs/conceptos específicos
   ```

2. **Revisar esta guía (AGENTS.md)** para:
   - Estructura de carpetas y convenciones del proyecto SportPlanner
   - Patrones específicos ya establecidos en el proyecto
   - Antipatrones a evitar

3. **Consultar documentación de negocio** en `DocSportPlanner/`:
   - Reglas de dominio deportivo
   - Requisitos funcionales
   - Modelos de datos

### 📌 Ejemplos de Uso del MCP Server

**Para obtener best practices:**
```
Query: "Angular best practices guide"
Tool: mcp_angular-cli_get_best_practices
```

**Para buscar información específica:**
```
Query: "standalone components"
Tool: mcp_angular-cli_search_documentation

Query: "signals computed effect"
Tool: mcp_angular-cli_search_documentation

Query: "NgModule vs standalone"
Tool: mcp_angular-cli_search_documentation
```

### ⚡ Ventajas del MCP Server

- **Siempre actualizado:** Acceso directo a la documentación oficial más reciente
- **Evita información desactualizada:** Mejor que confiar en conocimiento estático
- **Autoridad oficial:** Viene directamente de angular.dev
- **Ejemplos precisos:** Código verificado y mantenido por el equipo de Angular

### 🔴 Regla de Oro

> **NUNCA escribas código Angular sin consultar primero el MCP Server.**
> 
> La información del MCP Server tiene **prioridad sobre cualquier otra fuente**, incluido el contenido de este archivo si hay contradicciones (aunque este archivo se mantiene alineado con las best practices oficiales).

---

## 🎨 CRÍTICO: Tailwind CSS v4 - Framework de Estilos Oficial

**⚠️ IMPORTANTE: Este proyecto usa Tailwind CSS v4 como framework de estilos ÚNICO.**

### 📐 Reglas de Estilos

1. **Tailwind CSS v4 OBLIGATORIO**
   - ✅ Usar clases de Tailwind para TODOS los estilos
   - ❌ NO escribir CSS custom en archivos `.scss` salvo casos excepcionales
   - ✅ Aprovechar las utility classes de Tailwind
   - ✅ Usar `@apply` solo cuando sea necesario para componentes complejos

2. **Modo Light y Dark (OBLIGATORIO)**
   - ✅ **TODOS los componentes** deben soportar `light` y `dark` mode
   - ✅ Usar las clases `dark:` de Tailwind para modo oscuro
   - ✅ Definir colores con variables CSS para temas
   - ✅ Probar AMBOS modos antes de considerar completo un componente
   - ❌ NO hardcodear colores que no soporten dark mode

3. **Separación de Archivos (OBLIGATORIO)**
   - ✅ `.ts` → Lógica del componente
   - ✅ `.html` → Template con clases de Tailwind
   - ✅ `.scss` → Solo para casos excepcionales o `@apply` custom
   - ❌ NUNCA inline templates o estilos en el `.ts`

4. **Componentización Exhaustiva**
   - ✅ **Componetizar TODO** lo que sea reutilizable
   - ✅ Crear componentes atómicos (botones, inputs, cards, badges, etc.)
   - ✅ Componentes pequeños y enfocados en una sola responsabilidad
   - ✅ Reutilizar antes de duplicar código
   - ✅ Pensar en componentes como piezas de LEGO

### 🎨 Ejemplo de Componente con Tailwind v4 y Dark Mode

**button.component.ts**
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
}
```

**button.component.html**
```html
<button
  [disabled]="disabled"
  [class]="[
    'rounded-lg font-semibold transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size variants
    size === 'sm' ? 'px-3 py-1.5 text-sm' : '',
    size === 'md' ? 'px-4 py-2 text-base' : '',
    size === 'lg' ? 'px-6 py-3 text-lg' : '',
    
    // Color variants (light + dark mode)
    variant === 'primary' ? [
      'bg-blue-600 text-white hover:bg-blue-700',
      'dark:bg-blue-500 dark:hover:bg-blue-600',
      'focus:ring-blue-500'
    ] : '',
    
    variant === 'secondary' ? [
      'bg-gray-200 text-gray-900 hover:bg-gray-300',
      'dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      'focus:ring-gray-500'
    ] : '',
    
    variant === 'danger' ? [
      'bg-red-600 text-white hover:bg-red-700',
      'dark:bg-red-500 dark:hover:bg-red-600',
      'focus:ring-red-500'
    ] : ''
  ].flat().filter(Boolean).join(' ')"
>
  <ng-content></ng-content>
</button>
```

**button.component.scss**
```scss
// Solo para casos excepcionales - preferir Tailwind classes
// Este archivo puede estar vacío o contener solo @apply
```

### 🌓 Configuración de Dark Mode en Tailwind

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Habilita dark mode con clase 'dark'
  theme: {
    extend: {
      colors: {
        // Colores personalizados que soporten light/dark
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... más tonos
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

### 🎯 Checklist de Estilos

- [ ] Usar clases de Tailwind CSS v4 para todos los estilos
- [ ] Implementar variantes `dark:` para TODOS los elementos visuales
- [ ] Probar componente en modo light Y dark antes de commit
- [ ] Componentizar elementos reutilizables (botones, cards, inputs, etc.)
- [ ] Separar `.ts`, `.html`, `.scss` en archivos distintos
- [ ] NO usar CSS inline en templates
- [ ] NO hardcodear colores sin considerar dark mode
- [ ] Documentar componentes reutilizables con ejemplos

---

> 📁 **Nota - Documentación del proyecto**
>
> El repositorio incluye una carpeta central con las especificaciones del proyecto, modelos y decisiones de diseño: `C:\Proyectos\SportPlanner\DocSportPlanner`.
>
> - Revisa `DocSportPlanner/` (por ejemplo `DocSportPlanner/docs/`, `DocSportPlanner/docs/tecnico/`, `DocSportPlanner/docs/tecnico/openapi.yaml`) antes de iniciar tareas de diseño o de backend/frontend.
> - Las `instructions` y `agents` para `front` y `back` deben consultar estos documentos para alinear requisitos, contratos de API y convenciones.


## 1. CRÍTICO: Control Flow Blocks - Cambio Fundamental en Angular 20

### Directivas Deprecadas en Angular 20
A partir de **Angular 20**, las siguientes directivas estructurales están **DEPRECADAS** e irán a remover en **v22**:
- `*ngIf` → Usar `@if` block
- `*ngFor` → Usar `@for` block
- `[ngSwitch]`, `*ngSwitchCase`, `*ngSwitchDefault` → Usar `@switch` block

**Acción recomendada**: Ejecutar automáticamente el schematic de migración:
```bash
ng update @angular/core --name=control-flow-migration
```

### Nueva Sintaxis: Bloques de Control de Flujo

#### @if / @else if / @else
```typescript
// ✅ CORRECTO - Angular 20
@if (condition) {
  <p>Condition is true</p>
} @else if (otherCondition) {
  <p>Other condition is true</p>
} @else {
  <p>No conditions met</p>
}

// ❌ DEPRECATED - Evitar
<div *ngIf="condition">
  <p>Condition is true</p>
</div>
<div *ngIf="otherCondition">
  <p>Other condition is true</p>
</div>
<div *ngIf="!condition && !otherCondition">
  <p>No conditions met</p>
</div>
```

#### @for (reemplaza *ngFor)
```typescript
// ✅ CORRECTO - Angular 20
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

// Con @empty para lista vacía
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items available</li>
}

// Variables locales: $index, $count, $first, $last, $even, $odd
@for (item of items; track item.id; let idx = $index, isEven = $even) {
  <div [class.even]="isEven">{{ idx }}: {{ item.name }}</div>
}

// ❌ DEPRECATED - Evitar
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**Ventaja clave**: El `track` es **obligatorio** en `@for` (evita memory leaks), mejora performance 90% respecto a `*ngFor`.

#### @switch / @case / @default
```typescript
// ✅ CORRECTO - Angular 20
@switch (userRole) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}

// ❌ DEPRECATED - Evitar
<div [ngSwitch]="userRole">
  <div *ngSwitchCase="'admin'">
    <app-admin-dashboard />
  </div>
  <div *ngSwitchCase="'editor'">
    <app-editor-dashboard />
  </div>
  <div *ngSwitchDefault>
    <app-viewer-dashboard />
  </div>
</div>
```

**Nota importante**: No hay "fall-through" en `@switch`, no necesita `break`.

### Migración y Consideraciones
- **Control flow schematics**: Migra automáticamente `*ngIf`, `*ngFor`, `*ngSwitch`
- **NgIf con async pipe**: La nueva sintaxis también aplica bien con async:
  ```typescript
  @if (country$ | async; as countryList) {
    <span>Found {{ countryList.length }} countries</span>
  }
  ```
- **No requiere imports**: Los bloques `@if`, `@for`, `@switch` están "built-in" en Angular 20+
- **Mejor legibilidad y type checking**: Los bloques soportan type narrowing en switch

---

## 2. Arquitectura Moderna Angular 20

### Separación de Archivos (OBLIGATORIO)
- Cada componente **SIEMPRE** debe tener su `.ts`, `.html` y `.scss` en archivos **separados** y nombrados igual, agrupados en el mismo directorio.
- ❌ **PROHIBIDO** juntar plantilla HTML o estilos en el archivo `.ts` del componente
- ❌ **PROHIBIDO** usar `template: ''` o `styles: []` inline en el decorador `@Component`
- ✅ **OBLIGATORIO** tener 3 archivos mínimo: `.ts`, `.html`, `.scss` (aunque `.scss` esté vacío)
- Estructura ejemplo para `user-profile`:
  ```
  src/features/user/profile/
  ├── user-profile.component.ts      # Lógica
  ├── user-profile.component.html    # Template con Tailwind
  ├── user-profile.component.scss    # Vacío o @apply custom
  ├── user-profile.component.spec.ts # Tests
  ```

### Organización de Carpetas
- Organizar por dominio/feature, no por tipo técnico (evitar `components/`, `services/` genéricos)
- Aplicar Domain-Driven Design (DDD) donde sea relevante
- **Componentización exhaustiva:** Crear carpeta `shared/components/` para componentes atómicos reutilizables
- Estructura recomendada:
  ```
  src/
  ├── shared/
  │   ├── components/        # Componentes reutilizables (botones, cards, inputs)
  │   │   ├── button/
  │   │   ├── card/
  │   │   ├── input/
  │   │   └── badge/
  │   ├── services/          # Servicios compartidos
  │   └── models/            # Modelos/interfaces compartidos
  ├── features/
  │   ├── users/             # Feature de usuarios
  │   ├── teams/             # Feature de equipos
  │   └── training/          # Feature de entrenamientos
  └── core/                  # Servicios singleton, guards, interceptors
  ```
- Colocar archivos de test (`*.spec.ts`) junto al código bajo prueba
- Usar lazy loading y feature modules por dominio

### Standalone Components
- Preferir componentes `standalone: true` usando la API moderna.
- Minimizar NgModules y evitar módulos redundantes.
- Eliminar CommonModule imports innecesarias en componentes standalone (bloques @if/@for no requieren imports).

### Naming y Conceptos
- Prefiere nombres cortos, claros, únicos y con significado de dominio.
- Usar un concepto por archivo/feature.
- Evitar nombres genéricos: `utils.ts`, `common.ts`, `constants.ts` sin contexto.

---

## 3. Patrones Recomendados Angular 20

### Arquitectura y Componentes
- **Componentización exhaustiva:** Crear componentes pequeños y reutilizables para TODO
- **Componentes atómicos:** Botones, inputs, cards, badges, etc. en `shared/components/`
- **Composición sobre duplicación:** Reutilizar componentes antes de crear nuevos
- **Separación obligatoria:** `.ts`, `.html`, `.scss` siempre en archivos separados

### Estilos y UI
- **Tailwind CSS v4 ÚNICAMENTE:** No escribir CSS custom salvo excepciones
- **Dark mode obligatorio:** Todos los componentes deben soportar `light` y `dark`
- **Utility-first approach:** Usar clases de Tailwind directamente en templates
- **Responsive design:** Mobile-first con breakpoints de Tailwind (`sm:`, `md:`, `lg:`, etc.)

### Estado y Datos
- **Uso de signals** para estado local y derived state (preferir `signal()` sobre `BehaviorSubject` para UI local)
- **ChangeDetectionStrategy.OnPush** por defecto en todos los componentes
- **Servicios con una única responsabilidad**, singleton vía `providedIn: 'root'`
- **Async pipe** en lugar de subscribes manuales en templates

### Control Flow y Performance
- **Bloques de control flow (@if, @for, @switch)** en lugar de directivas deprecadas
- **Lazy loading de rutas y features** para agilizar arranque inicial
- **Type narrowing** en @switch para aprovechamiento de tipos discriminated unions

### Testing y Documentación
- **Test unitarios y e2e junto al código**, integrados al pipeline de CI/CD
- **Storybook para componentes compartidos** con ejemplos light/dark
- **Documentación de componentes reutilizables** con variantes y props

### Configuración
- **Configuración multi-entorno y fuera del código** (no hardcode)
- **Variables CSS para temas** personalizables

---

## 4. Antipatrones y Smells Angular 20

| Antipatrón | Descripción | Alternativa |
|-----------|------------|-----------|
| Usar `*ngIf`, `*ngFor`, `*ngSwitch` | Directivas deprecadas en v20, removerán en v22 | Usar `@if`, `@for`, `@switch` bloques |
| Lógica compleja en plantillas HTML | Difícil de mantener, no se puede testear | Extraer a TS/computed/pipe |
| Subscribes manuales en componentes | Memory leaks, suscripciones olvidadas | Usar async pipe o signals |
| No usar `any` pero usar demasiado `unknown` | Pierde type safety | Inferir tipos explícitamente |
| Nombres ambiguos y archivos genéricos | `utils.ts`, `common.ts`, `service.ts` | Nombres con contexto de dominio |
| Más de un concepto principal por archivo | Difícil de reutilizar y testear | Un concepto = un archivo |
| Guardar tokens/datos sensibles en localStorage | Seguridad débil | session/cookies seguras, HTTPS only |
| Cambio de detección sin OnPush | Performance degradada | Usar OnPush + signals |
| @for sin trackBy (old) o track (new) | Memory leaks, DOM ineficiente | Siempre incluir `track` en @for |
| Componentes acoplados a estado global | Difícil de testear y reutilizar | Inyectar servicios, signals locales |
| No migrar de `*ngIf` a `@if` cuando sea posible | Deprecated warnings, mejor evitarlas | Usar control flow blocks |
| Template y estilos inline en `.ts` | Dificulta mantenimiento y violates separation of concerns | Siempre archivos `.html` y `.scss` separados |
| CSS custom sin justificación | Inconsistencia de estilos, difícil de mantener | Usar Tailwind CSS v4 utility classes |
| No implementar dark mode | Mala UX, no cumple con estándares modernos | Siempre usar `dark:` classes de Tailwind |
| Duplicar componentes similares | Código repetido, difícil de mantener | Componentizar y parametrizar con @Input |
| Hardcodear colores sin variables | Imposible cambiar tema, no soporta dark mode | Usar variables CSS o clases de Tailwind |
| Componentes gigantes (>300 líneas) | Difícil de mantener y testear | Dividir en componentes más pequeños |

---

## 5. Buenas Prácticas TypeScript 5.9.2

### Configuración Reforzada
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "ESNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Mejores Prácticas TypeScript
- Siempre usar `strict: true` y null checks estrictos
- Inferencia de tipos: dejar que el compilador infiera cuando sea obvio
- Declarar interfaces y tipos explícitos (nunca abusar de `any`)
- Usar enums y discriminated unions para estados/condiciones
- Preferir la composición sobre herencia
- Usar las utilidades modernas (`satisfies`, template literal types, conditional types)
- Minimizar el uso de type assertions y explicar su propósito cuando sean necesarios
- Usar assertions y guards en vez de coerciones directas
- Evitar interfaces gigantes, mejor fragmentar con tipos más pequeños y claros
- Documentar usando `/** ... */` encima de funciones, métodos y clases relevantes
- Usar tipos readonly para prevenir mutaciones accidentales
- Aplicar type narrowing con type guards en condicionales

---

## 6. Antipatrones TypeScript 5.9.2

| Antipatrón | Problema | Solución |
|-----------|---------|---------|
| Uso de `any` como "comodín" | Pierde type safety completamente | Usar `unknown` si es necesario, luego type guard |
| Ignorar `strictNullChecks` | Errores sutiles de ejecución | Activar strict, usar optional chaining |
| Abusar de type assertions (`as Type`) | Puede ocultar errores reales | Type guards, type narrowing en lugar de assertions |
| No declarar tipo de variables | Tipo implícito puede causar confusiones | Siempre tipado explícito en variables públicas |
| Ignorar errores con `// @ts-ignore` | Acumula deuda técnica | Resolver el error real o documentar bien |
| Interfaces/Tipos con demasiadas propiedades | Viola Single Responsibility | Fragmentar en tipos más pequeños |
| No usar `readonly` en objetos | Permite mutabilidades accidentales | Usar readonly, Readonly<T> utility |
| Faltas de documentar shape de objetos | Difícil de entender retornos | JSDoc comentarios (`/** ... */`) |
| Genéricos excesivamente complejos | Código difícil de seguir | Simplificar, usar tipos concretos si es posible |
| Type assertions en datos externos | Falsa seguridad de tipo | Validación en runtime + tipo checking |

---

## 7. Checklist Automática (Angular 20 + TypeScript 5.9.2)

### Pre-Codificación (OBLIGATORIO)
- [ ] **Consultar MCP Server de Angular** (`mcp_angular-cli_get_best_practices`)
- [ ] **Buscar API/concepto específico** en MCP si es necesario (`mcp_angular-cli_search_documentation`)
- [ ] Revisar `DocSportPlanner/` para contexto de negocio y dominio
- [ ] Verificar `back/typescript-best-practices.md` para convenciones TypeScript
- [ ] Revisar componentes existentes en `shared/components/` antes de crear nuevos

### Arquitectura y Estructura
- [ ] **OBLIGATORIO:** Cada componente con `.ts`, `.html`, `.scss` **separados** (NO inline)
- [ ] Estructura por dominio/feature, nunca solo por tipo técnico
- [ ] Componentes standalone por defecto (`standalone: true`)
- [ ] Componentizar elementos reutilizables en `shared/components/`
- [ ] Componentes pequeños y enfocados (idealmente <300 líneas)
- [ ] Nombres explícitos; evitar genéricos o camel ambiguo
- [ ] Test junto al código, con cobertura mínima

### Control Flow y Sintaxis Angular 20
- [ ] Ningún uso de `*ngIf`, `*ngFor`, `*ngSwitch` → Usar `@if`, `@for`, `@switch`
- [ ] Bloques de control flow tienen `track` en `@for` (obligatorio)
- [ ] Async pipe en lugar de subscribes manuales
- [ ] No lógica de negocio en plantillas HTML

### Signals y Estado
- [ ] Signals preferido para estado local, RxJS solo para casos globales o complejos
- [ ] `ChangeDetectionStrategy.OnPush` en todos los componentes
- [ ] No hay memoria leaks en componentes destruidos

### TypeScript 5.9.2
- [ ] Tipado estricto activado (`strict: true` en tsconfig) y sin `any`
- [ ] Configuración modernizada de TS (`strict`, `noUnusedLocals`, etc.) y linting avanzado
- [ ] Type narrowing en @switch para discriminated unions
- [ ] Consultar `back/typescript-best-practices.md` para patrones específicos

### Performance y Optimización
- [ ] `ChangeDetectionStrategy.OnPush` en todos los componentes
- [ ] Lazy loading de rutas y features para agilizar arranque inicial
- [ ] Track functions optimizadas en `@for`

### Estilos y UI (Tailwind CSS v4)
- [ ] **OBLIGATORIO:** Usar Tailwind CSS v4 para TODOS los estilos
- [ ] **OBLIGATORIO:** Implementar modo `light` Y `dark` con clases `dark:`
- [ ] Probar componente en AMBOS modos (light/dark) antes de commit
- [ ] NO escribir CSS custom en `.scss` sin justificación fuerte
- [ ] Usar utility classes de Tailwind en lugar de CSS custom
- [ ] Variables CSS para colores de tema si es necesario
- [ ] Responsive design con breakpoints de Tailwind

### Componentización
- [ ] Reutilizar componentes de `shared/components/` cuando sea posible
- [ ] Crear componente compartido si se usa en 2+ lugares
- [ ] Documentar componentes reutilizables con ejemplos
- [ ] Props bien tipados con `@Input()` y valores por defecto
- [ ] Componentes atómicos (button, input, card, badge) disponibles

### Seguridad y Configuración
- [ ] Configuración sensible externa (environments, config loaders)
- [ ] No hardcodear URLs, tokens o credenciales
- [ ] Storybook/documentación visible en el repo
- [ ] Documentación de componentes compartidos actualizada

### Validación Final
- [ ] **Re-verificar con MCP Server** si hay dudas sobre implementación
- [ ] Build exitoso sin warnings (`ng build`)
- [ ] Tests pasando (`ng test`)
- [ ] Linting sin errores (`ng lint`)

---

## 8. Ejemplo Completo: Componente Moderno Angular 20

### Estructura de Carpeta
```
src/features/users/
├── list/
│   ├── user-list.component.ts
│   ├── user-list.component.html
│   ├── user-list.component.scss
│   └── user-list.component.spec.ts
├── detail/
│   ├── user-detail.component.ts
│   ├── user-detail.component.html
│   ├── user-detail.component.scss
│   └── user-detail.component.spec.ts
├── services/
│   └── user.service.ts
└── models/
    └── user.model.ts
```

### user-list.component.ts
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: 'OnPush'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  users = signal<User[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load users');
        this.isLoading.set(false);
      }
    });
  }
}
```

### user-list.component.html
```html
@if (isLoading()) {
  <p class="loading">Loading users...</p>
}

@if (error()) {
  <div class="error">{{ error() }}</div>
}

@if (!isLoading() && users().length > 0) {
  <ul class="user-list">
    @for (user of users(); track user.id) {
      <li class="user-item">
        <a [routerLink]="['/users', user.id]">
          {{ user.name }} ({{ user.email }})
        </a>
      </li>
    }
  </ul>
}

@if (!isLoading() && users().length === 0 && !error()) {
  <p>No users found</p>
}
```

### user-list.component.scss
```scss
.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: red;
  padding: 10px;
  background-color: #ffe6e6;
  border-radius: 4px;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  padding: 10px;
  border-bottom: 1px solid #eee;

  a {
    text-decoration: none;
    color: #0066cc;

    &:hover {
      text-decoration: underline;
    }
  }
}
```

### user.model.ts
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}
```

### user.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
```

---

## 9. Fuentes Relevantes y Referencias Oficiales

### 🔴 Recurso Principal (OBLIGATORIO)
- **MCP Server de Angular** - Acceso directo a best practices y documentación oficial actualizada
  - Tool: `mcp_angular-cli_get_best_practices` - Best Practices Guide completa
  - Tool: `mcp_angular-cli_search_documentation` - Búsqueda en angular.dev

### 📚 Documentación Oficial Angular
- Angular 20 Control Flow Documentation (angular.dev) - **Consultar vía MCP Server**
- Angular Style Guide y Architectural Guidelines - **Consultar vía MCP Server**
- Angular Deprecation Notice: ngIf/ngFor/ngSwitch - **Consultar vía MCP Server**
- Angular Control Flow Migration Schematic - **Consultar vía MCP Server**

### 🔧 TypeScript
- TypeScript 5.9.x Release Notes y Best Practices
- `back/typescript-best-practices.md` - Convenciones específicas del proyecto

### 💼 Documentación del Proyecto
- `DocSportPlanner/` - Contexto de negocio, reglas de dominio, requisitos
- `DocSportPlanner/docs/tecnico/` - Stack tecnológico y modelo de datos
- `DocSportPlanner/docs/negocio/` - Casos de uso y terminología del dominio

### ⚠️ Nota Importante
**Siempre prioriza la información del MCP Server** sobre cualquier otra fuente, ya que provee acceso directo a la documentación oficial más actualizada de Angular. Este archivo (AGENTS.md) se mantiene alineado con las best practices oficiales, pero en caso de duda o contradicción, **el MCP Server tiene la autoridad final**.

---

## 10. Próximos Pasos para Agentes Automáticos

### Workflow de Desarrollo Obligatorio

1. **🔍 CONSULTAR MCP SERVER PRIMERO**
   - Ejecutar `mcp_angular-cli_get_best_practices` antes de cualquier tarea
   - Usar `mcp_angular-cli_search_documentation` para APIs/conceptos específicos
   - **La información del MCP tiene prioridad absoluta**

2. **📋 Validar cada pull request/generación** contra la checklist de este documento

3. **🔧 Aplicar linting avanzado** para naming, tipado estricto, modularidad

4. **🔄 Ejecutar schematic de migración** `ng update @angular/core --name=control-flow-migration` en proyectos legacy

5. **💡 Sugerir refactor automático** ante lógicas complejas en templates o componentes

6. **🏗️ Analizar dependencias** para asegurar límites de dominio claros

7. **🧪 Integrar pruebas y documentación UI** en el pipeline

### Orden de Prioridad de Fuentes de Información

1. **🥇 MCP Server de Angular** (`mcp_angular-cli_*` tools) - **MÁXIMA PRIORIDAD**
2. **🥈 Documentación oficial de Angular** (https://angular.dev)
3. **🥉 Este archivo (front/AGENTS.md)** - Convenciones específicas del proyecto
4. **📚 TypeScript best practices** (`back/typescript-best-practices.md`)
5. **💼 Documentación de negocio** (`DocSportPlanner/`)

### Ejemplos de Consultas al MCP Server

**Antes de crear un componente nuevo:**
```
1. mcp_angular-cli_get_best_practices
   → Leer sección de componentes standalone

2. mcp_angular-cli_search_documentation
   Query: "standalone components"
   → Obtener ejemplos actualizados
```

**Antes de implementar signals:**
```
1. mcp_angular-cli_search_documentation
   Query: "signals computed effect"
   → Ver API completa y ejemplos

2. mcp_angular-cli_search_documentation
   Query: "signals vs observables"
   → Entender cuándo usar cada uno
```

**Antes de usar control flow:**
```
1. mcp_angular-cli_search_documentation
   Query: "@if @for @switch control flow"
   → Sintaxis y mejores prácticas actualizadas
```

### 🚨 Recordatorio Crítico

> **Siempre que vayas a escribir código Angular:**
> 
> 1. Abre con `mcp_angular-cli_get_best_practices`
> 2. Busca conceptos específicos con `mcp_angular-cli_search_documentation`
> 3. Solo entonces implementa siguiendo las best practices obtenidas
> 
> **No confíes solo en conocimiento estático o cached. El MCP Server tiene la información oficial más actualizada.**

---

### Síntesis Directiva
El enfoque más moderno y robusto para Angular 20 exige: **consultar siempre el MCP Server de Angular primero**, bloques de control flow (@if/@for/@switch), standalone, signals, folder structure por dominio, tipado estricto de TypeScript, y una fuerte automatización en revisión de antipatterns. **Crítico**: No usar las directivas deprecadas `*ngIf`, `*ngFor`, `*ngSwitch`; migrar a los nuevos bloques de control inmediatamente para evitar warnings y asegurar compatibilidad con v22. **La información del MCP Server tiene prioridad absoluta sobre cualquier otra fuente.**

