# Guía Integral de Arquitectura, Patrones, Antipatrones y Buenas Prácticas Angular 20 + TypeScript 5.9.2

## Resumen Ejecutivo
Esta guía está orientada a agentes automáticos y desarrolladores avanzados, cubriendo:
- Arquitectura limpia y escalable en Angular 20
- Patrones y antipatrones en Angular y TypeScript 5.9.2
- Control flow modernizado con bloques @if, @for, @switch (reemplazando directivas deprecadas)
- Mejores prácticas para estructuración de componentes en archivos separados
- Checklist para revisión automática y codificación asistida

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
- Cada componente siempre debe tener su `.ts`, `.html` y `.css/.scss` en archivos separados y nombrados igual, agrupados en el mismo directorio.
- No juntar plantilla HTML ni estilos en el archivo `.ts` del componente salvo excepciones para demos/prototipos pequeños.
- Estructura ejemplo para `user-profile`:
  ```
  src/features/user/profile/
  ├── user-profile.component.ts
  ├── user-profile.component.html
  ├── user-profile.component.scss
  ├── user-profile.component.spec.ts
  ```

### Organización de Carpetas
- Organizar por dominio/feature, no por tipo técnico (evitar `components/`, `services/` genéricos)
- Aplicar Domain-Driven Design (DDD) donde sea relevante.
- Colocar archivos de test (`*.spec.ts`) junto al código bajo prueba.
- Usar lazy loading y feature modules por dominio.

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

- **Uso de signals** para estado local y derived state (preferir `signal()` sobre `BehaviorSubject` para UI local).
- **ChangeDetectionStrategy.OnPush** por defecto en todos los componentes.
- **Servicios con una única responsabilidad**, singleton vía `providedIn: 'root'`.
- **Lazy loading de rutas y features** para agilizar arranque inicial.
- **Test unitarios y e2e junto al código**, integrados al pipeline de CI/CD.
- **Storybook o documentación UI** acoplada al feature.
- **Configuración multi-entorno y fuera del código** (no hardcode).
- **Bloques de control flow (@if, @for, @switch)** en lugar de directivas deprecadas.
- **Async pipe** en lugar de subscribes manuales en templates.
- **Type narrowing** en @switch para aprovechamiento de tipos discriminated unions.

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

- [ ] Cada componente: `.ts`, `.html`, `.scss`/`.css` separadas, mismo nombre
- [ ] Ningún uso de `*ngIf`, `*ngFor`, `*ngSwitch` → Usar `@if`, `@for`, `@switch`
- [ ] Bloques de control flow tienen `track` en `@for` (obligatorio)
- [ ] Estructura por dominio/feature, nunca solo por tipo técnico
- [ ] Signals preferido para estado local, RxJS solo para casos globales o complejos
- [ ] Componentes standalone por defecto (`standalone: true`)
- [ ] `ChangeDetectionStrategy.OnPush` en todos los componentes
- [ ] Nombres explícitos; evitar genéricos o camel ambiguo
- [ ] Tipado estricto activado (`strict: true` en tsconfig) y sin `any`
- [ ] No lógica de negocio en plantillas HTML
- [ ] Test junto al código, con cobertura mínima
- [ ] Configuración sensible externa (environments, config loaders)
- [ ] Storybook/documentación visible en el repo
- [ ] Configuración modernizada de TS (`strict`, `noUnusedLocals`, etc.) y linting avanzado
- [ ] Async pipe en lugar de subscribes manuales
- [ ] No hay memoria leaks en componentes destruidos
- [ ] Type narrowing en @switch para discriminated unions

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
- Angular 20 Control Flow Documentation (angular.dev)
- Angular Style Guide y Architectural Guidelines
- TypeScript 5.9.x Release Notes y Best Practices
- Angular Deprecation Notice: ngIf/ngFor/ngSwitch
- Angular Control Flow Migration Schematic

---

## 10. Próximos Pasos para Agentes Automáticos

1. **Validar cada pull request/generación** contra la lista de checklist.
2. **Aplicar linting avanzado** para naming, tipado estricto, modularidad.
3. **Ejecutar schematic de migración** `ng update @angular/core --name=control-flow-migration` en proyectos legacy.
4. **Sugerir refactor automático** ante lógicas complejas en templates o componentes.
5. **Analizar dependencias** para asegurar límites de dominio claros.
6. **Integrar pruebas y documentación UI** en el pipeline.

---

### Síntesis Directiva
El enfoque más moderno y robusto para Angular 20 exige: bloques de control flow (@if/@for/@switch), standalone, signals, folder structure por dominio, tipado estricto de TypeScript, y una fuerte automatización en revisión de antipatterns. **Crítico**: No usar las directivas deprecadas `*ngIf`, `*ngFor`, `*ngSwitch`; migrar a los nuevos bloques de control inmediatamente para evitar warnings y asegurar compatibilidad con v22.

