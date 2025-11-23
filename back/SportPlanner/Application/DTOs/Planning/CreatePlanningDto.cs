using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SportPlanner.Models;

namespace SportPlanner.Application.DTOs.Planning
{
    public class CreatePlanningDto
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public int TeamId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public ICollection<PlaningScheduleDay> ScheduleDays { get; set; } = new List<PlaningScheduleDay>();
        public ICollection<PlanConcept> PlanConcepts { get; set; } = new List<PlanConcept>();
    }
}
