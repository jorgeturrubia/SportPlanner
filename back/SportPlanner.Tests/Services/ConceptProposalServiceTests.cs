using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using SportPlanner.Application.DTOs.Proposal;
using SportPlanner.Application.Mappings;
using SportPlanner.Data;
using SportPlanner.Enums;
using SportPlanner.Models;
using SportPlanner.Services;
using Xunit;

namespace SportPlanner.Tests.Services;

public class ConceptProposalServiceTests
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ConceptProposalService _service;

    public ConceptProposalServiceTests()
    {
        // Setup in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        // Setup AutoMapper
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<TeamProfile>();
            cfg.AddProfile<SportConceptProfile>();
            cfg.AddProfile<LookupProfile>();
        });
        _mapper = config.CreateMapper();

        _service = new ConceptProposalService(_context, _mapper);
    }

    [Fact]
    public async Task GenerateProposals_ReturnsProposals_WhenTeamAndConceptsExist()
    {
        // Arrange
        var teamCategory = new TeamCategory { Id = 1, Name = "U14", MinAge = 13, MaxAge = 14 };
        var team = new Team
        {
            Id = 1,
            Name = "Test Team",
            CurrentTechnicalLevel = 5,
            CurrentTacticalLevel = 5,
            TeamCategory = teamCategory,
            TeamCategoryId = 1
        };
        
        var conceptCategory = new ConceptCategory { Id = 1, Name = "Técnica Individual" };
        var concept = new SportConcept
        {
            Id = 1,
            Name = "Cambio de dirección",
            TechnicalDifficulty = 5,
            TacticalComplexity = 3,
            DevelopmentLevel = "4",
            ConceptCategory = conceptCategory,
            ConceptCategoryId = 1,
            IsActive = true
        };

        _context.TeamCategories.Add(teamCategory);
        _context.Teams.Add(team);
        _context.ConceptCategories.Add(conceptCategory);
        _context.SportConcepts.Add(concept);
        await _context.SaveChangesAsync();

        var request = new ConceptProposalRequestDto { TeamId = 1 };

        // Act
        var result = await _service.GenerateProposalsAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Team.Should().NotBeNull();
        result.Team.Id.Should().Be(1);
        result.Metadata.TotalAvailableConcepts.Should().Be(1);
    }

    [Fact]
    public async Task GenerateProposals_ReturnsHighScore_WhenConceptMatchesTeamLevel()
    {
        // Arrange
        var teamCategory = new TeamCategory { Id = 1, Name = "U14", MinAge = 13, MaxAge = 14 };
        var team = new Team
        {
            Id = 1,
            Name = "Test Team",
            CurrentTechnicalLevel = 5,
            CurrentTacticalLevel = 5,
            TeamCategory = teamCategory,
            TeamCategoryId = 1
        };
        
        var conceptCategory = new ConceptCategory { Id = 1, Name = "Técnica Individual" };
        var matchingConcept = new SportConcept
        {
            Id = 1,
            Name = "Perfect Match Concept",
            TechnicalDifficulty = 5, // Matches team level
            TacticalComplexity = 5,  // Matches team level
            DevelopmentLevel = "4",  // Matches U14 expected level
            ConceptCategory = conceptCategory,
            ConceptCategoryId = 1,
            IsActive = true
        };

        _context.TeamCategories.Add(teamCategory);
        _context.Teams.Add(team);
        _context.ConceptCategories.Add(conceptCategory);
        _context.SportConcepts.Add(matchingConcept);
        await _context.SaveChangesAsync();

        var request = new ConceptProposalRequestDto { TeamId = 1 };

        // Act
        var result = await _service.GenerateProposalsAsync(request);

        // Assert
        result.SuggestedGroups.Should().NotBeEmpty();
        var suggestedConcept = result.SuggestedGroups
            .SelectMany(g => g.Concepts)
            .FirstOrDefault(c => c.Concept.Id == 1);
        
        suggestedConcept.Should().NotBeNull();
        suggestedConcept!.Score.Should().BeGreaterOrEqualTo(0.7m);
    }

    [Fact]
    public async Task GenerateProposals_ReturnsLowScore_WhenConceptIsTooAdvanced()
    {
        // Arrange
        var teamCategory = new TeamCategory { Id = 1, Name = "U10", MinAge = 9, MaxAge = 10 };
        var team = new Team
        {
            Id = 1,
            Name = "Young Team",
            CurrentTechnicalLevel = 2,
            CurrentTacticalLevel = 2,
            TeamCategory = teamCategory,
            TeamCategoryId = 1
        };
        
        var conceptCategory = new ConceptCategory { Id = 1, Name = "Táctica Colectiva" };
        var advancedConcept = new SportConcept
        {
            Id = 1,
            Name = "Advanced Concept",
            TechnicalDifficulty = 9, // Way above team level
            TacticalComplexity = 9,  // Way above team level
            DevelopmentLevel = "6",  // Senior level
            ConceptCategory = conceptCategory,
            ConceptCategoryId = 1,
            IsActive = true
        };

        _context.TeamCategories.Add(teamCategory);
        _context.Teams.Add(team);
        _context.ConceptCategories.Add(conceptCategory);
        _context.SportConcepts.Add(advancedConcept);
        await _context.SaveChangesAsync();

        var request = new ConceptProposalRequestDto { TeamId = 1 };

        // Act
        var result = await _service.GenerateProposalsAsync(request);

        // Assert
        // Concept should not be in suggested (score < 0.7)
        result.SuggestedGroups
            .SelectMany(g => g.Concepts)
            .Any(c => c.Concept.Id == 1)
            .Should().BeFalse();
    }

    [Fact]
    public async Task GenerateProposals_ThrowsException_WhenTeamNotFound()
    {
        // Arrange
        var request = new ConceptProposalRequestDto { TeamId = 999 };

        // Act & Assert
        var act = () => _service.GenerateProposalsAsync(request);
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*999*not found*");
    }

    [Fact]
    public async Task GenerateProposals_ExcludesCategories_WhenSpecified()
    {
        // Arrange
        var teamCategory = new TeamCategory { Id = 1, Name = "U14", MinAge = 13, MaxAge = 14 };
        var team = new Team
        {
            Id = 1,
            Name = "Test Team",
            CurrentTechnicalLevel = 5,
            CurrentTacticalLevel = 5,
            TeamCategory = teamCategory,
            TeamCategoryId = 1
        };
        
        var category1 = new ConceptCategory { Id = 1, Name = "Category A" };
        var category2 = new ConceptCategory { Id = 2, Name = "Category B" };
        
        var concept1 = new SportConcept
        {
            Id = 1,
            Name = "Concept A",
            TechnicalDifficulty = 5,
            TacticalComplexity = 5,
            DevelopmentLevel = "4",
            ConceptCategory = category1,
            ConceptCategoryId = 1,
            IsActive = true
        };
        
        var concept2 = new SportConcept
        {
            Id = 2,
            Name = "Concept B",
            TechnicalDifficulty = 5,
            TacticalComplexity = 5,
            DevelopmentLevel = "4",
            ConceptCategory = category2,
            ConceptCategoryId = 2,
            IsActive = true
        };

        _context.TeamCategories.Add(teamCategory);
        _context.Teams.Add(team);
        _context.ConceptCategories.AddRange(category1, category2);
        _context.SportConcepts.AddRange(concept1, concept2);
        await _context.SaveChangesAsync();

        var request = new ConceptProposalRequestDto 
        { 
            TeamId = 1, 
            ExcludeCategoryIds = new List<int> { 2 } 
        };

        // Act
        var result = await _service.GenerateProposalsAsync(request);

        // Assert
        var allConcepts = result.SuggestedGroups
            .Concat(result.OptionalGroups)
            .SelectMany(g => g.Concepts);
        
        allConcepts.Any(c => c.Concept.ConceptCategoryId == 2).Should().BeFalse();
        allConcepts.Any(c => c.Concept.ConceptCategoryId == 1).Should().BeTrue();
    }

    [Fact]
    public async Task GetProposalsForTeamAsync_ReturnsNull_WhenTeamNotFound()
    {
        // Act
        var result = await _service.GetProposalsForTeamAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GenerateProposals_ProgressiveChallenge_ReceivesGoodScore()
    {
        // Arrange - Test that concepts slightly above team level get good scores
        var teamCategory = new TeamCategory { Id = 1, Name = "U12", MinAge = 11, MaxAge = 12 };
        var team = new Team
        {
            Id = 1,
            Name = "Test Team",
            CurrentTechnicalLevel = 4,
            CurrentTacticalLevel = 4,
            TeamCategory = teamCategory,
            TeamCategoryId = 1
        };
        
        var conceptCategory = new ConceptCategory { Id = 1, Name = "Técnica Individual" };
        var progressiveConcept = new SportConcept
        {
            Id = 1,
            Name = "Progressive Challenge",
            TechnicalDifficulty = 5, // 1 above team (optimal challenge)
            TacticalComplexity = 5,  // 1 above team (optimal challenge)
            DevelopmentLevel = "3",
            ConceptCategory = conceptCategory,
            ConceptCategoryId = 1,
            IsActive = true
        };

        _context.TeamCategories.Add(teamCategory);
        _context.Teams.Add(team);
        _context.ConceptCategories.Add(conceptCategory);
        _context.SportConcepts.Add(progressiveConcept);
        await _context.SaveChangesAsync();

        var request = new ConceptProposalRequestDto { TeamId = 1 };

        // Act
        var result = await _service.GenerateProposalsAsync(request);

        // Assert
        result.SuggestedGroups.Should().NotBeEmpty();
        var concept = result.SuggestedGroups
            .SelectMany(g => g.Concepts)
            .FirstOrDefault(c => c.Concept.Id == 1);
        
        concept.Should().NotBeNull();
        concept!.Priority.Should().Be(ProposalPriority.Progressive);
    }
}
