# 5. Rediseño móvil desde estilos comunes y componentes reutilizables

## Estado

Aceptado el 2026-09-03. Primera implementación en `codex/mobile-shared-design`.

## Decisión acordada

- El diseño se resuelve con una base común y ajustes en componentes reutilizables.
- No se rediseñan las páginas una a una ni se acumulan selectores específicos de páginas en el SCSS global.
- Las excepciones se documentan y se proponen para migración a componentes/patrones comunes antes de rediseñarlas.
- Aclaración del usuario durante la implementación: no rediseñar el contenido de las páginas todavía. Se cubren la base visual común, el marco móvil, el selector y, tras su autorización posterior, la migración a «Más». Las composiciones, tarjetas y listas de otras páginas quedan pendientes.
- Esta fase se activa solamente en apps privadas (`environment.private`) y hasta 768 px, siguiendo el corte de navegación existente. Es un corte por ancho, no por sistema operativo.
- Escritorio y apps no privadas conservan su presentación. El estudio del flujo multiclub público queda pendiente.

## Primera implementación

- `styles/_mobile-design.scss`: colores semánticos, tipografía, controles y medidas compartidas. Usa `--club-brand` y `--club-brand-soft`, definidos en el tema del proyecto; Voltregà usa amarillo, blanco puro y carbón. El fondo común es `#ffffff`, centralizado en `--mobile-paper`, que alimenta `--background-secondary`, `--color-bg` y el fondo Ionic. No modifica la composición de tarjetas ni abre/reorganiza las secciones de formularios.
- `styles/_mobile.scss`: un único mixin para acotar las adaptaciones de componentes a móvil privado.
- `styles/_role-shell.scss`: marco compartido de administración, usuario e invitado. Centraliza cabecera, márgenes y reserva inferior, manteniendo el propietario de scroll de cada tipo de router.
- Cabecera y barra inferior: adaptación visual en sus componentes compartidos. La fase de navegación descrita abajo traslada el panel móvil a «Más».
- La barra inferior mide 61 px más el área segura. La pestaña activa cambia el color de icono/texto y muestra una marca superior de 24 × 3 px, sin fondo alrededor del icono. `--mobile-tab-active-color` y `--mobile-tab-indicator-color` centralizan ambos colores en `_mobile-design.scss`; altura y reserva de espacio comparten variables.
- Noticias y formularios mantienen su composición y estilos locales; su adaptación queda pendiente de la fase de contenido.
- Selección de roles: se reutilizan `RoleCardComponent` y `ListCardComponent` sin rediseñar las tarjetas del resto de páginas. En apps privadas el selector muestra los roles del club configurado que no estén pendientes/en borrador; si falta `clubId`, usa el club activo. Oculta el cambio si no hay otro rol disponible. Conserva selección activa, cierre y navegación existentes.

## Segunda implementación: migración del menú lateral a «Más»

Autorizada después de guardar los ajustes visuales. Aplicada en la misma rama, para móvil privado; el lateral de escritorio y la navegación pública mantienen sus opciones.

1. «Más» reúne identidad (avatar, nombre, club y rol), cambio de rol, servicios del club, cuenta y cierre de sesión.
2. `AccountIdentityComponent` y `ActionRowComponent` son reutilizables. Las filas existentes de «Más» se extraen al componente común y conservan su presentación de escritorio.
3. `MobileNavigationService` centraliza el corte de 768 px y `environment.private`. Retira la hamburguesa y el panel móvil únicamente cuando está activa esta variante.
4. Perfil y Configuración mantienen sus rutas principales y su contenido. Desde «Más» reciben `from=more`; ambos botones de regreso reconstruyen el destino con el rol seleccionado, incluso al recargar o girar el dispositivo. No se aceptan URLs de retorno arbitrarias. La barra inferior no aparece dentro de estas dos pantallas.
5. Administración conserva Configuración del club y Usuarios, separadas de los ajustes personales. Usuario conserva Mis documentos, Información y Contactar. El selector sigue limitado al club privado y se oculta con un solo rol disponible.
6. Invitado dispone de ruta y pestaña «Más» en la app privada. Información pasa allí junto a Contactar y Salir del modo invitado. La barra queda en Noticias, Partidos, Patrocinadores y Más. No muestra Perfil, cambio de contraseña ni selector de rol. Se conserva el regreso desde Información/Contactar y el acceso a Patrocinadores cuando es el origen del contacto.
7. Las pantallas conservadas por Ionic actualizan el contexto de rol al navegar. El menú empieza a observar navegación después de recibir sus entradas y libera la suscripción al destruirse.
8. Las rutas y guardas de autenticación existentes se mantienen. El cambio multiclub público y el contenido del resto de páginas continúan fuera de esta fase.

## Tercera implementación: `app-user-header` solo en la portada, generalización de «Más»

Se probó primero una cabecera contextual (logo/atrás + título + acción) presente en todas las páginas, con un `PageHeaderService` para títulos dinámicos y acciones por página. Al revisarlo, el usuario prefirió una solución más simple: la cabecera desaparece de todas las páginas salvo la portada de cada rol, donde se reduce a logo del club + notificaciones (solo Member). Esa versión intermedia se revirtió por completo (`PageHeaderService` eliminado, `_layout.scss` y `back-button.component.scss` vueltos a su estado anterior) antes de implementar esta.

A diferencia de las dos fases anteriores, la generalización de «Más» **se aplica a todas las apps, no solo a las privadas** — corrige el corte de la primera fase (punto 13, más arriba), que limitaba esa navegación a `environment.private`.

1. `app-user-header` deja de vivir en los tres shells (`admin.page.html`/`member.page.html`/`guest.page.html`) y de ser un menú de cuenta. Gana un modo back-button (`showBackButton` + `title` + `backRoute`, sin logo ni notificaciones) pensado para **móvil**: cada página que lo necesita lo añade a su propia plantilla, con su propio título y destino de vuelta — no hay cálculo de URL centralizado en el shell.
2. `_layout.scss` gana una clase compartida `.mobile-page-header` (sticky, oculta salvo en móvil, con margen negativo para compensar el padding de página y quedar a sangre) para envolver `app-user-header` en páginas anidadas dentro de un `router-outlet`. La usan la portada (logo + notificaciones) y cada página de detalle (back-button + título). Las páginas fuera de ese contexto (p. ej. `join-team`, ruta de nivel superior sin ese padding) usan un wrapper sticky propio, sin el margen negativo.
3. `app-back-button`/`.section-header-with-back-button` — el patrón ya existente en ~13 páginas de detalle — vuelve a ser **solo de escritorio** (`back-button.component.scss` recupera su `display:none` en móvil); en móvil esas mismas páginas ahora usan su propio `app-user-header` en modo back-button en vez de `app-back-button`. `.section-title` dentro de `.section-header-with-back-button` se oculta en móvil (una sola regla en `_layout.scss`) para no duplicar el título que ya muestra la cabecera. Las pocas páginas que no tenían ningún back-button propio (`information`, `my-documents`, `contact`, `match-detail`, `team-detail`) lo incorporan ahora, con el mismo patrón.
4. `_role-shell.scss` deja de reservar espacio de cabecera (`.mobile-header`, `--app-mobile-header-height` en el cálculo de altura) — los tres shells vuelven a ser solo menú + `router-outlet`; ya no alojan ningún `app-user-header`. Los cómputos `backUrl`/`showBackButton`/`pageTitle`/`goBack` que antes vivían en los tres shells desaparecen (se descartó deliberadamente esa vía, para no repetir el cálculo de URL por ruta); `isDetailPage` se queda, ya que también oculta el menú y activa el ancho completo en las páginas de detalle.
5. La bottom tab bar recupera «Home» como pestaña explícita (se quita la exclusión `item.id !== 'home'` en `menu.component.ts`), pasando de 4 a 5 pestañas en Member/Admin/Guest — Notifications sigue fuera de la barra (solo vive en la campana de la portada). Invitado gana una entrada «Home» en `GUEST_MENU_CONFIG` que no existía antes, por paridad con Member/Admin.
5. `MobileNavigationService.accountInMore()`/`accountBackUrl()` pierden la condición `environment.private`: la cuenta (perfil, ajustes, cambio de rol, cierre de sesión) vive en «Más» en móvil para cualquier app, incluida la pública. La ruta `more` de invitado, antes solo registrada en apps privadas, se registra siempre.

## Excepciones a migrar con el usuario

Las páginas reciben los tokens comunes cuando los consumen; sus composiciones propias no se consideran migradas por ello.

| Área | Excepción actual | Migración propuesta |
| --- | --- | --- |
| Noticias y formularios compartidos | Tarjetas/listas con bordes, tamaños y algunos colores locales. | Adaptar `NewsCardComponent`, `FormsGroupSectionComponent`, `FormHeaderComponent` y `FormSubmissionCardComponent` cuando se autorice el diseño de contenido. |
| Inicio | `home.page` tiene destacados de noticias y formularios propios (`news-hero`, `form-highlight-card`). | Reutilizar las variantes de noticias y extraer el destacado de formulario como componente compartido. |
| Más | Migración realizada en la segunda fase. | Identidad y filas ya usan `AccountIdentityComponent` y `ActionRowComponent`. |
| Perfil y Configuración | Tarjetas y controles Ionic con estilos propios; rutas externas al marco por rol. | El regreso a «Más» está resuelto. Pendiente adaptar el contenido a primitivas comunes cuando se autorice. |
| Mis documentos | `document-card` e icono con colores propios. | Extraer fila de documento reutilizable para listas y vistas de envíos. |
| Notificaciones / bandeja | Filas, agrupaciones y estados de lectura particulares. Título y «marcar todo como leído» ya viven en la cabecera compartida en móvil (tercera fase). | Compartir la base de fila de actividad, conservando la semántica de lectura y acciones. |
| Gestión administrativa | Tablas de noticias, usuarios y envíos con estructura particular. | Acordar un patrón común de tabla/lista móvil y aplicar por familia, no por página. |
| Detalles de noticias, información y patrocinadores | Composición de lectura, galerías y cabeceras específicas. | Compartir el patrón de contenido de club y medios antes de cambiar esas composiciones. |
| Acceso / selección inicial de equipos | Sistema de composición propio de autenticación. | Acordar por separado su adaptación; no mezclar la selección inicial con el cambio de rol dentro del club. |

## Criterios para continuar

- Mantener la única `page-container` de ADR 0004.
- Añadir tokens o variantes al componente común cuando un patrón se repita.
- Conservar los estados funcionales (aprobado, rechazado, pendiente), las traducciones y los permisos.
- Verificar móvil estrecho, el corte de 768/769 px, reserva inferior, contenido largo y cambio de rol. Comprobar escritorio y app no privada como referencias de regresión.

## Validación de esta fase

- Compilaciones de producción de Voltregà y TacticalHub correctas.
- Ocho pruebas del selector correctas: filtrado por club, actualización de roles, ocultación del cambio, selección y conservación del comportamiento multiclub público. Se usa `ng test app --watch=false --browsers=ChromeHeadless --builder-mode=application --include=src/app/components/role-selector/role-selector.component.spec.ts --progress=false` por incompatibilidades preexistentes del ejecutor anterior.
- Comprobación de TypeScript y ESLint en los archivos modificados; ESLint requiere `ESLINT_USE_FLAT_CONFIG=false` para la configuración actual del repositorio.
- Revisión visual de los componentes reales con datos locales de ejemplo: anchos de 320, 390 y 768 px, barra inferior sin desbordamiento y selector con desplazamiento interno. Referencias de escritorio a 770 y 1280 px.
- La revisión visual usó un montaje temporal de componentes, retirado al finalizar. No sustituye una prueba completa con una cuenta autenticada ni una comprobación en dispositivo nativo.

## Validación de la migración a «Más»

- 23 pruebas correctas: activación por ancho/app privada, regreso a cuenta, variantes de usuario/administración/invitado, rol conservado por Ionic y navegación de invitado; incluyen las ocho pruebas del selector. Compilaciones de producción de ambas apps correctas y ESLint sin errores (aviso preexistente de `OnInit` en la cabecera).
- Revisión local con los componentes y contenedores Ionic reales y servicios simulados: «Más → Perfil → Más», «Más → Configuración → Más» y cambio de usuario a administración. Comprobados móvil de 320/390/768 px, lateral de escritorio y variante pública con hamburguesa.
- Invitado usa el identificador del club al navegar. Su lista de servicios permanece visible al ampliar la ventana desde «Más».
- El montaje temporal no forma parte de la app. No se han cambiado datos de usuarios ni ejecutado acciones contra el servidor durante la revisión visual.
