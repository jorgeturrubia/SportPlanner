# TypeScript: Mejores Prácticas y Antipatrones

**Última actualización:** Noviembre 2025  
**Versiones cubiertas:** TypeScript 5.8, 5.9 y superiores

---

## Tabla de Contenidos

1. [Mejores Prácticas](#mejores-prácticas)
2. [Antipatrones a Evitar](#antipatrones-a-evitar)
3. [Configuración Recomendada](#configuración-recomendada)
4. [Características Modernas (5.8+)](#características-modernas)
5. [Guía de Migración](#guía-de-migración)

---

## Mejores Prácticas

### 1. Comprobación Estricta de Tipos (Type Safety First)

La seguridad de tipos es el corazón de TypeScript. Nunca comprometas esto.

**✅ Correcto:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function getUserProfile(user: User): string {
  return `${user.name} - ${user.email}`;
}

const user: User = {
  id: 1,
  name: "Juan",
  email: "juan@example.com"
};

console.log(getUserProfile(user));
```

**❌ Incorrecto:**
```typescript
function getUserProfile(user: any): string {
  return `${user.name} - ${user.email}`;
}

// TypeScript no puede verificar nada aquí
const user = { id: 1, name: "Juan" }; // Falta email
```

**Beneficios:**
- Detecta errores en tiempo de compilación
- Mejor autocompletado en el editor
- Código más mantenible
- Refactoring seguro

---

### 2. Evitar `any` a Toda Costa

El tipo `any` es el enemigo del type-safety. Úsalo solo en casos extremos.

**✅ Correcto - Usar `unknown`:**
```typescript
function processData(data: unknown): string {
  // TypeScript te obliga a verificar el tipo
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name;
  }
  throw new Error('Tipo de dato no soportado');
}
```

**❌ Incorrecto:**
```typescript
function processData(data: any): string {
  return data.toUpperCase(); // Puede fallar en runtime
}
```

**Alternativas a `any`:**
- `unknown` - Más seguro, requiere verificación de tipo
- `Record<string, unknown>` - Para objetos genéricos
- Genéricos `<T>` - Para máxima flexibilidad con seguridad

---

### 3. Usar Type Guards y Narrowing

Implementa sistemas robustos para verificar tipos en runtime.

**✅ Correcto - Type Guards:**
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

interface Cat extends Animal {
  color: string;
}

function isCat(animal: Animal): animal is Cat {
  return 'color' in animal;
}

function isDog(animal: Animal): animal is Dog {
  return 'breed' in animal;
}

function describeAnimal(animal: Animal): void {
  if (isCat(animal)) {
    console.log(`Gato ${animal.name}, color: ${animal.color}`);
  } else if (isDog(animal)) {
    console.log(`Perro ${animal.name}, raza: ${animal.breed}`);
  }
}
```

**✅ Correcto - Discriminated Unions:**
```typescript
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleResult<T>(result: Result<T>): void {
  if (result.status === 'success') {
    console.log('Datos:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}
```

---

### 4. Aprovechar la Inferencia de Tipos

TypeScript 5.8+ tiene inferencia muy mejorada. Confía en ella cuando sea apropiado.

**✅ Correcto:**
```typescript
// TypeScript infiere que numbers es number[]
const numbers = [1, 2, 3, 4, 5];

// TypeScript infiere que user es { id: number; name: string }
const user = {
  id: 1,
  name: "María"
};

// En funciones, TypeScript puede inferir el tipo de retorno
function calculateTotal(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Cuándo declarar explícitamente:**
```typescript
// Casos donde ES mejor ser explícito:

// 1. APIs públicas
export function processPayment(amount: number): Promise<PaymentResult> {
  // ...
}

// 2. Arrays vacíos
const config: ConfigItem[] = [];

// 3. Tipos complejos que no son obvios
const state: Record<string, AppState> = {};
```

---

### 5. Interfaces sobre Tipos (Generalmente)

Interfaces son más apropiadas para definir contratos de objetos. Los tipos para uniones y tipos avanzados.

**✅ Correcto:**
```typescript
// Para estructuras de objetos - Interface
interface User {
  id: number;
  name: string;
  email: string;
}

interface Repository<T> {
  findById(id: number): Promise<T>;
  save(item: T): Promise<void>;
}

// Para tipos complejos - Type
type Id = string | number;
type Result<T> = { success: true; data: T } | { success: false; error: string };
type Callback<T> = (data: T) => void;

// Literal types y unions - Type
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Theme = 'light' | 'dark';
```

---

### 6. Usa Genéricos Correctamente

Los genéricos hacen tu código reutilizable con seguridad de tipos.

**✅ Correcto:**
```typescript
// Genérico simple
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

// Genérico con constraints
interface HasId {
  id: number;
}

function printId<T extends HasId>(obj: T): void {
  console.log(obj.id);
}

// Genéricos en funciones
function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  return { ...obj1, ...obj2 };
}

// Genéricos con defaults
type Page<T = any> = {
  items: T[];
  total: number;
};
```

---

### 7. Readonly para Inmutabilidad

Utiliza `readonly` para comunicar intención y prevenir mutaciones.

**✅ Correcto:**
```typescript
interface AppConfig {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

// ReadonlyArray
function logItems(items: readonly string[]): void {
  // items.push('new'); // ❌ Error: no se puede modificar
  console.log(items.length);
}

// Readonly properties
type User = {
  readonly id: number;
  readonly email: string;
};
```

---

### 8. Manejo de Errores Robusto

Utiliza discriminated unions para manejo de errores consistente.

**✅ Correcto:**
```typescript
type Result<T, E = Error> =
  | { kind: 'ok'; value: T }
  | { kind: 'error'; error: E };

function fetchUser(id: number): Result<User> {
  try {
    // simulación
    return { kind: 'ok', value: { id, name: 'Juan' } };
  } catch (e) {
    return { kind: 'error', error: e instanceof Error ? e : new Error(String(e)) };
  }
}

// Uso seguro
const result = fetchUser(1);
if (result.kind === 'ok') {
  console.log(result.value.name);
} else {
  console.error(result.error.message);
}
```

**✅ Con causa (TypeScript 5.9+):**
```typescript
try {
  doSomething();
} catch (error) {
  // Preserva el error original
  throw new Error('Operación fallida', { cause: error });
}
```

---

### 9. Usa `keyof` para Seguridad de Keys

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // 'id' | 'name' | 'email'

function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: 'María', email: 'maria@test.com' };
const userId = getProperty(user, 'id'); // ✅ Correcto
const invalid = getProperty(user, 'invalid'); // ❌ Error en compilación
```

---

### 10. Template Literal Types (5.8+)

Crea tipos dinámicos altamente específicos.

**✅ Correcto:**
```typescript
type Size = 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline';

type ButtonClass = `btn-${Size}-${Variant}`;
// Resulta en: 'btn-sm-solid' | 'btn-sm-outline' | 'btn-md-solid' | ...

// Más útil aún: API colors
type Color = 'red' | 'green' | 'blue';
type ColorCode = `#${Color}`;

// Validar rutas con tipado
type ApiEndpoint = `/api/${string}`;
const endpoint: ApiEndpoint = `/api/users`; // ✅
```

---

### 11. Conditional Types para Lógica Avanzada

```typescript
// Extraer tipo de promesa
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>; // string
type B = Awaited<number>; // number

// Verificar si es función
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

// Tipos más complejos
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number
```

---

### 12. Linting y Formateo Consistente

**`tsconfig.json` con ESLint:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**`.eslintrc.json`:**
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2024,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-types": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-throw-literal": "error"
  }
}
```

---

## Antipatrones a Evitar

### ❌ Antipatrón 1: Usar `any` Como Atajo

```typescript
// ❌ MALO
function process(data: any) {
  return data.name.toUpperCase(); // Puede fallar en runtime
}

// ✅ BUENO
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    const name = (data as { name: unknown }).name;
    if (typeof name === 'string') {
      return name.toUpperCase();
    }
  }
  throw new Error('Datos inválidos');
}
```

---

### ❌ Antipatrón 2: No Usar `strict: true`

```json
{
  "compilerOptions": {
    "strict": false  // ❌ MALO: Desactiva muchas comprobaciones
  }
}
```

```json
{
  "compilerOptions": {
    "strict": true   // ✅ BUENO: Máxima seguridad de tipos
  }
}
```

**Por qué es crítico:**
- `noImplicitAny` - No permite `any` implícito
- `strictNullChecks` - `null/undefined` deben ser explícitos
- `strictFunctionTypes` - Verificación estricta de tipos de función
- `strictBindCallApply` - Verificación de bind/call/apply
- `strictPropertyInitialization` - Las propiedades deben inicializarse
- `noImplicitThis` - `this` debe estar tipado

---

### ❌ Antipatrón 3: Ignorar `strictNullChecks`

```typescript
// ❌ MALO
function getName(user: User): string {
  return user.name.toUpperCase(); // Puede ser null/undefined
}

// ✅ BUENO
function getName(user: User): string {
  if (!user.name) {
    return 'DESCONOCIDO';
  }
  return user.name.toUpperCase();
}

// O mejor, con tipos opcionales claros
function getName(user: User): string {
  return (user.name ?? 'DESCONOCIDO').toUpperCase();
}
```

---

### ❌ Antipatrón 4: Usar Union Types Incorrectamente

```typescript
// ❌ MALO: Union tipo demasiado amplio sin narrowing
function process(value: string | number | boolean | null | undefined) {
  return value.toString(); // TypeScript no sabe qué hacer
}

// ✅ BUENO: Discriminar explícitamente
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// ✅ MEJOR: Usar discriminated union
type Input =
  | { type: 'text'; value: string }
  | { type: 'number'; value: number };

function process(input: Input): string {
  if (input.type === 'text') {
    return input.value.toUpperCase();
  }
  return input.value.toFixed(2);
}
```

---

### ❌ Antipatrón 5: Type Assertions sin Validación

```typescript
// ❌ MALO: Type casting sin verificar
const data = JSON.parse(jsonString) as User;
console.log(data.email.length); // ¿Realmente es User?

// ✅ BUENO: Validar antes de castear
function parseUser(jsonString: string): User {
  const data = JSON.parse(jsonString);
  
  if (!data.id || !data.email || !data.name) {
    throw new Error('Datos de usuario inválidos');
  }
  
  return data as User;
}

// ✅ MEJOR: Usar un schema validator
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string()
});

function parseUser(jsonString: string): User {
  return UserSchema.parse(JSON.parse(jsonString));
}
```

---

### ❌ Antipatrón 6: No Usar Interfaces para Objetos

```typescript
// ❌ MALO
function createUser(user: { id: number; name: string; email: string }) {
  // Repetido, difícil de mantener
}

// ✅ BUENO
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(user: User) {
  // Claro, reutilizable, mantenible
}
```

---

### ❌ Antipatrón 7: Genéricos Demasiado Complejos

```typescript
// ❌ MALO: Imposible de entender
type Complex<T extends any[], U extends (...args: any[]) => any> = 
  T extends [infer First, ...infer Rest] 
    ? First extends Parameters<U>[0]
      ? [ReturnType<U>, ...Complex<Rest, U>]
      : never
    : [];

// ✅ BUENO: Mantén genéricos simples y bien documentados
/**
 * Transforma un array usando una función mapeadora
 * @template T - El tipo de entrada
 * @template U - El tipo de salida
 */
function map<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}
```

---

### ❌ Antipatrón 8: Perder Contexto de Errores

```typescript
// ❌ MALO
try {
  doSomething();
} catch (error) {
  throw new Error('Operación fallida'); // Se pierde el contexto original
}

// ✅ BUENO: Preservar la causa del error
try {
  doSomething();
} catch (error) {
  throw new Error('Operación fallida', { 
    cause: error instanceof Error ? error : new Error(String(error))
  });
}

// ✅ BUENO: Enriquecer el error con contexto
try {
  doSomething();
} catch (error) {
  const appError = new Error('Operación fallida');
  appError.cause = error;
  throw appError;
}
```

---

### ❌ Antipatrón 9: Declaración de Tipos Innecesaria

```typescript
// ❌ MALO: Verbosidad innecesaria
const numbers: number[] = [1, 2, 3, 4, 5];
const config: { host: string; port: number } = { host: 'localhost', port: 3000 };

// ✅ BUENO: Dejar que TypeScript infiera
const numbers = [1, 2, 3, 4, 5];
const config = { host: 'localhost', port: 3000 };

// ✅ NECESARIO: Cuando la inferencia no es clara
const settings: Record<string, unknown> = loadSettings();
const items: string[] = []; // Array vacío necesita tipo
```

---

### ❌ Antipatrón 10: Ignorar Error Handling en Catch

```typescript
// ❌ MALO
try {
  fetchData();
} catch {
  console.log('Error'); // No sabemos qué es el error
}

// ✅ BUENO: TypeScript 5.8+ usa unknown por defecto
try {
  fetchData();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('Error desconocido:', error);
  }
}

// ✅ MEJORA: Crear utility para normalizar errores
function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === 'string') return new Error(value);
  return new Error(String(value));
}

try {
  fetchData();
} catch (error) {
  const err = ensureError(error);
  logger.error(err);
}
```

---

## Configuración Recomendada

### tsconfig.json Óptimo

```json
{
  "compilerOptions": {
    // Versión y módulos
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    
    // Seguridad de tipos - CRÍTICO
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Validaciones adicionales
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "useDefineForClassFields": true,
    "noImplicitOverride": true,
    
    // Interoperabilidad
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    
    // Output y debugging
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    
    // Rendimiento
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## Características Modernas

### TypeScript 5.8 - Características Nuevas

#### 1. Mejor Inferencia de Condicionales

```typescript
// TypeScript 5.8+ ahora infiere mejor los tipos en condicionales
function getStatus(isActive: boolean): string {
  if (isActive) {
    return "active";  // TypeScript sabe que es string
  }
  return "inactive";   // TypeScript sabe que es string
}

// Funciona perfectamente con return types
function getConfig(env: 'dev' | 'prod'): number {
  if (env === 'dev') {
    return 3000;     // ✅ Correcto, es number
  }
  return 8080;       // ✅ Correcto, es number
}
```

#### 2. Require() para ESM

```typescript
// Con --module nodenext, ahora funciona correctamente
const { readFile } = require('fs');
const data = readFile('file.txt', 'utf-8');
```

#### 3. Flag `--erasableSyntaxOnly`

```typescript
// Con Node.js 23.6+, TypeScript puede ejecutarse sin transpilación
// Las anotaciones de tipo se pueden eliminar sin cambiar el significado
const name: string = "Juan";      // Erasable
const age: number = 30;           // Erasable
const decorator: (t: any) => any; // NO erasable - tiene semántica de runtime
```

---

### TypeScript 5.9 - Características Nuevas

#### 1. `import defer` para Lazy Loading

```typescript
// Carga perezosa de módulos con defer
import defer { HeavyComponent } from './heavy-component.js';

async function loadUI() {
  // Carga solo cuando se necesita
  const component = await HeavyComponent;
}
```

**Beneficios:**
- Reduce tamaño del bundle inicial
- Mejor UX: primera renderización más rápida
- Type-safe: TypeScript verifica el tipo

#### 2. Defaults Mejorados para `tsc --init`

```bash
# Ahora genera una configuración moderna por defecto
tsc --init
```

Defaults automáticos:
- `module: "esnext"` - Moderno ESM
- `target: "es2023"` - Características modernas
- `importsNotUsedAsValues: "error"` - Imports limpios
- `strict: true` - Máxima seguridad

---

### Mejoras de Rendimiento (5.8+)

TypeScript 5.8+ es **significativamente más rápido:**
- ✅ Menos asignación de memoria en normalización de paths
- ✅ Caché mejorada para cambios menores
- ✅ Mejor paralelización

```bash
# Benchmark típico:
# 5.7: 15.2s
# 5.8: 12.1s
# 5.9: 11.8s
```

---

## Guía de Migración

### De TypeScript 4.x a 5.8+

#### Paso 1: Actualizar `tsconfig.json`

```json
{
  "compilerOptions": {
    // Nuevas opciones recomendadas
    "target": "ES2023",           // Era: "ES2020"
    "module": "ESNext",            // Era: "commonjs"
    "moduleResolution": "bundler"  // Nuevo en 5.x
  }
}
```

#### Paso 2: Habilitar `strict` Completamente

```bash
# Ejecutar en modo strict
npx tsc --strict --noEmit

# Reparar errores encontrados
```

#### Paso 3: Actualizar Error Handling

```typescript
// Antes (4.x)
try {
  something();
} catch (e) {
  // e era implícitamente any
}

// Después (5.8+)
try {
  something();
} catch (e: unknown) {
  // e es explícitamente unknown
  const error = e instanceof Error ? e : new Error(String(e));
}
```

#### Paso 4: Aprovechar Nuevas Características

```typescript
// Template literal types (5.4+)
type EventName = `on${Capitalize<'change' | 'submit'>}`;

// satisfies operator (5.4+)
const colors = {
  primary: '#0066ff',
  secondary: '#ff0066'
} satisfies Record<string, string>;

// Conditional return types mejorado (5.8+)
function processValue<T>(input: T): T extends string ? string : number {
  // Mejor inferencia ahora
}
```

---

## Checklist de Implementación

- [ ] `"strict": true` en tsconfig.json
- [ ] ESLint con `@typescript-eslint` configurado
- [ ] Pre-commit hooks para verificar tipos
- [ ] No usar `any`, buscar alternativa
- [ ] Type guards para `unknown`
- [ ] Interfaces bien documentadas
- [ ] Genéricos con constraints claros
- [ ] Error handling con discriminated unions
- [ ] Readonly donde sea apropiado
- [ ] Tests tipados para valores críticos

---

## Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript 5.8 Release Notes](https://devblogs.microsoft.com/typescript/)
- [TypeScript 5.9 Release Notes](https://devblogs.microsoft.com/typescript/)
- [@typescript-eslint](https://typescript-eslint.io/)

---

**Mantén tu código type-safe, legible y mantenible. TypeScript está aquí para ayudarte. 🚀**
