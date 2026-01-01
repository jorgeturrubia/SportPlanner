using SportPlanner.Models;

namespace SportPlanner.Services;

/// <summary>
/// Service for deep-cloning system content to a user's private space.
/// </summary>
public interface ICloningService
{
    /// <summary>
    /// Clones a system itinerary with all its templates, concepts, categories and exercises to the user's space.
    /// </summary>
    /// <param name="systemItineraryId">ID of the system itinerary to clone.</param>
    /// <param name="userId">ID of the user who will own the cloned content.</param>
    /// <returns>The cloned itinerary with user ownership.</returns>
    Task<MethodologicalItinerary> CloneItineraryAsync(int systemItineraryId, string userId);

    /// <summary>
    /// Clones a system template with all its concepts and categories to the user's space.
    /// </summary>
    /// <param name="systemTemplateId">ID of the system template to clone.</param>
    /// <param name="userId">ID of the user who will own the cloned content.</param>
    /// <returns>The cloned template with user ownership.</returns>
    Task<PlanningTemplate> CloneTemplateAsync(int systemTemplateId, string userId);

    /// <summary>
    /// Clones a system concept with its category to the user's space.
    /// </summary>
    /// <param name="systemConceptId">ID of the system concept to clone.</param>
    /// <param name="userId">ID of the user who will own the cloned content.</param>
    /// <returns>The cloned concept with user ownership.</returns>
    Task<SportConcept> CloneConceptAsync(int systemConceptId, string userId);

    /// <summary>
    /// Clones a system exercise with its concepts to the user's space.
    /// </summary>
    /// <param name="systemExerciseId">ID of the system exercise to clone.</param>
    /// <param name="userId">ID of the user who will own the cloned content.</param>
    /// <returns>The cloned exercise with user ownership.</returns>
    Task<Exercise> CloneExerciseAsync(int systemExerciseId, string userId);

    /// <summary>
    /// Clones a system category (and its parent hierarchy) to the user's space.
    /// </summary>
    /// <param name="systemCategoryId">ID of the system category to clone.</param>
    /// <param name="userId">ID of the user who will own the cloned content.</param>
    /// <returns>The cloned category with user ownership.</returns>
    Task<ConceptCategory> CloneCategoryAsync(int systemCategoryId, string userId);

    /// <summary>
    /// Checks if a system item has already been downloaded by the user.
    /// </summary>
    /// <param name="systemItemId">ID of the system item.</param>
    /// <param name="itemType">Type of item ("itinerary", "template", "concept", "category", "exercise").</param>
    /// <param name="userId">ID of the user.</param>
    /// <returns>True if the item has already been cloned.</returns>
    Task<bool> IsAlreadyDownloadedAsync(int systemItemId, string itemType, string userId);

    /// <summary>
    /// Efficiently checks which of the provided system IDs have already been downloaded by the user.
    /// </summary>
    /// <param name="systemItemIds">Collection of system IDs to check.</param>
    /// <param name="itemType">Type of item ("itinerary", "template", "concept", "category", "exercise").</param>
    /// <param name="userId">ID of the user.</param>
    /// <returns>A set containing the IDs that have been downloaded.</returns>
    Task<HashSet<int>> GetDownloadedIdsAsync(IEnumerable<int> systemItemIds, string itemType, string userId);
}
