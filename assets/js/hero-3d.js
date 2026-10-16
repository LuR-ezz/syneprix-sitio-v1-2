import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-hero-container');
    if (!container) return;

    // Configuración de la Escena
    const scene = new THREE.Scene();

    // Configuración de la Cámara
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5); // Alejar la cámara para ver el modelo completo

    // Configuración del Renderizador
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Sistema de Luces (Tech/Neon Glow)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Luz base suave
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x591dcb, 40, 50); // Luz morada intensa (Cyberpunk)
    purpleLight.position.set(2, 2, 2);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x0ea5e9, 30, 50); // Luz azul neón secundaria
    blueLight.position.set(-2, -2, 2);
    scene.add(blueLight);
    
    // Luz que seguirá al mouse para darle interacción
    const mouseLight = new THREE.PointLight(0xffffff, 15, 20);
    scene.add(mouseLight);

    // Grupo pivote para solucionar problemas de descentrado del modelo 3D
    const pivot = new THREE.Group();
    scene.add(pivot);

    // Cargar el Modelo 3D
    const loader = new GLTFLoader();
    loader.load('assets/models/LOgo3.glb', (gltf) => {
        const model = gltf.scene;
        
        // 1. Obtener la caja delimitadora (Bounding Box) del modelo original
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // 2. Mover el modelo físicamente en reversa para que su "centro" quede en 0,0,0
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // 3. Ajustar la escala dinámicamente para que quepa en la cámara sin importar su tamaño original en Blender
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.2; // Reducido para evitar el efecto de 'zoom'
        const scale = targetSize / maxDim;
        pivot.scale.set(scale, scale, scale);

        // 4. Añadir el modelo corregido al grupo pivote
        pivot.add(model);

    }, undefined, function (error) {
        console.error('Error cargando el modelo 3D:', error);
    });

    // Interactividad con el Mouse
    // Responsividad: Ajustar tamaño si cambian la pantalla
    window.addEventListener('resize', () => {
        if(!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Bucle de Animación
    function animate() {
        requestAnimationFrame(animate);

        // Ahora rotamos el pivote que contiene al modelo perfectamente centrado
        if (pivot) {
            // Rotación constante automática sobre sí mismo (Y)
            pivot.rotation.y += 0.005; // Un poco más rápido para que se vea el movimiento fluido
        }

        renderer.render(scene, camera);
    }

    animate();
});
