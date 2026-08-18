# 2. Los botones usan `_buttons.scss` y los modales usan `_modals.scss`, sin estilos propios

## Estado

Aceptado

## Contexto

Una auditoría de todos los `<button>` de `src/app/**/*.html` encontró decenas de componentes que reimplementaban en su propio `.scss` estilos que ya existen en el sistema unificado (`src/app/styles/_buttons.scss` y `src/app/styles/_modals.scss`), en vez de reutilizar sus clases. Ejemplos detectados:

- El botón de cerrar modal se reimplementaba con nombres distintos (`.close-button`, `.modal-close`) en al menos 10 componentes, duplicando 1:1 el padding, borde, radio y estado `:hover` que ya define `.app-modal-close` en `_modals.scss`.
- Botones "cancelar/guardar" con clases `.btn-cancel` / `.btn-submit` que parecen del sistema por el prefijo `btn-` pero no existen en `_buttons.scss`, reinventando exactamente `.btn-secondary` / `.btn-primary`.
- Variantes locales de `.icon-button`, `.actions-toggle`, botones de "limpiar búsqueda", etc., todas reimplementando lo que `.btn-icon` / `.btn-icon-round` ya resuelve.

Esta duplicación hace que un cambio de diseño (radio de borde, paleta, tamaño) tenga que aplicarse a mano en muchos sitios, y permite que la UI se desvíe del diseño sin que nadie lo note. Ya existía la convención de no usar `<ion-button>` (confirmada: cero apariciones en el código); esta ADR la extiende a los estilos.

Como primer paso de correción se migraron a `.app-modal-close` los componentes `submission-detail-modal`, `sponsors-display`, `role-selector`, `icon-picker-modal`, `team-join-requests`, `submission-review-modal`, `action-requests-list-modal`, `team-form-modal` y `player-form-modal`, eliminando el CSS local redundante. Se dejó fuera, a propósito, `season-selector-modal`: su cabecera usa un degradado oscuro y el botón de cerrar está pensado para ese fondo (blancos translúcidos), incompatible con la paleta clara de `.app-modal-close`.

## Decisión

- Todo `<button>` nativo usa una clase `btn-*` de `_buttons.scss` (`btn-primary`, `btn-secondary`, `btn-danger`, `btn-success`, `btn-outline`, `btn-text`, `btn-icon`, `btn-icon-round`, `btn-add`, `btn-add-field`, con los modificadores `btn-large` / `btn-small` / `btn-block` cuando aplique). No se usa `<ion-button>`.
- Todo el "chrome" de un modal (contenedor, cabecera, título, subtítulo, botón de cerrar, contenido, footer, aviso, estado vacío) usa las clases de `_modals.scss` (`app-modal`, `app-modal-container`, `app-modal-header`, `app-modal-header-info/-icon/-text`, `app-modal-title`, `app-modal-subtitle`, `app-modal-close`, `app-modal-content`, `app-modal-footer`, `app-modal-notice`, `app-modal-empty`).
- El `.scss` de un componente **no redefine** propiedades visuales (color, fondo, borde, radio, padding, tipografía) que ya cubre alguna de estas clases. Solo puede añadir ajustes de layout/posicionamiento específicos del contexto (p. ej. `position: absolute` cuando el botón de cerrar flota sobre contenido sin cabecera propia).
- Si un caso de uso legítimo no encaja en ninguna clase existente (p. ej. una cabecera con fondo oscuro), se documenta como excepción explícita — no se crea una clase local con nombre parecido (`.close-button`, `.btn-cancel`, `.icon-button`...) que compita con el sistema.
- Si `_buttons.scss` o `_modals.scss` no cubren una necesidad real y recurrente, se extienden esos ficheros compartidos primero, en vez de resolverlo de forma local.

## Consecuencias

- Un cambio de diseño en botones o modales se hace en un único sitio (`_buttons.scss` / `_modals.scss`) y se propaga a toda la app.
- En revisión de código, cualquier `<button>` sin clase `btn-*`, o cualquier modal con cabecera/footer/botón de cerrar reimplementado a mano, es una desviación a corregir, salvo excepción documentada.
- Queda pendiente migrar los grupos ya identificados en la auditoría que aún no siguen esta regla: mostrar/ocultar contraseña (`profile.page`, `settings.page`), `.btn-cancel` / `.btn-submit` en los modales de formulario, acciones de campo en `settings-form-fields`, el botón "volver" (4 implementaciones distintas), `.icon-button` en sponsors, y los botones de "limpiar búsqueda".
- `season-selector-modal` mantiene su botón de cerrar propio como excepción documentada mientras `_modals.scss` no incorpore una variante para cabeceras oscuras.
