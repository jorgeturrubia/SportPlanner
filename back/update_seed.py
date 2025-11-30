import re

file_path = r'c:\Proyectos\SportPlanner\back\seed_concepts.sql'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add v_sport_id to DECLARE
content = content.replace('    v_cat_id INT;', '    v_cat_id INT;\n    v_sport_id INT;')

# 2. Initialize v_sport_id
content = content.replace('BEGIN', "BEGIN\n    SELECT \"Id\" INTO v_sport_id FROM \"Sports\" WHERE \"Name\" = 'Baloncesto' LIMIT 1;")

# 3. Update INSERT statements
content = content.replace(
    'INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive")',
    'INSERT INTO "SportConcepts" ("Name", "Description", "Url", "ConceptCategoryId", "IsActive", "SportId")'
)

# 4. Update SELECT statements
# This regex looks for the pattern ending in ", true" and appends ", v_sport_id"
# We need to be careful not to match other things.
# The lines look like: SELECT '...', '...', '...', v_cat_id, true
# We can replace ", true\n" with ", true, v_sport_id\n"

content = re.sub(r', true\n', ', true, v_sport_id\n', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated seed_concepts.sql")
