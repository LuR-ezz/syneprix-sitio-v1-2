import os
import re
import shutil

cert_path = r'C:\Users\luisa\OneDrive\Documentos\ChatGPT\Portafolios(lurr)\sitio-v1.2\certificaciones\index.html'
crit_path = r'C:\Users\luisa\OneDrive\Documentos\ChatGPT\Portafolios(lurr)\sitio-v1.2\certificaciones\criterios\index.html'

with open(crit_path, 'r', encoding='utf-8') as f:
    crit_html = f.read()

# Extract styles
styles_match = re.search(r'<style>([\s\S]*?)</style>', crit_html)
crit_styles = styles_match.group(1) if styles_match else ''
cleaned_styles = []
for line in crit_styles.split('\n'):
    if any(ignore in line for ignore in ['body {', '* {', 'margin: 0', 'h1 {', 'h2 {', '@import']):
        continue
    cleaned_styles.append(line)
crit_styles = '\n'.join(cleaned_styles)

# Extract table block
table_match = re.search(r'(<div class="container">[\s\S]*?<h2>Criterios de Evaluación por Nivel</h2>[\s\S]*?</table>)', crit_html)
table_html = table_match.group(1) + '\n</div>' if table_match else ''

# Extract process block
process_match = re.search(r'(<div class="container">\s*<h2>Proceso de Evaluación</h2>[\s\S]*?</div>\s*</div>)', crit_html)
process_html = process_match.group(1) if process_match else ''

with open(cert_path, 'r', encoding='utf-8') as f:
    cert_html = f.read()

# Inject styles
cert_html = cert_html.replace('</style>', f'{crit_styles}\n    </style>')

# Ensure animations script is present
if 'scroll-animations.js' not in cert_html:
    cert_html = cert_html.replace('</body>', '    <script src="/js/scroll-animations.js"></script>\n</body>')

# Add animate-on-scroll to the new sections
table_html = table_html.replace('<div class="container">', '<div class="container animate-on-scroll">')
process_html = process_html.replace('<div class="container">', '<div class="container animate-on-scroll">')

# Insert the blocks before the Tracks Grid section
inject_point = '<!-- Tracks Grid -->'
merged_sections = f'\n    <!-- SECCION CRITERIOS (MERGED) -->\n    <section class="criterios-section">\n        {table_html}\n        {process_html}\n    </section>\n\n    '
cert_html = cert_html.replace(inject_point, merged_sections + inject_point)

with open(cert_path, 'w', encoding='utf-8') as f:
    f.write(cert_html)

shutil.rmtree(r'C:\Users\luisa\OneDrive\Documentos\ChatGPT\Portafolios(lurr)\sitio-v1.2\certificaciones\criterios', ignore_errors=True)
print('Merge and cleanup successful')
