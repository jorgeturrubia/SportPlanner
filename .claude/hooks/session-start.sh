#!/bin/bash

# ClaudePM Session Start Hook
# Provides context and suggestions when starting a Claude Code session

echo "🤖 ClaudePM: Initializing intelligent project assistance..."

PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
CLAUDE_DIR="$PROJECT_ROOT/.claude"

# Check if ClaudePM is installed
if [ ! -d "$CLAUDE_DIR" ]; then
    echo "ℹ️  ClaudePM not detected. To add intelligent project management:"
    echo "   Copy ClaudePM system to .claude/ directory"
    exit 0
fi

# Welcome message with project context
show_welcome() {
    echo ""
    echo "🎯 ClaudePM Enhanced Session Started"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "$PROJECT_ROOT/CLAUDE.md" ]; then
        echo "📊 Project context loaded from CLAUDE.md"
        
        # Extract key info from CLAUDE.md
        if grep -q "Health Score:" "$PROJECT_ROOT/CLAUDE.md" 2>/dev/null; then
            HEALTH_SCORE=$(grep "Health Score:" "$PROJECT_ROOT/CLAUDE.md" | head -1 | sed 's/.*Health Score: \([0-9]*\).*/\1/')
            echo "💚 Current Health Score: $HEALTH_SCORE/100"
        fi
        
        if grep -q "Domain:" "$PROJECT_ROOT/CLAUDE.md" 2>/dev/null; then
            DOMAIN=$(grep "Domain:" "$PROJECT_ROOT/CLAUDE.md" | head -1 | sed 's/.*Domain: \(.*\)/\1/')
            echo "🎯 Project Domain: $DOMAIN"
        fi
    else
        echo "📋 No project context found. Consider running: /analyze-project"
    fi
}

# Show available ClaudePM capabilities
show_capabilities() {
    echo ""
    echo "🚀 Available ClaudePM Commands:"
    echo "   /analyze-project     - Comprehensive project analysis"
    echo "   /enhance-testing     - Add comprehensive testing framework"
    echo "   /modernize-stack     - Update to latest technology patterns" 
    echo "   /health-check        - Quick project health assessment"
    echo ""
    echo "💡 Try asking: 'Help me improve my project systematically'"
}

# Check for pending suggestions
show_suggestions() {
    if [ -f "$CLAUDE_DIR/suggestions.md" ]; then
        echo "📌 Pending Suggestions:"
        cat "$CLAUDE_DIR/suggestions.md" | grep -E "^[0-9]+\." | head -3
        echo ""
    fi
    
    if [ -f "$CLAUDE_DIR/security-review-needed.md" ]; then
        echo "🔒 Security Review Needed - check $CLAUDE_DIR/security-review-needed.md"
        echo ""
    fi
}

# Check project activity
check_activity() {
    if [ -f "$CLAUDE_DIR/.last-activity" ]; then
        LAST_ACTIVITY=$(cat "$CLAUDE_DIR/.last-activity")
        echo "🕒 Last ClaudePM activity: $LAST_ACTIVITY"
        echo ""
    fi
}

# Smart recommendations based on project state
smart_recommendations() {
    echo "🎯 Smart Recommendations:"
    
    # Check if never analyzed
    if [ ! -f "$PROJECT_ROOT/CLAUDE.md" ]; then
        echo "   • Run /analyze-project to understand your project comprehensively"
        return
    fi
    
    # Check test coverage
    if grep -q "coverage.*[0-4][0-9]%" "$PROJECT_ROOT/CLAUDE.md" 2>/dev/null; then
        echo "   • Low test coverage detected - consider /enhance-testing"
    fi
    
    # Check for outdated patterns
    if [ -f "$PROJECT_ROOT/package.json" ] && grep -q "ngModule" "$PROJECT_ROOT" -r 2>/dev/null; then
        echo "   • Angular legacy patterns found - try /modernize-stack angular"
    fi
    
    # Check for missing CI/CD
    if [ ! -f "$PROJECT_ROOT/.github/workflows"* ] && [ ! -f "$PROJECT_ROOT/.gitlab-ci.yml" ]; then
        echo "   • No CI/CD detected - consider automation setup"
    fi
    
    echo ""
}

# Main execution
show_welcome
show_capabilities
show_suggestions
check_activity
smart_recommendations

# Log session start
echo "$(date): Claude Code session started" >> "$CLAUDE_DIR/hooks.log"

echo "🚀 Ready for intelligent development assistance!"
echo ""