# 5. Rediseño móvil desde estilos comunes y componentes reutilizables

## Estado

Aceptado el 2026-09-03. Primera implementación en `codex/mobile-shared-design`.

## Decisión acordada

- El diseño se resuelve con una base común y ajustes en componentes reutilizables.
- No se rediseñan las páginas una a una ni se acumulan selectores específicos de páginas en el SCSS global.
- Las excepciones se documentan y se proponen para migración a componentes/patrones comunes antes de rediseñarlas.
- Aclaración del usuario durante la implementación: no rediseñar el contenido de las páginas todavía. Esta fase cubre la base visual común, el marco móvil y el selector; las composiciones, tarjetas y listas de contenido quedan pendientes.
- Esta fase se activa solamente en apps privadas (`environment.private`) y hasta 768 px, siguiendo el corte de navegación existente. Es un corte por ancho, no por sistema operativo.
- Escritorio y apps no privadas conservan su presentación. El estudio del flujo multiclub público queda pendiente.

## Primera implementación

- `styles/_mobile-design.scss`: colores semánticos, tipografía, controles y medidas compartidas. Usa `--club-brand` y `--club-brand-soft`, definidos en el tema del proyecto; Voltregà usa amarillo, blanco cálido y carbón. No modifica la composición de tarjetas ni abre/reorganiza las secciones de formularios.
- `styles/_mobile.scss`: un único mixin para acotar las adaptaciones de componentes a móvil privado.
- `styles/_role-shell.scss`: marco compartido de administración, usuario e invitado. Centraliza cabecera, márgenes y reserva inferior, manteniendo el propietario de scroll de cada tipo de router.
- Cabecera y barra inferior: adaptación visual en sus componentes compartidos. La hamburguesa y el panel lateral se mantienen hasta la fase de navegación.
- La barra inferior mide 61 px más el área segura. La pestaña activa cambia el color de icono/texto y muestra una marca superior de 24 × 3 px, sin fondo alrededor del icono. `--mobile-tab-active-color` y `--mobile-tab-indicator-color` centralizan ambos colores en `_mobile-design.scss`; altura y reserva de espacio comparten variables.
- Noticias y formularios mantienen su composición y estilos locales; su adaptación queda pendiente de la fase de contenido.
- Selección de roles: se reutilizan `RoleCardComponent` y `ListCardComponent` sin rediseñar las tarjetas del resto de páginas. En apps privadas el selector muestra los roles del club configurado que no estén pendientes/en borrador; si falta `clubId`, usa el club activo. Oculta el cambio si no hay otro rol disponible. Conserva selección activa, cierre y navegación existentes.

## Pendiente: migración del menú lateral a «Más»

Guardado por petición del usuario; no implementado en esta fase.

1. Mantener «Más» como pestaña, con identidad (avatar, nombre, club y rol), cambio de rol, servicios del club, cuenta y cierre de sesión.
2. Trasladar las acciones del panel lateral móvil a esa pantalla y retirar la hamburguesa móvil. Conservar el lateral de escritorio.
3. Perfil y Configuración: abrir desde «Más» como pantallas secundarias y asegurar un regreso a «Más». No reorganizar sus rutas para mantener la barra inferior dentro en esta fase.
4. Respetar cada rol: administración conserva Configuración del club y Usuarios; usuario conserva Mis documentos, Información y Contactar.
5. Invitado necesita una variante específica: actualmente no tiene pestaña ni ruta «Más». Mostrar solo acciones válidas para invitado.
6. Reutilizar el selector en las apps privadas. No diseñar todavía el cambio multiclub de las apps no privadas.

## Excepciones a migrar con el usuario

Las páginas reciben los tokens comunes cuando los consumen; sus composiciones propias no se consideran migradas por ello.

| Área | Excepción actual | Migración propuesta |
| --- | --- | --- |
| Noticias y formularios compartidos | Tarjetas/listas con bordes, tamaños y algunos colores locales. | Adaptar `NewsCardComponent`, `FormsGroupSectionComponent`, `FormHeaderComponent` y `FormSubmissionCardComponent` cuando se autorice el diseño de contenido. |
| Inicio | `home.page` tiene destacados de noticias y formularios propios (`news-hero`, `form-highlight-card`). | Reutilizar las variantes de noticias y extraer el destacado de formulario como componente compartido. |
| Más | `more-row` pertenece a una página y contiene solo servicios. | Extraer fila/grupo de acciones reutilizable al incorporar identidad y cuenta. |
| Perfil y Configuración | Tarjetas y controles Ionic con estilos propios; rutas externas al marco por rol. | Adaptar secciones y controles a las primitivas comunes; conservarlas como pantallas secundarias con regreso. |
| Mis documentos | `document-card` e icono con colores propios. | Extraer fila de documento reutilizable para listas y vistas de envíos. |
| Notificaciones / bandeja | Filas, agrupaciones y estados de lectura particulares. | Compartir la base de fila de actividad, conservando la semántica de lectura y acciones. |
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
