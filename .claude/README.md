# 🤖 Sistema de Agentes Claude Code

Sistema inteligente de agentes especializados para desarrollo, optimizado para tokens y auto-gestionado.

## 🚀 Inicio Rápido

```bash
# 1. Navegar al directorio del proyecto
cd C:\Proyectos\ClaudePm

# 2. Verificar sistema
/initsystem

# 3. Generar documentación del proyecto  
/generate-product-docs full

# 4. ¡El sistema está listo!
```

## 📁 Estructura del Sistema

```
.claude/
├── 📁 docs/                    # Documentación estratégica (3 archivos)
│   ├── 📄 PRODUCT.md           # QUÉ construir (casos uso, pantallas)
│   ├── 📄 ARCHITECTURE.md      # CÓMO construir (tech, componentes)
│   └── 📄 AGENTS.md            # Coordinación de agentes
├── 📁 agents/                  # Agentes especializados
│   ├── 📄 agent-generator.md   # 🏭 Crea otros agentes
│   └── 📄 claude-memory-manager.md # 🧠 Mantiene CLAUDE.md
├── 📁 commands/                # Comandos reutilizables
│   ├── 📄 initsystem.md        # ✅ Health check del sistema
│   ├── 📄 generate-product-docs.md # 📋 Genera documentación
│   └── 📄 update-claude-memory.md  # 🔄 Actualiza memoria
├── 📁 hooks/                   # Automatización
│   └── 📄 claude-memory-updater.py # 🔄 Auto-actualización
└── ⚙️ settings.json           # Configuración y hooks
```

## 🎯 Comandos Principales

| Comando | Función |
|---------|---------|
| `/initsystem` | Verifica sistema completo, sugiere qué falta |
| `/generate-product-docs` | Crea/actualiza documentación + analiza agentes |
| `/generate-agent [tipo]` | Crea agente específico optimizado |
| `/update-claude-memory` | Actualiza CLAUDE.md con cambios recientes |

## ✨ Características

- 🎯 **Token-Optimized**: Cada componente minimiza consumo de tokens
- 🤝 **Colaborativo**: Pregunta antes de modificar, nunca asume
- 🧠 **Auto-consciente**: Se diagnostica y mejora automáticamente
- 🔄 **Auto-mantenido**: Hooks mantienen documentación actualizada
- 📈 **Escalable**: Crece con el proyecto sin complejidad innecesaria

## 🔄 Flujo de Trabajo

1. **Inicialización**: `/initsystem` verifica todo esté configurado
2. **Análisis**: `/generate-product-docs` analiza proyecto y documentación
3. **Especialización**: Crear agentes según necesidades detectadas
4. **Desarrollo**: Agentes trabajan automáticamente
5. **Mantenimiento**: Sistema se actualiza automáticamente

## 🎮 Modo de Uso

El sistema está diseñado para ser **colaborativo**:
- Los comandos **preguntan** antes de hacer cambios
- Los agentes **reportan** lo que van a hacer
- El usuario **confirma** las acciones importantes
- El sistema **sugiere** próximos pasos

## 🔧 Personalización

- Modifica `settings.json` para ajustar permisos y hooks
- Crea agentes custom con `agent-generator`
- Extiende documentación según necesidades del proyecto
- Configura hooks adicionales para workflows específicos

---

**Sistema listo para uso en producción** ✅
