#!/usr/bin/env python3
"""
Business Context Enrichment for Claude Code
Automatically adds domain-specific context based on project type
"""

import json
import sys
import re
import os
from pathlib import Path

def enrich_business_context():
    """UserPromptSubmit hook: Add business domain context"""
    try:
        input_data = json.load(sys.stdin)
        prompt = input_data.get('prompt', '')
        
        # Load project context from CLAUDE.md
        project_root = Path(os.environ.get('CLAUDE_PROJECT_DIR', '.'))
        claude_md_path = project_root / 'CLAUDE.md'
        
        business_context = []
        domain_keywords = {}
        
        # Parse CLAUDE.md for business context
        if claude_md_path.exists():
            with open(claude_md_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Extract business domain type
            if 'deportiva' in content.lower() or 'deportes' in content.lower():
                domain_keywords = {
                    'sports': ['atleta', 'entrenador', 'ejercicio', 'rutina', 'métrica', 'rendimiento', 'equipo', 'temporada', 'entrenamiento'],
                    'entities': ['User', 'Athlete', 'Coach', 'Exercise', 'Routine', 'Metric', 'Team', 'Season', 'Training'],
                    'context_type': 'sports'
                }
            elif 'facturación' in content.lower() or 'invoice' in content.lower():
                domain_keywords = {
                    'billing': ['cliente', 'factura', 'producto', 'servicio', 'precio', 'impuesto', 'pago', 'descuento'],
                    'entities': ['Customer', 'Invoice', 'Product', 'Service', 'Price', 'Tax', 'Payment', 'Discount'],
                    'context_type': 'billing'
                }
            elif 'ecommerce' in content.lower() or 'tienda' in content.lower():
                domain_keywords = {
                    'ecommerce': ['producto', 'categoria', 'carrito', 'pedido', 'inventario', 'cliente', 'venta'],
                    'entities': ['Product', 'Category', 'Cart', 'Order', 'Inventory', 'Customer', 'Sale'],
                    'context_type': 'ecommerce'
                }
        
        # Analyze prompt for domain-specific terms
        prompt_lower = prompt.lower()
        
        # Sports domain context
        if domain_keywords.get('context_type') == 'sports':
            if any(keyword in prompt_lower for keyword in ['usuario', 'user', 'atleta', 'entrenador']):
                business_context.append("🏃‍♂️ CONTEXTO DEPORTIVO: Considera roles específicos (Atleta, Entrenador, Admin), métricas de rendimiento y planes de entrenamiento")
            
            if any(keyword in prompt_lower for keyword in ['ejercicio', 'rutina', 'entrenamiento', 'training']):
                business_context.append("💪 ENTRENAMIENTO: Incluye campos como duración, intensidad, grupos musculares, progresión y métricas de rendimiento")
            
            if any(keyword in prompt_lower for keyword in ['equipo', 'team', 'grupo']):
                business_context.append("👥 GESTIÓN DE EQUIPOS: Considera roles, comunicación, calendarios compartidos y estadísticas grupales")
        
        # Billing domain context
        elif domain_keywords.get('context_type') == 'billing':
            if any(keyword in prompt_lower for keyword in ['cliente', 'customer', 'factura', 'invoice']):
                business_context.append("💰 CONTEXTO FACTURACIÓN: Considera datos fiscales, métodos de pago, historial de transacciones y reportes contables")
            
            if any(keyword in prompt_lower for keyword in ['producto', 'servicio', 'precio', 'price']):
                business_context.append("📦 PRODUCTOS/SERVICIOS: Incluye códigos SKU, categorías, impuestos aplicables, descuentos y políticas de precios")
        
        # Add technical context based on entities mentioned
        if any(entity in prompt for entity in domain_keywords.get('entities', [])):
            business_context.append(f"🗄️ ENTIDADES DEL DOMINIO: Asegúrate de que los modelos de datos reflejen las relaciones de negocio específicas del dominio {domain_keywords.get('context_type', '')}")
        
        # Add integration patterns for the domain
        if len(business_context) > 0:
            if domain_keywords.get('context_type') == 'sports':
                business_context.append("📊 INTEGRACIÓN DEPORTIVA: APIs de métricas, notificaciones de progreso, sincronización de dispositivos wearables")
            elif domain_keywords.get('context_type') == 'billing':
                business_context.append("🔗 INTEGRACIÓN FACTURACIÓN: APIs de pasarelas de pago, sistemas contables, generación de PDFs, emails automáticos")
        
        # Output enriched context
        if business_context:
            context = "\n".join(business_context)
            print(context)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Business context enrichment error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    enrich_business_context()
