```markdown
# 5. ALGORITMO DE PROGRESION

---

## Resumen
Definir la lógica que distribuye objetivos por semanas dentro de una planificación teniendo en cuenta: dificultad, dependencias (padre-hijo), balance de categorías (técnica/táctica/física/psicológica) y tiempo disponible.

## Inputs
- Lista de objetivos: {id, dificultad (1-10), categoria, objetivo_padre_id}
- Duración de temporada: N semanas
- Entrenamientos por semana
- Restricciones del usuario (e.g., maximizar variedad por categoria)

## Output
- Asignación de semanas a cada objetivo: {objetivo_id, semana_inicio, semana_fin}

## Heurística propuesta (iterativa simple)
1. Ordenar objetivos por (dificultad ascendente, dependencia topology)
2. Calcular rango de semanas por dificultad (ej: 1-3 -> 30% inicial; 4-6 -> 30-70%; 7-10 -> últimos 30%)
3. Asignar objetivos a bloques de semanas respetando dependencias (orden topológico)
4. Validar que no hay solapamientos que violen dependencias; desplazar un objetivo si hace falta
5. Balancear categorías: ajustar para evitar 3+ semanas seguidas centradas en la misma categoría

## Casos límites
- Si total de objetivo-minutos > capacidad_total: Priorizar por prioridad, dividir grandes objetivos en subtareas
- Si la dependencia produce ciclo: invalidar y pedir corrección manual
- Si hay pocos objetivos: distribuir objetivos de repaso (repetición ligera) para mantener ritmo

## Pseudocódigo
```
function distribuirObjetivos(objetivos, totalSemanas) {
  // validar grafo y calcular topological order
  let ordenTopologico = topologicalSort(objetivos);
  // dividir semanas por dificultad
  let semanasPorDificultad = calcularRangos(totalSemanas);
  // asignacion inicial
  let asignaciones = [];
  let cursorSemana = 1;
  for (o in ordenTopologico) {
    let rango = semanasPorDificultad[o.dificultad]
    // asignar en el primer slot disponible dentro de rango
    let asign = findSlot(cursorSemana, rango, asignaciones)
    asignaciones.push({id: o.id, semana_inicio: asign.start, semana_fin: asign.end})
    cursorSemana = asign.end + 1
  }
  // balance category
  balanceCategorías(asignaciones)
  return asignaciones
}
```

## Validación y Tests sugeridos
- Caso simple: 3 objetivos sin dependencias -> distribuir equitativamente
- Dependencias lineales: A -> B -> C -> verificar orden
- Dificultad mezcla: mezclar y verificar que dificiles al final

## Observaciones
- Empezar con heurística y reglas sencillas. Si más adelante se necesita, modelar como CSP o usar optimización (ILP) o ML para sugerencias de re-planificación.

---
**Estado:** borrador — sugerir implementar con pruebas unitarias y un endpoint de preview para validar en UI

## API: Preview EndPoint (Spec)
Para permitir a la UI mostrar un 'preview' antes de persistir la distribución, definimos un endpoint:

- POST /api/v1/planificaciones/{planificacionId}/preview-distribute
  - Body: { objetivos: [{ id, dificultad, objetivo_padre_id }], totalWeeks: integer }
  - Response: { assignment: [{ objetivo_id, semana_inicio, semana_fin }] }
  - Permisos: JWT Bearer
  - Uso: UI llama este endpoint para mostrar resultados antes de confirmar la asignación definitiva.

```
