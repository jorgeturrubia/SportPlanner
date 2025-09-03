#!/bin/bash

# ClaudePM Post-Code-Change Hook
# Triggers after Write/Edit operations to maintain project health

echo "🔄 ClaudePM: Post-code-change automation..."

PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
CLAUDE_DIR="$PROJECT_ROOT/.claude"

# Check if ClaudePM is installed
if [ ! -d "$CLAUDE_DIR" ]; then
    echo "ℹ️  ClaudePM not detected in this project"
    exit 0
fi

# Function to log actions
log_action() {
    echo "$(date): $1" >> "$CLAUDE_DIR/hooks.log"
}

# Update project context if major files changed
update_context() {
    local changed_file="$1"
    
    # Check for significant configuration changes
    if [[ "$changed_file" =~ (package\.json|.*\.csproj|angular\.json|appsettings\.json)$ ]]; then
        log_action "Configuration file changed: $changed_file"
        echo "📊 Significant configuration change detected"
        
        # Suggest re-analysis
        cat > "$CLAUDE_DIR/suggestions.md" << 'EOF'
# 🔄 ClaudePM Suggestions

A significant configuration file was modified. Consider:

1. **Re-analyze project**: Use `/analyze-project` to update health assessment
2. **Check dependencies**: Verify no security vulnerabilities introduced
3. **Update documentation**: Ensure CLAUDE.md reflects current state

Run `/health-check` for quick status overview.
EOF
    fi
}

# Check for testing-related changes
check_testing_impact() {
    local changed_file="$1"
    
    if [[ "$changed_file" =~ \.(test|spec)\.(js|ts|cs)$ ]] || [[ "$changed_file" =~ /[Tt]ests?/ ]]; then
        log_action "Test file modified: $changed_file"
        echo "🧪 Test-related change detected"
        
        # Suggest coverage check
        echo "💡 Consider running test coverage analysis after test changes"
    fi
}

# Security-related file monitoring
check_security_impact() {
    local changed_file="$1"
    
    if [[ "$changed_file" =~ (auth|security|jwt|middleware) ]] || 
       [[ "$changed_file" =~ \.(env|config)$ ]]; then
        log_action "Security-sensitive file changed: $changed_file"
        echo "🔒 Security-sensitive change detected"
        
        # Create security review reminder
        cat > "$CLAUDE_DIR/security-review-needed.md" << 'EOF'
# 🔒 Security Review Needed

A security-sensitive file was modified. Please:

1. **Review changes** for security implications
2. **Update security documentation** if needed
3. **Run security analysis** using appropriate tools
4. **Consider `/modernize-stack security`** for security updates

This reminder will be cleared after security review.
EOF
    fi
}

# Main execution
if [ -n "$CLAUDE_TOOL_RESULT_PATH" ]; then
    # Extract modified files from tool result
    MODIFIED_FILES=$(grep -o '"[^"]*\.(js\|ts\|cs\|json\|md\|yml\|yaml)"' "$CLAUDE_TOOL_RESULT_PATH" 2>/dev/null | tr -d '"')
    
    if [ -n "$MODIFIED_FILES" ]; then
        echo "📝 Files modified:"
        echo "$MODIFIED_FILES" | while read -r file; do
            echo "  - $file"
            update_context "$file"
            check_testing_impact "$file"
            check_security_impact "$file"
        done
    fi
fi

# Update activity timestamp
echo "$(date)" > "$CLAUDE_DIR/.last-activity"

echo "✅ ClaudePM post-change automation completed"