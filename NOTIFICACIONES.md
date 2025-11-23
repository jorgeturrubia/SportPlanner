# Sistema de Notificaciones - SportPlanner

## 📋 Descripción

Sistema completo de notificaciones para validar respuestas del backend y mantener al usuario informado en tiempo real. El sistema incluye:

- ✅ **Notificaciones automáticas** mediante interceptor HTTP
- 🎨 **Diseño Bold & Gritty** alineado con la identidad visual
- 🔔 **4 tipos de notificaciones**: Success, Error, Warning, Info
- ⚡ **Auto-dismiss** configurable con barra de progreso
- 🎯 **Acciones personalizadas** en las notificaciones
- 📱 **Diseño responsive** para móviles y tablets

---

## 🚀 Uso Básico

### 1. Notificaciones Automáticas (Recomendado)

El interceptor HTTP captura automáticamente todas las respuestas del backend y muestra notificaciones apropiadas:

```typescript
// ✅ Las notificaciones se muestran automáticamente
this.teamsService.createTeam(teamData).subscribe({
    next: (response) => {
        // El interceptor muestra: "Registro creado exitosamente"
        this.loadTeams();
    }
    // ❌ Los errores también se manejan automáticamente
});
```

### 2. Notificaciones Manuales

Para casos especiales donde necesitas control total:

```typescript
import { NotificationService } from './services/notification.service';

constructor(private notificationService: NotificationService) {}

// Notificación de éxito
this.notificationService.success(
    'Operación exitosa',
    'El equipo se creó correctamente'
);

// Notificación de error
this.notificationService.error(
    'Error al guardar',
    'No se pudo guardar el equipo. Intenta nuevamente.'
);

// Notificación de advertencia
this.notificationService.warning(
    'Atención',
    'Este equipo ya existe en tu lista'
);

// Notificación informativa
this.notificationService.info(
    'Información',
    'Los cambios se guardarán automáticamente'
);
```

---

## 🎯 Características Avanzadas

### Notificaciones con Acciones

```typescript
this.notificationService.show({
    type: NotificationType.WARNING,
    title: 'Cambios sin guardar',
    message: '¿Deseas guardar los cambios antes de salir?',
    duration: 0, // No se cierra automáticamente
    action: {
        label: 'Guardar',
        callback: () => {
            this.saveChanges();
        }
    }
});
```

### Control de Duración

```typescript
// Auto-dismiss en 3 segundos
this.notificationService.success('Guardado', 'Cambios guardados', 3000);

// Sin auto-dismiss (permanece hasta que el usuario la cierre)
this.notificationService.error('Error crítico', 'Revisa los datos', 0);
```

### Descartar Notificaciones

```typescript
// Descartar todas las notificaciones
this.notificationService.dismissAll();

// Descartar una notificación específica por ID
this.notificationService.dismiss(notificationId);
```

---

## 🔧 Configuración del Interceptor

### Excluir Endpoints

Si hay endpoints que no deben mostrar notificaciones automáticas, agrégalos a la lista de exclusión:

```typescript
// En: src/app/interceptors/notification.interceptor.ts

const excludedEndpoints = [
    '/auth/user',
    '/auth/session',
    '/lookup',
    '/tu-endpoint-aqui'  // ← Agregar aquí
];
```

### Mensajes Personalizados desde el Backend

El backend puede enviar mensajes personalizados usando headers HTTP:

```csharp
// En tu controlador de ASP.NET Core
Response.Headers.Add("X-Success-Message", "Equipo creado con éxito");
```

O en el body de la respuesta:

```csharp
return Ok(new { 
    success = true, 
    message = "Equipo creado con éxito",
    data = team 
});
```

---

## 🎨 Tipos de Notificación

### ✅ Success (Verde)
- Operaciones completadas exitosamente
- Creación, actualización, eliminación de registros
- Auto-dismiss: 5 segundos por defecto

### ❌ Error (Rojo)
- Errores del servidor o validación
- Problemas de conexión
- Auto-dismiss: Desactivado (requiere acción del usuario)

### ⚠️ Warning (Naranja)
- Advertencias importantes
- Confirmaciones necesarias
- Auto-dismiss: 7 segundos por defecto

### ℹ️ Info (Azul)
- Información general
- Mensajes informativos
- Auto-dismiss: 5 segundos por defecto

---

## 📦 Estructura de Archivos

```
src/app/
├── core/
│   └── models/
│       └── notification.model.ts          # Modelos y tipos
├── services/
│   └── notification.service.ts            # Servicio principal
├── interceptors/
│   └── notification.interceptor.ts        # Interceptor HTTP
└── shared/
    └── components/
        └── notification-container/
            ├── notification-container.component.ts
            ├── notification-container.component.html
            └── notification-container.component.css
```

---

## 🔍 Manejo de Errores HTTP

El sistema maneja automáticamente diferentes códigos de estado HTTP:

| Código | Título | Mensaje |
|--------|--------|---------|
| 0 | Error de conexión | No se pudo conectar con el servidor |
| 400 | Datos inválidos | Los datos enviados no son válidos |
| 401 | No autorizado | Tu sesión ha expirado |
| 403 | Acceso denegado | No tienes permisos para esta acción |
| 404 | No encontrado | El recurso no fue encontrado |
| 409 | Conflicto | Ya existe un registro con estos datos |
| 422 | Validación fallida | Los datos no cumplen los requisitos |
| 5xx | Error del servidor | El servidor encontró un error |

---

## 🎯 Validación de Errores del Backend

El sistema extrae automáticamente mensajes de validación de diferentes formatos:

### Formato 1: Array de errores
```json
{
    "errors": [
        { "message": "El nombre es requerido" },
        { "message": "El email no es válido" }
    ]
}
```

### Formato 2: Objeto de errores
```json
{
    "errors": {
        "name": ["El nombre es requerido"],
        "email": ["El email no es válido", "El email ya existe"]
    }
}
```

### Formato 3: Mensaje simple
```json
{
    "error": {
        "message": "Error de validación"
    }
}
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Crear un Equipo

```typescript
createTeam() {
    if (this.teamForm.valid) {
        this.isLoading.set(true);
        
        this.teamsService.createTeam(this.teamForm.value).subscribe({
            next: (response) => {
                // ✅ Notificación automática: "Registro creado exitosamente"
                this.loadTeams();
                this.showForm.set(false);
                this.teamForm.reset();
                this.isLoading.set(false);
            },
            error: (error) => {
                // ❌ Notificación automática con el mensaje del error
                this.isLoading.set(false);
            }
        });
    } else {
        // Notificación manual para validación del formulario
        this.notificationService.warning(
            'Formulario incompleto',
            'Por favor completa todos los campos requeridos'
        );
    }
}
```

### Ejemplo 2: Eliminar con Confirmación

```typescript
deleteTeam(teamId: number) {
    this.notificationService.show({
        type: NotificationType.WARNING,
        title: '¿Eliminar equipo?',
        message: 'Esta acción no se puede deshacer',
        duration: 0,
        action: {
            label: 'Confirmar',
            callback: () => {
                this.teamsService.deleteTeam(teamId).subscribe({
                    next: () => {
                        // ✅ Notificación automática: "Registro eliminado exitosamente"
                        this.loadTeams();
                    }
                });
            }
        }
    });
}
```

### Ejemplo 3: Operación Silenciosa

Si necesitas hacer una petición sin mostrar notificaciones:

```typescript
// Opción 1: Agregar el endpoint a la lista de exclusión en el interceptor

// Opción 2: Manejar el error sin dejar que llegue al interceptor
this.service.getData().subscribe({
    next: (data) => {
        // Procesar datos silenciosamente
    },
    error: (error) => {
        // Manejar error sin notificación
        console.error(error);
    }
});
```

---

## 🎨 Personalización de Estilos

Los estilos están en `notification-container.component.css` y usan las variables CSS globales:

```css
--color-primary: #FF6B00;    /* Naranja */
--color-secondary: #CCFF00;  /* Verde neón */
--color-dark-bg: #121212;    /* Fondo oscuro */
--color-danger: #FF0000;     /* Rojo */
```

Para personalizar:

1. Modifica las variables en `src/styles.css`
2. Ajusta los estilos específicos en `notification-container.component.css`

---

## 📱 Responsive Design

El sistema es totalmente responsive:

- **Desktop**: Notificaciones en la esquina superior derecha (420px de ancho)
- **Mobile**: Notificaciones ocupan todo el ancho con márgenes reducidos
- **Animaciones**: Suaves y optimizadas para todos los dispositivos

---

## ✅ Checklist de Implementación

- [x] Modelos de notificación creados
- [x] Servicio de notificaciones implementado
- [x] Componente de UI con animaciones
- [x] Interceptor HTTP configurado
- [x] Integración en app.config.ts
- [x] Componente agregado al template principal
- [x] @angular/animations instalado
- [x] Documentación completa

---

## 🚀 Próximos Pasos

1. **Probar el sistema**: Crea un equipo para ver las notificaciones en acción
2. **Personalizar mensajes**: Ajusta los mensajes según tus necesidades
3. **Agregar más acciones**: Implementa acciones personalizadas en las notificaciones
4. **Integrar con otros módulos**: Usa el sistema en todos tus componentes

---

## 🐛 Troubleshooting

### Las notificaciones no aparecen
- Verifica que `<app-notification-container>` esté en `app.html`
- Asegúrate de que `provideAnimations()` esté en `app.config.ts`
- Revisa la consola del navegador para errores

### Las animaciones no funcionan
- Verifica que `@angular/animations` esté instalado
- Asegúrate de que `provideAnimations()` esté configurado

### El interceptor no captura las peticiones
- Verifica que el interceptor esté en `app.config.ts`
- Revisa que el endpoint no esté en la lista de exclusión

---

## 📞 Soporte

Para más información o problemas, revisa:
- Código fuente en `src/app/services/notification.service.ts`
- Ejemplos en `src/app/features/dashboard/pages/teams/teams.component.ts`
