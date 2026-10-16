# Plan de mejora de usabilidad

## Diagnóstico

| Área | Antes | Después | Evidencia |
| --- | ---: | ---: | --- |
| Accesibilidad | 2/4 | 3/4 | Menú semántico, foco visible, campos etiquetados, controles de 44 px y movimiento reducido. |
| Rendimiento | 2/4 | 3/4 | La animación de conexiones se pausa fuera de pantalla y usa `requestAnimationFrame`. |
| Temas y consistencia | 3/4 | 4/4 | Se conserva el sistema visual y se centralizan navegación y pie. |
| Responsive | 2/4 | 3/4 | El menú móvil se inicializa después de cargar componentes y se cierra con Escape o selección. |
| Integridad | 1/4 | 3/4 | Auditoría de 37 páginas sin destinos o fragmentos internos rotos ni enlaces `#`. |

## Correcciones completadas

- Corregir la inicialización tardía del menú móvil y del estado de sesión.
- Sustituir los enlaces a un `checkout` inexistente por solicitudes de inscripción con contexto.
- Corregir breadcrumbs y enlaces del pie que resolvían dentro de carpetas equivocadas.
- Activar los cursos que ya tienen página y eliminar la tarjeta duplicada de Transformación Digital.
- Convertir formularios inertes en flujos de contacto reales mediante correo o redirección.
- Convertir el verificador de credenciales en una búsqueda funcional para los IDs de demostración.
- Quitar proveedores sociales, notas de prensa y opciones de cuenta que aparentaban funcionar sin implementación.
- Añadir preferencias de cookies persistentes en el navegador.
- Evitar el error JavaScript del visor 3D ausente en el home.

## Trabajo futuro

- Conectar formularios a un servicio transaccional con consentimiento y protección antispam.
- Sustituir la autenticación de demostración por un backend.
- Incorporar contenido real para lecciones, descargas y notas de prensa.
- Ejecutar una auditoría visual automatizada cuando el navegador local tenga permiso.
