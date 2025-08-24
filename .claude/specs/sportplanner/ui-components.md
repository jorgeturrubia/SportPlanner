# SportPlanner - Componentes de UI

## Arquitectura de Componentes Angular 20

### Estructura de Módulos
```
src/app/
├── core/                    # Servicios singleton
│   ├── auth/
│   ├── api/
│   └── guards/
├── shared/                  # Componentes reutilizables
│   ├── components/
│   ├── pipes/
│   └── directives/
├── features/                # Módulos de funcionalidad
│   ├── auth/
│   ├── dashboard/
│   ├── teams/
│   ├── plannings/
│   ├── trainings/
│   ├── marketplace/
│   └── reports/
└── layout/                  # Componentes de layout
```

## Componentes Principales

### 1. Layout Components

#### AppShell
```typescript
@Component({
  selector: 'app-shell',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <app-sidebar [isOpen]="sidebarOpen()" />
      <main class="lg:pl-64">
        <div class="px-4 py-8 sm:px-6 lg:px-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class AppShellComponent {
  sidebarOpen = signal(false);
}
```

#### Header Component
```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center">
          <button 
            (click)="toggleSidebar()"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500">
            <heroicons-bars-3 class="h-6 w-6" />
          </button>
          <h1 class="ml-4 text-2xl font-bold text-gray-900">SportPlanner</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <app-notifications />
          <app-user-menu />
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  
  toggleSidebar() {
    this.sidebarToggle.emit();
  }
}
```

### 2. Authentication Components

#### Login Component
```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en SportPlanner
          </h2>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
          
          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading()"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            @if (isLoading()) {
              <heroicons-arrow-path class="animate-spin h-5 w-5" />
            } @else {
              Iniciar Sesión
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  isLoading = signal(false);
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  
  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      try {
        await this.authService.login(this.loginForm.value);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        // Handle error
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
```

### 3. Subscription Components

#### Subscription Selection
```typescript
@Component({
  selector: 'app-subscription-selection',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Elige tu plan</h2>
        <p class="mt-4 text-lg text-gray-600">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (plan of subscriptionPlans(); track plan.type) {
          <div class="bg-white rounded-lg shadow-lg border-2 hover:border-blue-500 transition-colors">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900">{{ plan.name }}</h3>
              <div class="mt-4">
                <span class="text-3xl font-bold text-gray-900">{{ plan.price }}€</span>
                <span class="text-gray-600">/mes</span>
              </div>
              
              <ul class="mt-6 space-y-3">
                @for (feature of plan.features; track feature) {
                  <li class="flex items-center">
                    <heroicons-check class="h-5 w-5 text-green-500 mr-3" />
                    <span class="text-gray-700">{{ feature }}</span>
                  </li>
                }
              </ul>
              
              <button 
                (click)="selectPlan(plan.type)"
                class="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Seleccionar Plan
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class SubscriptionSelectionComponent {
  subscriptionPlans = signal([
    {
      type: 'free',
      name: 'Gratuito',
      price: 0,
      features: ['1 equipo', '15 entrenamientos', 'Funciones básicas']
    },
    {
      type: 'trainer',
      name: 'Entrenador',
      price: 29,
      features: ['Equipos ilimitados', 'Entrenamientos ilimitados', 'Conceptos personalizados', 'Itinerarios']
    },
    {
      type: 'club',
      name: 'Club',
      price: 99,
      features: ['Todo lo del plan Entrenador', 'Gestión múltiples equipos', 'Modo director', 'Analytics avanzados']
    }
  ]);
  
  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}
  
  async selectPlan(type: string) {
    try {
      await this.subscriptionService.createSubscription(type);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      // Handle error
    }
  }
}
```

### 4. Team Management Components

#### Team Card
```typescript
@Component({
  selector: 'app-team-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ team().name }}</h3>
          <span class="px-2 py-1 text-xs font-medium rounded-full" 
                [class]="getLevelBadgeClass(team().level)">
            Nivel {{ team().level }}
          </span>
        </div>
        
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center">
            <heroicons-users class="h-4 w-4 mr-2" />
            <span>{{ team().gender | titlecase }} - {{ team().ageCategory }}</span>
          </div>
          
          <div class="flex items-center">
            <heroicons-calendar class="h-4 w-4 mr-2" />
            <span>{{ activePlannings() }} planificaciones activas</span>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-3">
          <button 
            (click)="viewTeam()"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors">
            Ver Equipo
          </button>
          
          <button 
            (click)="editTeam()"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <heroicons-pencil class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  `
})
export class TeamCardComponent {
  @Input({ required: true }) team = input.required<Team>();
  @Output() teamSelected = new EventEmitter<Team>();
  @Output() teamEdit = new EventEmitter<Team>();
  
  activePlannings = computed(() => {
    // Calculate active plannings for this team
    return 0;
  });
  
  getLevelBadgeClass(level: string): string {
    const classes = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-blue-100 text-blue-800'
    };
    return classes[level as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }
  
  viewTeam() {
    this.teamSelected.emit(this.team());
  }
  
  editTeam() {
    this.teamEdit.emit(this.team());
  }
}
```

### 5. Training Components

#### Training Session View
```typescript
@Component({
  selector: 'app-training-session',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto py-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ training().name }}</h1>
            <p class="text-gray-600">{{ training().date | date:'fullDate' }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <app-timer [duration]="currentExercise()?.durationMinutes || 0" />
            
            @if (sessionStatus() === 'not-started') {
              <button 
                (click)="startSession()"
                class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Iniciar Entrenamiento
              </button>
            } @else if (sessionStatus() === 'in-progress') {
              <button 
                (click)="pauseSession()"
                class="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700">
                Pausar
              </button>
            }
          </div>
        </div>
      </div>
      
      <!-- Exercise Navigation -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Ejercicios</h2>
          <span class="text-sm text-gray-600">
            {{ currentExerciseIndex() + 1 }} de {{ exercises().length }}
          </span>
        </div>
        
        <div class="flex space-x-2 overflow-x-auto pb-2">
          @for (exercise of exercises(); track exercise.id; let i = $index) {
            <button 
              (click)="goToExercise(i)"
              class="flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              [class]="getExerciseButtonClass(i)">
              {{ i + 1 }}
            </button>
          }
        </div>
      </div>
      
      <!-- Current Exercise -->
      @if (currentExercise(); as exercise) {
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ exercise.name }}</h3>
            <p class="text-gray-600 mb-4">{{ exercise.description }}</p>
            
            @if (exercise.instructions) {
              <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 class="font-medium text-blue-900 mb-2">Instrucciones:</h4>
                <p class="text-blue-800">{{ exercise.instructions }}</p>
              </div>
            }
          </div>
          
          <!-- Navigation -->
          <div class="flex justify-between">
            <button 
              (click)="previousExercise()"
              [disabled]="currentExerciseIndex() === 0"
              class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50">
              <heroicons-chevron-left class="h-5 w-5 mr-1" />
              Anterior
            </button>
            
            <button 
              (click)="completeExercise()"
              class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
              Completar Ejercicio
            </button>
            
            <button 
              (click)="nextExercise()"
              [disabled]="currentExerciseIndex() === exercises().length - 1"
              class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50">
              Siguiente
              <heroicons-chevron-right class="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class TrainingSessionComponent {
  @Input({ required: true }) trainingId = input.required<string>();
  
  training = signal<Training | null>(null);
  exercises = signal<TrainingExercise[]>([]);
  currentExerciseIndex = signal(0);
  sessionStatus = signal<'not-started' | 'in-progress' | 'paused' | 'completed'>('not-started');
  
  currentExercise = computed(() => {
    const exercises = this.exercises();
    const index = this.currentExerciseIndex();
    return exercises[index] || null;
  });
  
  constructor(private trainingService: TrainingService) {}
  
  ngOnInit() {
    this.loadTraining();
  }
  
  async loadTraining() {
    const training = await this.trainingService.getTrainingDetail(this.trainingId());
    this.training.set(training);
    this.exercises.set(training.exercises);
  }
  
  startSession() {
    this.sessionStatus.set('in-progress');
    this.trainingService.startTrainingSession(this.trainingId());
  }
  
  pauseSession() {
    this.sessionStatus.set('paused');
  }
  
  goToExercise(index: number) {
    this.currentExerciseIndex.set(index);
  }
  
  previousExercise() {
    const current = this.currentExerciseIndex();
    if (current > 0) {
      this.currentExerciseIndex.set(current - 1);
    }
  }
  
  nextExercise() {
    const current = this.currentExerciseIndex();
    const total = this.exercises().length;
    if (current < total - 1) {
      this.currentExerciseIndex.set(current + 1);
    }
  }
  
  completeExercise() {
    const exercise = this.currentExercise();
    if (exercise) {
      this.trainingService.completeExercise(exercise.id);
      this.nextExercise();
    }
  }
  
  getExerciseButtonClass(index: number): string {
    const current = this.currentExerciseIndex();
    const exercise = this.exercises()[index];
    
    if (index === current) {
      return 'bg-blue-600 text-white';
    } else if (exercise?.isCompleted) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  }
}
```

## Shared Components

### Timer Component
```typescript
@Component({
  selector: 'app-timer',
  standalone: true,
  template: `
    <div class="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
      <heroicons-clock class="h-5 w-5 text-gray-600" />
      <span class="font-mono text-lg font-semibold" [class]="getTimerClass()">
        {{ formatTime(currentTime()) }}
      </span>
      
      <div class="flex space-x-1">
        @if (!isRunning()) {
          <button (click)="start()" class="p-1 text-green-600 hover:text-green-700">
            <heroicons-play class="h-4 w-4" />
          </button>
        } @else {
          <button (click)="pause()" class="p-1 text-yellow-600 hover:text-yellow-700">
            <heroicons-pause class="h-4 w-4" />
          </button>
        }
        
        <button (click)="reset()" class="p-1 text-gray-600 hover:text-gray-700">
          <heroicons-arrow-path class="h-4 w-4" />
        </button>
      </div>
    </div>
  `
})
export class TimerComponent implements OnDestroy {
  @Input() duration = input<number>(0); // in minutes
  @Input() countDown = input<boolean>(false);
  
  currentTime = signal(0);
  isRunning = signal(false);
  private intervalId?: number;
  
  ngOnInit() {
    const durationSeconds = this.duration() * 60;
    this.currentTime.set(this.countDown() ? durationSeconds : 0);
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  start() {
    this.isRunning.set(true);
    this.intervalId = window.setInterval(() => {
      const current = this.currentTime();
      const duration = this.duration() * 60;
      
      if (this.countDown()) {
        if (current > 0) {
          this.currentTime.set(current - 1);
        } else {
          this.pause();
        }
      } else {
        this.currentTime.set(current + 1);
      }
    }, 1000);
  }
  
  pause() {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  reset() {
    this.pause();
    const durationSeconds = this.duration() * 60;
    this.currentTime.set(this.countDown() ? durationSeconds : 0);
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  getTimerClass(): string {
    if (this.countDown()) {
      const remaining = this.currentTime();
      const duration = this.duration() * 60;
      const percentage = remaining / duration;
      
      if (percentage <= 0.1) return 'text-red-600';
      if (percentage <= 0.25) return 'text-yellow-600';
    }
    
    return 'text-gray-900';
  }
}
```

## Estilos y Temas

### Configuración de Tailwind CSS 4

#### styles.css (Configuración CSS Nativa)
```css
/* Tailwind CSS v4 */
@import "tailwindcss";

/* SportPlanner Custom Design System */
@theme {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-200: #e2e8f0;
  --color-secondary-300: #cbd5e1;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;
  
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  
  /* Fonts */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Custom component classes */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.card {
  @apply bg-white rounded-xl shadow-md border border-secondary-200 p-6;
}

.input-field {
  @apply w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}
```

#### .postcssrc.json
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Design System
- **Colores primarios**: Azul (#3b82f6)
- **Tipografía**: Inter font family
- **Espaciado**: Sistema de 4px base
- **Bordes**: Redondeados suaves (4-8px)
- **Sombras**: Sutiles para elevación
- **Iconos**: Hero Icons
- **Configuración**: Tailwind CSS 4 con CSS nativo

## Notas de Implementación

1. **Tailwind CSS 4**: Utiliza CSS nativo con `@theme` en lugar de archivos de configuración JavaScript
2. **Responsive Design**: Todos los componentes deben ser completamente responsivos
3. **Accesibilidad**: Implementar ARIA labels y navegación por teclado
4. **Performance**: Usar OnPush change detection y lazy loading
5. **Testing**: Cada componente debe tener tests unitarios
6. **Documentación**: Usar Storybook para documentar componentes

## Próximos Pasos

1. ✅ Proyecto Angular configurado con Tailwind CSS 4
2. ✅ Sistema de diseño base implementado en styles.css
3. Crear los componentes del layout principal
4. Desarrollar los componentes de autenticación
5. Implementar las páginas de funcionalidades principales

---
**Estado**: Componentes principales definidos con Tailwind CSS 4
**Siguiente**: Casos de prueba y validación