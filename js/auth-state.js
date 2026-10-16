/**
 * SYNEPRIX v1.2 - User State Simulation
 * 
 * Estados:
 * 1 = Fantasma (No autenticado)
 * 2 = Registrado (Sin compras, ve paywall)
 * 3 = Premium (Registrado, con compras)
 */

function initAuthState() {
    // 1. Init state
    let currentState = localStorage.getItem('spx_user_state');
    if (!currentState) {
        currentState = '1';
        localStorage.setItem('spx_user_state', '1');
    }

    // 2. Manejo de Botón de Logout
    const logoutBtns = document.querySelectorAll('.btn-logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('spx_user_state', '1');
            window.location.href = btn.getAttribute('href');
        });
    });

    // 3. Ejecutar lógica según estado y ruta actual
    const path = window.location.pathname;
    
    // Rutas protegidas (Requieren Auth)
    const isAula = path.includes('/aula/');
    const isCredencial = path.includes('/certificaciones/mi-credencial/');

    if (currentState === '1') {
        // Redirigir a login si es fantasma e intenta acceder a rutas protegidas
        if (isAula || isCredencial) {
            // Check if we are not already in login
            if (!path.includes('/login/')) {
                window.location.href = '/login/';
                return;
            }
        }
    } else if (currentState === '2' || currentState === '3') {
        // Usuario Logueado (Registrado o Premium)
        
        // 1. Actualizar Navbars en todas las páginas (excepto dentro del aula)
        if (!isAula) {
            // Buscamos el botón de Iniciar Sesión en el navbar
            const loginBtn = document.querySelector('nav .btn-primary[href*="login/"]');
            if (loginBtn) {
                // Cambiamos el texto y el enlace a "Mi Aula"
                loginBtn.textContent = 'Mi Aula';
                loginBtn.href = '/aula/';
                loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Color verde para indicar sesion activa
                loginBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
            }
        }

        // 2. Ocultar cursos si es estado 2 (Registrado sin compras)
        // El Paywall ya no aplica a la vista general del aula, el usuario debe ver el aula vacía
        if (currentState === '2' && isAula) {
            // El aula manejará su propio "empty state"
        }
    }

    // 4. Crear Dev Toolbar (Solo para pruebas)
    // createDevToolbar(currentState);
}

document.addEventListener('DOMContentLoaded', initAuthState);
document.addEventListener('componentsLoaded', initAuthState);

function injectPaywall() {
    // Buscar el main content y bloquealo. En el Dashboard es .main-content, en el Player puede ser diferente.
    const mainContent = document.querySelector('.main-content') || document.querySelector('.course-player-container');
    if (mainContent) {
        // Envolver el contenido en un div bloqueado
        const originalHTML = mainContent.innerHTML;
        mainContent.innerHTML = `
            <div style="position:relative; width: 100%; height: 100%;">
                <div style="filter: blur(8px) opacity(0.5); pointer-events: none; user-select: none; width: 100%; height: 100%;">
                    ${originalHTML}
                </div>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); 
                            background: rgba(0,0,0,0.85); border: 1px solid rgba(208,77,205,0.4); 
                            padding: 40px; border-radius: 20px; text-align: center; width: 80%; max-width: 500px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px); z-index: 999;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🔒</div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 15px; font-weight:800; color: #fff;">Contenido Exclusivo</h2>
                    <p style="color:#8892a4; margin-bottom: 25px;">Debes adquirir este curso o suscripción para acceder a esta lección y continuar con tu aprendizaje.</p>
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #591dcb, #d04dcd); color: white; border: none; 
                                   padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; text-decoration: none;">
                        Ver Planes y Precios
                    </a>
                </div>
            </div>
        `;
    }
}

function createDevToolbar(currentState) {
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #111;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 8px;
        padding: 10px;
        z-index: 9999;
        display: flex;
        gap: 10px;
        align-items: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        font-family: 'Montserrat', sans-serif;
    `;

    const label = document.createElement('span');
    label.style.cssText = `font-size: 0.8rem; color: #8892a4; font-weight: 600; text-transform: uppercase;`;
    label.innerText = 'Dev State:';
    toolbar.appendChild(label);

    const states = [
        { val: '1', text: 'Fantasma' },
        { val: '2', text: 'Registrado' },
        { val: '3', text: 'Premium' }
    ];

    states.forEach(st => {
        const btn = document.createElement('button');
        btn.innerText = st.text;
        btn.style.cssText = `
            padding: 5px 10px;
            font-size: 0.8rem;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid transparent;
            background: ${currentState === st.val ? 'rgba(208,77,205,0.2)' : 'transparent'};
            color: ${currentState === st.val ? '#d04dcd' : '#fff'};
            border-color: ${currentState === st.val ? '#d04dcd' : '#333'};
        `;
        btn.onclick = () => {
            localStorage.setItem('spx_user_state', st.val);
            window.location.reload();
        };
        toolbar.appendChild(btn);
    });

    document.body.appendChild(toolbar);
}
