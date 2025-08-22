#!/usr/bin/env python3
"""
Stack Compatibility Validation Hooks for Claude Code
Validates Angular 20, .NET 8, Supabase, and Tailwind CSS v4 compatibility
"""

import json
import sys
import re
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple

class StackValidator:
    """Main validator for full-stack compatibility"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.errors = []
        self.warnings = []
        
    def validate_file_changes(self, file_path: str, content: str) -> bool:
        """Validate file changes for stack compatibility"""
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext == '.ts':
            return self._validate_typescript(file_path, content)
        elif file_ext == '.html':
            return self._validate_html_template(file_path, content)
        elif file_ext == '.cs':
            return self._validate_csharp(file_path, content)
        elif file_ext == '.sql':
            return self._validate_sql(file_path, content)
        elif file_ext == '.json':
            return self._validate_json_config(file_path, content)
            
        return True
    
    def _validate_typescript(self, file_path: str, content: str) -> bool:
        """Validate TypeScript files for Angular 20 best practices"""
        issues = []
        
        # Check for deprecated NgModule usage
        if re.search(r'@NgModule\s*\(', content):
            issues.append("❌ Using deprecated @NgModule - Use standalone components in Angular 20")
        
        # Check for old structural directives
        if re.search(r'\*ngIf|\*ngFor', content):
            issues.append("❌ Using old structural directives - Use @if/@for control flow in Angular 20")
        
        # Check for proper signal usage
        if re.search(r'Observable<.*>', content) and 'signal' not in content:
            issues.append("⚠️ Consider using signals instead of Observables for state management")
        
        # Check for Tailwind v3 patterns
        if re.search(r'sm:grid\s+sm:grid-cols', content):
            issues.append("❌ Using Tailwind CSS v3 patterns - Update to v4 syntax")
        
        # Check for hardcoded API URLs
        api_patterns = [
            r'http://localhost:\d+',
            r'https://.*\.supabase\.co',
            r'["\']https?://[^"\']*api[^"\']*["\']'
        ]
        for pattern in api_patterns:
            if re.search(pattern, content) and 'environment' not in content:
                issues.append("❌ Hardcoded API URL found - Use environment configuration")
        
        if issues:
            self.errors.extend(issues)
            return False
            
        return True
    
    def _validate_html_template(self, file_path: str, content: str) -> bool:
        """Validate HTML templates for Angular 20 and Tailwind v4"""
        issues = []
        
        # Check for old Angular control flow
        if re.search(r'\*ngIf|\*ngFor|\*ngSwitch', content):
            issues.append("❌ Using old structural directives - Use @if/@for/@switch control flow")
        
        # Check for Tailwind v3 responsive patterns
        v3_patterns = [
            r'sm:grid\s+sm:grid-cols',
            r'md:flex\s+md:items',
            r'lg:block\s+lg:text'
        ]
        for pattern in v3_patterns:
            if re.search(pattern, content):
                issues.append("❌ Using Tailwind CSS v3 responsive patterns - Update to v4")
        
        # Check for missing accessibility attributes
        interactive_elements = re.findall(r'<(button|input|select|textarea|a)[^>]*>', content)
        for element in interactive_elements:
            if 'aria-label' not in element and 'aria-describedby' not in element:
                issues.append("⚠️ Interactive element missing accessibility attributes")
        
        # Check for Hero Icons library usage instead of SVG
        if re.search(r'heroicons|hero-icons', content):
            issues.append("❌ Using Hero Icons library - Use inline SVG for better performance")
        
        if issues:
            self.errors.extend(issues)
            return False
            
        return True
    
    def _validate_csharp(self, file_path: str, content: str) -> bool:
        """Validate C# files for .NET 8 minimal API patterns"""
        issues = []
        
        # Check for controller usage instead of minimal APIs
        if re.search(r'\[ApiController\]|\[Route\(.*\)\]|: ControllerBase', content):
            issues.append("❌ Using controllers instead of minimal APIs - Use .NET 8 minimal API pattern")
        
        # Check for proper async patterns
        if re.search(r'\.Result\b|\.Wait\(\)', content):
            issues.append("❌ Blocking async calls found - Use proper async/await pattern")
        
        # Check for missing error handling
        if re.search(r'await.*\(', content) and 'try' not in content:
            issues.append("⚠️ Async operation without error handling - Add try/catch blocks")
        
        # Check for Supabase integration patterns
        if 'supabase' in content.lower() and 'ILogger' not in content:
            issues.append("⚠️ Supabase operations without logging - Add ILogger for debugging")
        
        if issues:
            self.errors.extend(issues)
            return False
            
        return True
    
    def _validate_sql(self, file_path: str, content: str) -> bool:
        """Validate SQL files for Supabase best practices"""
        issues = []
        
        # Check for missing RLS
        if re.search(r'CREATE TABLE', content, re.IGNORECASE):
            if not re.search(r'ENABLE ROW LEVEL SECURITY', content, re.IGNORECASE):
                issues.append("❌ Table created without Row Level Security - Enable RLS for security")
        
        # Check for missing constraints
        if re.search(r'email.*TEXT', content, re.IGNORECASE):
            if not re.search(r'CHECK.*email.*~\*', content):
                issues.append("⚠️ Email field without validation constraint")
        
        # Check for missing indexes on foreign keys
        if re.search(r'REFERENCES.*\(.*\)', content, re.IGNORECASE):
            if not re.search(r'CREATE INDEX.*ON', content, re.IGNORECASE):
                issues.append("⚠️ Foreign key without index - Add index for performance")
        
        if issues:
            self.warnings.extend(issues)
            
        return True
    
    def _validate_json_config(self, file_path: str, content: str) -> bool:
        """Validate JSON configuration files"""
        issues = []
        
        try:
            config = json.loads(content)
            
            # Validate package.json for Angular 20
            if 'package.json' in file_path:
                if 'dependencies' in config:
                    angular_version = config['dependencies'].get('@angular/core', '')
                    if angular_version and not angular_version.startswith('^20') and not angular_version.startswith('~20'):
                        issues.append(f"❌ Angular version {angular_version} is not v20")
                    
                    # Check for Tailwind CSS v4
                    tailwind_version = config['dependencies'].get('tailwindcss', '') or config.get('devDependencies', {}).get('tailwindcss', '')
                    if tailwind_version and not tailwind_version.startswith('^4') and not tailwind_version.startswith('~4'):
                        issues.append(f"❌ Tailwind CSS version {tailwind_version} is not v4")
            
            # Validate environment files
            if 'environment' in file_path:
                if 'apiUrl' not in config and 'supabaseUrl' not in config:
                    issues.append("⚠️ Environment file missing API configuration")
                    
        except json.JSONDecodeError:
            issues.append("❌ Invalid JSON format")
        
        if issues:
            self.errors.extend(issues)
            return False
            
        return True
    
    def get_validation_report(self) -> str:
        """Generate validation report"""
        report = []
        
        if self.errors:
            report.append("🚨 CRITICAL ISSUES FOUND:")
            for error in self.errors:
                report.append(f"  {error}")
        
        if self.warnings:
            report.append("\n⚠️ WARNINGS:")
            for warning in self.warnings:
                report.append(f"  {warning}")
        
        if not self.errors and not self.warnings:
            report.append("✅ All stack compatibility checks passed!")
        
        return "\n".join(report)


def validate_stack_compatibility():
    """PreToolUse hook: Validate stack compatibility before file changes"""
    try:
        input_data = json.load(sys.stdin)
        tool_name = input_data.get('tool_name', '')
        tool_input = input_data.get('tool_input', {})
        
        if tool_name not in ['Edit', 'MultiEdit', 'Write']:
            sys.exit(0)
        
        file_path = tool_input.get('file_path', '')
        content = tool_input.get('content', '')
        
        if not file_path or not content:
            sys.exit(0)
        
        project_root = os.environ.get('CLAUDE_PROJECT_DIR', '.')
        validator = StackValidator(project_root)
        
        is_valid = validator.validate_file_changes(file_path, content)
        
        if not is_valid:
            report = validator.get_validation_report()
            print(report, file=sys.stderr)
            sys.exit(2)  # Block the operation
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Validation error: {e}", file=sys.stderr)
        sys.exit(1)


def enrich_context():
    """UserPromptSubmit hook: Add context based on user prompt"""
    try:
        input_data = json.load(sys.stdin)
        prompt = input_data.get('prompt', '')
        
        context_additions = []
        
        # Add Angular context for frontend-related prompts
        if re.search(r'\b(component|service|angular|frontend|ui)\b', prompt, re.IGNORECASE):
            context_additions.append("📱 ANGULAR CONTEXT: Using Angular 20 with standalone components, signals, and modern control flow (@if/@for)")
        
        # Add .NET context for backend-related prompts
        if re.search(r'\b(api|backend|server|endpoint|\.net)\b', prompt, re.IGNORECASE):
            context_additions.append("🔧 .NET CONTEXT: Using .NET 8 minimal APIs with dependency injection and Supabase integration")
        
        # Add Supabase context for database-related prompts
        if re.search(r'\b(database|db|supabase|sql|table)\b', prompt, re.IGNORECASE):
            context_additions.append("🗄️ SUPABASE CONTEXT: PostgreSQL with Row Level Security, real-time subscriptions, and proper indexing")
        
        # Add Tailwind context for styling-related prompts
        if re.search(r'\b(style|css|design|ui|tailwind|responsive)\b', prompt, re.IGNORECASE):
            context_additions.append("🎨 TAILWIND CONTEXT: Using Tailwind CSS v4 with modern syntax, Hero Icons as SVG, and accessibility-first design")
        
        # Add integration context for full-stack prompts
        if len(context_additions) > 1:
            context_additions.append("🔗 INTEGRATION: Ensure compatibility between Angular components, .NET endpoints, and Supabase schema")
        
        if context_additions:
            context = "\n".join(context_additions)
            print(context)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Context enrichment error: {e}", file=sys.stderr)
        sys.exit(1)


def load_project_context():
    """SessionStart hook: Load project-specific context at session start"""
    try:
        input_data = json.load(sys.stdin)
        
        project_root = Path(os.environ.get('CLAUDE_PROJECT_DIR', '.'))
        context_parts = []
        
        # Check project structure and add relevant context
        if (project_root / 'angular.json').exists():
            context_parts.append("📱 Angular 20 project detected")
        
        if (project_root / 'package.json').exists():
            with open(project_root / 'package.json', 'r') as f:
                package_data = json.load(f)
                if 'tailwindcss' in package_data.get('dependencies', {}) or 'tailwindcss' in package_data.get('devDependencies', {}):
                    context_parts.append("🎨 Tailwind CSS configured")
        
        if any((project_root / '**' / '*.csproj').glob('*')):
            context_parts.append("🔧 .NET 8 project detected")
        
        if (project_root / '.env').exists() or (project_root / 'src' / 'environments').exists():
            context_parts.append("🗄️ Environment configuration found")
        
        # Load current task state if available
        task_state_dir = project_root / '.claude' / 'task-state'
        if (task_state_dir / 'current-task.json').exists():
            with open(task_state_dir / 'current-task.json', 'r') as f:
                task_data = json.load(f)
                context_parts.append(f"📋 Current task: {task_data.get('description', 'Unknown')}")
        
        if context_parts:
            context = f"""
🚀 PROJECT CONTEXT LOADED:
{chr(10).join('  ' + part for part in context_parts)}

Stack: Angular 20 + .NET 8 + Supabase + Tailwind CSS v4
Best Practices: Standalone components, minimal APIs, RLS policies, modern CSS patterns
"""
            print(context)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"Project context loading error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    # Determine which hook to run based on script name or argument
    script_name = Path(sys.argv[0]).name
    
    if 'validate-stack-compatibility' in script_name:
        validate_stack_compatibility()
    elif 'enrich-context' in script_name:
        enrich_context()
    elif 'load-project-context' in script_name:
        load_project_context()
    else:
        # Default behavior - run all validations
        validate_stack_compatibility()
