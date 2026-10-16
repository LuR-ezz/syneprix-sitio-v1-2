import os
import re

root_dir = r"C:\Users\luisa\OneDrive\Documentos\ChatGPT\Portafolios(lurr)\sitio-v1.2"

header_regex = re.compile(r'<header>[\s\S]*?</header>', re.IGNORECASE)
nav_navbar_regex = re.compile(r'<nav class="navbar">[\s\S]*?</nav>', re.IGNORECASE)
load_comp_regex = re.compile(r'<script[^>]*src="[^"]*loadComponents\.js"[^>]*></script>', re.IGNORECASE)
auth_state_regex = re.compile(r'<script[^>]*src="[^"]*auth-state\.js"[^>]*></script>', re.IGNORECASE)

load_comp_tag = '<script src="/assets/js/loadComponents.js" defer></script>'
auth_state_tag = '<script src="/js/auth-state.js"></script>'

updated_files = 0
for subdir, _, files in os.walk(root_dir):
    if "components" in subdir:
        continue
        
    for file in files:
        if file.endswith(".html"):
            filepath = os.path.join(subdir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            content = original_content
            
            # Replace header
            if '<div data-component="navbar"></div>' not in content:
                if header_regex.search(content):
                    content = header_regex.sub('<div data-component="navbar"></div>', content)
                elif nav_navbar_regex.search(content):
                    content = nav_navbar_regex.sub('<div data-component="navbar"></div>', content)

            # Ensure loadComponents.js
            if not load_comp_regex.search(content):
                # inject before </head>
                content = re.sub(r'</head>', f'    {load_comp_tag}\n</head>', content, flags=re.IGNORECASE)
            else:
                # normalize path to absolute
                content = load_comp_regex.sub(load_comp_tag, content)

            # Ensure auth-state.js
            if not auth_state_regex.search(content):
                # inject before </body>
                content = re.sub(r'</body>', f'    {auth_state_tag}\n</body>', content, flags=re.IGNORECASE)
            else:
                # normalize path to absolute
                content = auth_state_regex.sub(auth_state_tag, content)

            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {filepath}")
                updated_files += 1

print(f"Total files updated: {updated_files}")
