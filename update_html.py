import re

with open('latam_path.txt', 'r') as f:
    lines = f.readlines()
    viewbox = lines[0].split(': ')[1].strip()
    path_data = lines[1].strip()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update aspect ratio
html = re.sub(r'aspect-ratio:\s*220/310;', f'aspect-ratio: 808.9/1000.0;', html)

# Update SVG viewBox
html = re.sub(r'viewBox="0 0 220 310"', f'viewBox="{viewbox}"', html)

# Update path
old_path_regex = r'<path d="M 30,20 L 50,20 L 65,40.*?Z".*?/>'
new_path_html = f'''<path d="{path_data}" 
                              fill="none" 
                              stroke="var(--accent2)" 
                              stroke-width="2" 
                              stroke-dasharray="4 6"
                              stroke-linejoin="round" 
                              stroke-linecap="round" />'''

html = re.sub(old_path_regex, new_path_html, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated HTML with new SVG path")
