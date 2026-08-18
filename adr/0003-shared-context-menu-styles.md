# 3. El menú contextual (⋮) usa un `_context-menu.scss` compartido, no se duplica por página

## Estado

Aceptado

## Contexto

Al migrar los botones de `users.page` y `settings-news.page` a las clases del sistema ([[0002-buttons-and-modals-use-shared-styles]]), el botón que abre el menú contextual (`.actions-toggle`, el icono ⋮) sí se pudo mapear a `.btn-icon-round` de `_buttons.scss`. Pero el resto del patrón — el propio panel desplegable (`.actions-menu`) y sus ítems, incluida la variante de peligro (`.danger-action`) — no encaja ni en `_buttons.scss` (no es un botón suelto, es un menú) ni en `_modals.scss` (no es un modal). No hay ningún fichero compartido para este tercer tipo de "chrome" recurrente: un menú flotante anclado a un botón, con ítems tipo `role="menuitem"`.

Resultado: `users.page.scss` y `settings-news.page.scss` definen `.actions-menu` y `.danger-action` con estilos prácticamente idénticos (mismo posicionamiento absoluto, mismo `border-radius: 12px`, mismo `box-shadow`, mismo estilo de botón interno y mismo color de peligro), con solo diferencias triviales de ancho (250px vs 190px). Es el mismo problema que motivó la ADR 0002 — duplicación silenciosa que se desincroniza con el tiempo — pero para un widget que esas dos ADR no cubren.

## Decisión

- Se crea `src/app/styles/_context-menu.scss`, importado desde `global.scss` igual que `_buttons.scss` y `_modals.scss`, con las clases compartidas del patrón "menú de acciones anclado a un icono":
  - `.actions` (contenedor relativo), `.actions-menu` (panel flotante), `.actions-menu button` (ítem de menú), `.danger-action` (variante de peligro), y cualquier cabecera/separador que se repita (p. ej. el `strong` de sección usado en `users.page`).
- El botón que abre el menú sigue usando `.btn-icon-round` (u otra clase de `_buttons.scss` que encaje) — eso ya quedó resuelto por la ADR 0002 y no cambia.
- Ningún componente o página vuelve a declarar `.actions-menu` ni `.danger-action` en su propio `.scss`. Solo puede añadir overrides puntuales de layout (ancho del panel, posición) cuando el caso concreto lo requiera, igual que se permite para botones y modales.
- Si un tercer caso de uso de este patrón necesita algo que `_context-menu.scss` no cubre (p. ej. submenús, iconos por ítem), se extiende ese fichero compartido primero.

## Consecuencias

- `_context-menu.scss` existe, está importado desde `global.scss`, y `users.page.scss` / `settings-news.page.scss` ya se migraron: sus bloques `.actions-menu` / `.danger-action` locales se eliminaron, y solo conservan el override de `width` del panel (250px y 190px respectivamente), que es la única diferencia real entre ambos casos.
- Cualquier nueva pantalla que necesite un menú de acciones (⋮) parte de `_context-menu.scss` en vez de copiar el bloque de `users.page` o `settings-news.page`.
- Si aparece un futuro cuarto patrón de "chrome" recurrente (tablas, tarjetas, tooltips…) que tampoco encaje en botones/modales/menús, se documenta con su propia ADR siguiendo este mismo criterio, en vez de dejarlo crecer duplicado en cada página.
