# 4. Una sola `page-container`; ninguna página redefine su `max-width`/`padding`

## Estado

Aceptado

## Contexto

Durante el rediseño de `news.page` y `news-detail.page` (feature/news-multi-image), ambas páginas partían de `page-container` / `page-container-narrow` (`src/app/styles/_layout.scss`) pero además redefinían `max-width` y `margin: 0 auto` en su propio `.scss` (`.member-news-page`, `.news-detail-page`), con valores propios (760px, luego 1080px en un breakpoint ad-hoc) distintos de los que ya fijaba la clase compartida. El resultado: el ancho real de la página no lo decidía `page-container`, sino un valor local que nadie más podía prever, y cambiaba en cada iteración de diseño sin que quedara reflejado en el sitio que en teoría gobierna el layout.

Además, `_layout.scss` tenía tres variantes — `page-container` (1400px), `page-container-narrow` (900px), `page-container-extra-narrow` (800px) — pero en la práctica solo dos páginas de toda la app usaban una variante más estrecha (`news-detail` y `match-detail`, ambas copiando el mismo ejemplo), mientras el resto de páginas de detalle (`form-detail`, `contact`, `team-detail`, `settings-information`...) usaban `page-container` a secas. Tener tres clases con el mismo propósito (fijar el ancho de página) invitaba precisamente al problema de arriba: cada página podía "elegir" un ancho sin que hubiera una razón documentada, y la elección real dependía de qué ejemplo se había copiado, no de una decisión de diseño.

Es el mismo problema que motivó [[0002-buttons-and-modals-use-shared-styles]] y [[0003-shared-context-menu-styles]]: una propiedad visual que ya resuelve un fichero compartido se reimplementa o se fragmenta localmente y se desincroniza con el tiempo.

## Decisión

- Existe una única clase de ancho de página: `page-container` (1400px, `_layout.scss`). Se eliminaron `page-container-narrow` y `page-container-extra-narrow`; ninguna página las usa.
- Todas las páginas de nivel superior usan `page-container`. Ninguna página ni componente redefine `max-width`, `width` o `margin` en su propio `.scss` para el elemento que lleva esa clase.
- Si el ancho de `page-container` no es el adecuado para algún caso — por ejemplo, se considera que 1400px es demasiado ancho para contenido de lectura —, se ajusta el valor en `_layout.scss`, porque el cambio debe aplicar a todas las páginas por igual, no a una sola de forma aislada. No se reintroduce una variante local ni una segunda clase de ancho sin pasar antes por esta decisión.
- Cuando una página necesita una columna más estrecha que el contenedor para un elemento concreto (p. ej. limitar la longitud de línea del cuerpo de un artículo dentro de una página que por lo demás usa `page-container` a ancho completo), ese límite se aplica con un `max-width` en el elemento interno específico (`.news-body`, no `.news-detail-page`), nunca en el contenedor de página.

## Consecuencias

- `news.page.scss` y `news-detail.page.scss` ya no declaran `max-width`/`margin` en `.member-news-page` / `.news-detail-page`; heredan el de `page-container` sin overrides.
- `news-detail.page.html` y `match-detail.page.html` pasaron de `page-container-narrow` a `page-container`.
- `page-container-narrow` y `page-container-extra-narrow` se borraron de `_layout.scss`.
- En revisión de código, cualquier página con `max-width`, `width` o `margin: 0 auto` propios sobre su contenedor de página, o cualquier nueva clase `page-container-*` que reintroduzca una variante de ancho, es una desviación a corregir.
