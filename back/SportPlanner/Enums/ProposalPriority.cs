namespace SportPlanner.Enums;

/// <summary>
/// Priority level for concept proposals based on team matching
/// </summary>
public enum ProposalPriority
{
    /// <summary>Conceptos base indispensables para el nivel</summary>
    Essential = 1,
    
    /// <summary>Recomendados para el nivel actual</summary>
    Recommended = 2,
    
    /// <summary>Desafío progresivo (ligeramente superior al nivel)</summary>
    Progressive = 3,
    
    /// <summary>Opcionales (pueden añadirse si hay tiempo disponible)</summary>
    Optional = 4
}
