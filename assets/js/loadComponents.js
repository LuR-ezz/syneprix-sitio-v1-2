document.addEventListener('DOMContentLoaded', async () => {
    const components = document.querySelectorAll('[data-component]');
    
    for (const el of components) {
        const componentName = el.getAttribute('data-component');
        const componentPath = `/components/${componentName}.html${componentName === 'sayks-animation' ? '?v=20261014-restored' : ''}`;
        
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Could not load ${componentPath}`);
            const html = await response.text();
            
            // Create a temporary container to extract scripts
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Extract scripts
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            // Replace HTML
            el.outerHTML = temp.innerHTML;
            
            // Execute scripts
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                document.body.appendChild(newScript);
            });
            
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }
    
    // Dispatch event when all components are loaded
    document.dispatchEvent(new Event('componentsLoaded'));
});
