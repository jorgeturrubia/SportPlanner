#!/usr/bin/env python3
"""
Steering Sync Hook for Claude Code
Monitors project changes and updates steering files when significant modifications are detected.
"""

import json
import sys
import os
from pathlib import Path

def analyze_changes(input_data):
    """Analyze the type of changes and determine if steering updates are needed"""
    
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})
    
    if tool_name not in ["Write", "Edit", "MultiEdit"]:
        return None
    
    file_path = tool_input.get("file_path", "")
    if not file_path:
        return None
    
    # Categorize changes that require steering updates
    critical_patterns = {
        "architecture": [
            "*.csproj", "package.json", "angular.json", "tsconfig.json",
            "appsettings*.json", "web.config", "Dockerfile", "docker-compose.yml"
        ],
        "structure": [
            "src/**/*", "app/**/*", "components/**/*", "services/**/*",
            "controllers/**/*", "models/**/*"
        ],
        "product": [
            "README.md", "CHANGELOG.md", "docs/**/*",
            "requirements.md", "features/**/*"
        ]
    }
    
    changes_detected = []
    
    for category, patterns in critical_patterns.items():
        for pattern in patterns:
            if matches_pattern(file_path, pattern):
                changes_detected.append(category)
                break
    
    return changes_detected

def matches_pattern(file_path, pattern):
    """Simple pattern matching for file paths"""
    import fnmatch
    return fnmatch.fnmatch(file_path, pattern) or fnmatch.fnmatch(file_path.replace("\\", "/"), pattern)

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
        
        # Analyze what type of changes occurred
        changes = analyze_changes(input_data)
        
        if not changes:
            sys.exit(0)  # No relevant changes
        
        file_path = input_data.get("tool_input", {}).get("file_path", "")
        
        # Generate steering update prompt based on change type
        if "architecture" in changes:
            feedback = f"""🔄 **Architecture Change Detected**

The file `{file_path}` was modified, which may affect the technology stack or architecture.

**Please review if `Steering/tech.md` needs updates for:**
- New dependencies or technology changes
- Architecture pattern modifications  
- Development tool changes
- New conventions or practices

Use the steering-context-generator agent to update the tech documentation if needed."""

        elif "structure" in changes:
            feedback = f"""📁 **Structure Change Detected**

The file `{file_path}` was modified, which may affect project organization.

**Please review if `Steering/structure.md` needs updates for:**
- New directory organization
- Component/service structure changes
- File naming convention updates
- Configuration management changes

Use the steering-context-generator agent to update the structure documentation if needed."""

        elif "product" in changes:
            feedback = f"""📋 **Product Change Detected**

The file `{file_path}` was modified, which may affect product information.

**Please review if `Steering/product.md` needs updates for:**
- New features or functionality
- User experience changes
- Business objective modifications
- Product scope adjustments

Use the steering-context-generator agent to update the product documentation if needed."""

        else:
            feedback = f"""⚠️ **Project Change Detected**

The file `{file_path}` was modified. Consider reviewing steering files for updates:
- `Steering/product.md` for product changes
- `Steering/tech.md` for technical changes  
- `Steering/structure.md` for structural changes"""

        # Output feedback to Claude (exit code 2 shows stderr to Claude)
        print(feedback, file=sys.stderr)
        sys.exit(2)
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
