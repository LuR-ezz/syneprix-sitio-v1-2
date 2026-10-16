# Sistema visual actual

## Dirección

Interfaz tecnológica oscura con paneles de vidrio, acentos violeta, magenta, cian y verde. La composición prioriza profundidad, conexiones y movimiento para comunicar tecnología aplicada.

## Fundamentos

- Tipografía principal: Inter local.
- Fondo: tonos casi negros y azul profundo.
- Acentos: `--accent1`, `--accent2`, `--accent3` y `--gradient` en `assets/css/theme.css`.
- Superficies: paneles translúcidos con borde tenue y radio amplio.
- Controles: botones primarios sólidos o con gradiente; enlaces secundarios en color de acento.
- Movimiento: animaciones de entrada y conexiones del home; respeta `prefers-reduced-motion`.

## Reglas de uso

- Toda acción visible debe navegar, ejecutar una función o comunicar que está deshabilitada.
- Los botones táctiles principales deben medir al menos 44 × 44 px.
- Los formularios deben tener `label`, `name`, validación nativa y un resultado comprensible.
- Las rutas compartidas usan enlaces absolutos desde la raíz para funcionar igual en desarrollo y Render.
- No duplicar cursos o llamadas a la acción dentro de la misma sección.
