#!/usr/bin/env python3
"""
Steering Format Hook for Claude Code
Automatically formats steering files to ensure consistent structure and frontmatter.
"""

import json
import sys
import os
import re

def format_steering_file(file_path, content):
    """Format steering file with proper frontmatter and structure"""
    
    # Check if it's a steering file
    if not file_path.endswith('.md') or '/Steering/' not in file_path.replace('\\', '/'):
        return content
    
    # Ensure proper frontmatter
    frontmatter = "---\ninclusion: always\n---\n\n"
    
    # Remove existing frontmatter if present
    content_lines = content.split('\n')
    if content_lines and content_lines[0] == '---':
        # Find end of frontmatter
        end_idx = 1
        while end_idx < len(content_lines) and content_lines[end_idx] != '---':
            end_idx += 1
        if end_idx < len(content_lines):
            content = '\n'.join(content_lines[end_idx + 1:]).lstrip('\n')
    
    # Add proper frontmatter
    formatted_content = frontmatter + content
    
    # Ensure proper spacing after headers
    formatted_content = re.sub(r'^(#{1,6})\s*(.+)$', r'\1 \2', formatted_content, flags=re.MULTILINE)
    
    # Ensure double newlines after headers
    formatted_content = re.sub(r'^(#{1,6}.*?)$(?!\n\n)', r'\1\n', formatted_content, flags=re.MULTILINE)
    
    # Clean up excessive newlines
    formatted_content = re.sub(r'\n{3,}', '\n\n', formatted_content)
    
    return formatted_content.strip() + '\n'

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
        
        tool_name = input_data.get("tool_name", "")
        tool_input = input_data.get("tool_input", {})
        
        # Only process Write/Edit operations on markdown files
        if tool_name not in ["Write", "Edit", "MultiEdit"]:
            sys.exit(0)
        
        file_path = tool_input.get("file_path", "")
        if not file_path or not file_path.endswith('.md'):
            sys.exit(0)
        
        # Only process steering files
        if '/Steering/' not in file_path.replace('\\', '/'):
            sys.exit(0)
        
        # Read current file content
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                current_content = f.read()
            
            # Format the content
            formatted_content = format_steering_file(file_path, current_content)
            
            # Write back if changed
            if formatted_content != current_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(formatted_content)
                
                print(f"✓ Formatted steering file: {os.path.basename(file_path)}")
        
    except Exception as e:
        print(f"Format hook error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
