using System;
using System.Collections.Generic;
using SportPlanner.Models;

namespace SportPlanner.Application.DTOs.Planning
{
    public class UpdatePlanningDto
    {
        public string? Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public ICollection<PlaningScheduleDay>? ScheduleDays { get; set; }
        public ICollection<PlanConcept>? PlanConcepts { get; set; }
    }
}
