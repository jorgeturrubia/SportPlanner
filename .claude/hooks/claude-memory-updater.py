#!/usr/bin/env python3
"""
Hook PostToolUse que detecta cambios en documentación/agentes 
y sugiere actualizar CLAUDE.md automáticamente
"""
import json
import sys
import os

def should_trigger_update(file_path):
    """Detecta si el archivo modificado requiere actualizar CLAUDE.md"""
    trigger_paths = [
        '.claude/docs/',
        '.claude/agents/', 
        '.claude/commands/'
    ]
    return any(trigger in file_path for trigger in trigger_paths)

def get_change_type(file_path):
    """Determina el tipo de cambio para mensaje más específico"""
    if '.claude/docs/' in file_path:
        return "documentación"
    elif '.claude/agents/' in file_path:
        return "agentes"
    elif '.claude/commands/' in file_path:
        return "comandos"
    return "sistema"

try:
    # Leer input del hook
    input_data = json.load(sys.stdin)
    file_path = input_data.get('tool_input', {}).get('file_path', '')
    tool_name = input_data.get('tool_name', '')
    
    # Solo procesar cambios en archivos relevantes
    if should_trigger_update(file_path):
        change_type = get_change_type(file_path)
        
        print(f"🔄 Cambio detectado en {change_type}")
        print(f"📁 Archivo: {os.path.basename(file_path)}")
        
        # Mensaje estructurado para Claude Code
        output = {
            "decision": "block",
            "reason": f"Se detectaron cambios en {change_type} del sistema. El archivo CLAUDE.md podría necesitar actualización para reflejar estos cambios. ¿Quieres que el claude-memory-manager revise y actualice CLAUDE.md? Esto asegurará que Claude arranque con el contexto más reciente."
        }
        
        print(json.dumps(output))
        sys.exit(0)
    
    # No hay cambios relevantes, continuar normalmente
    sys.exit(0)
    
except Exception as e:
    # En caso de error, no bloquear el flujo principal
    print(f"Error en hook claude-memory-updater: {e}", file=sys.stderr)
    sys.exit(1)
