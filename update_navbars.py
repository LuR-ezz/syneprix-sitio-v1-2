import os
import re

root_dir = r"C:\Users\luisa\OneDrive\Documentos\ChatGPT\Portafolios(lurr)\sitio-v1.2"

new_nav_links = """<nav class="nav-links">
    <a href="/">Inicio</a>
    <a href="/nosotros/">Nosotros</a>
    
    <div class="dropdown">
        <a href="/#cursos-destacados" style="display:inline-block; padding-bottom: 20px; margin-bottom: -20px;">Cursos ▾</a>
        <div class="dropdown-content">
            <a href="/cursos/automatizacion-inteligente/"><span class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg></span>Automatización Inteligente</a>
            <a href="/cursos/bi-analitica-negocios/"><span class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span>BI & Analítica de Negocios</a>
            <a href="#" style="opacity:0.5; pointer-events:none;"><span class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span>IA Empresarial (Próximamente)</a>
            <a href="#" style="opacity:0.5; pointer-events:none;"><span class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>Trans. Digital (Próximamente)</a>
            <div style="border-top: 1px solid rgba(255,255,255,0.08); margin: 5px 0;"></div>
            <a href="/#cursos-destacados" style="color: #d04dcd !important; font-weight: 600;">Ver todo el catálogo →</a>
        </div>
    </div>

    <a href="/convenios/">Convenios</a>
    <a href="/#certificaciones">Certificaciones</a>
    <a href="/login/" class="btn btn-primary" style="padding: 8px 20px;">Iniciar Sesión</a>
</nav>"""

nav_regex = re.compile(r'<(nav|ul|div) class="nav-links".*?>.*?</\1>', re.DOTALL | re.IGNORECASE)

updated_files = 0
for subdir, _, files in os.walk(root_dir):
    # skip components/navbar.html itself
    if "components" in subdir:
        continue
        
    for file in files:
        if file.endswith(".html"):
            filepath = os.path.join(subdir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find and replace nav-links
            if nav_regex.search(content):
                new_content = nav_regex.sub(new_nav_links, content)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")
                    updated_files += 1

print(f"Total files updated: {updated_files}")
