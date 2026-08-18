# Materiales, firma y publicación

## Materiales por aplicación e idioma

- [ ] Nombre, subtítulo/resumen y descripción larga coherentes con funciones reales.
- [ ] Palabras clave/categoría, URL de soporte y correo atendido.
- [ ] URL pública HTTPS de privacidad.
- [ ] URL pública HTTPS de eliminación de cuenta.
- [ ] Icono maestro sin transparencia y recursos nativos generados.
- [ ] Capturas reales sin datos personales: inicio, noticias, formularios, equipo y notificaciones.
- [ ] Textos y capturas en catalán, español e inglés si se publican esas localizaciones.
- [ ] Declaraciones Apple App Privacy y Google Data safety consistentes con la política y SDK reales.
- [ ] Cuenta demo estable para revisión con contenido ficticio y pasos de acceso.

Apple permite de una a diez capturas por tamaño/localización. Preparar al menos el juego iPhone 6,9 pulgadas en uno de los tamaños admitidos, por ejemplo `1320 x 2868`, sin canal alfa. En Google Play la descripción breve admite hasta 80 caracteres y la completa hasta 4.000; preparar además icono de Play, feature graphic y capturas de teléfono.

## Android / Google Play

- [ ] Confirmar `com.tactical.hub` o `es.tacticalhub.voltrega` antes de crear la ficha.
- [ ] Crear un keystore de upload exclusivo, cifrado y con dos copias seguras.
- [ ] No guardar keystore ni contraseñas en Git.
- [ ] Activar Play App Signing y documentar propietario/recuperación.
- [ ] Incrementar `versionCode` en cada entrega y fijar `versionName`.
- [ ] Generar AAB `release`, comprobar firma y subir primero a Internal testing.
- [ ] Target API 35 solo si la entrega se hace antes del 31 de agosto de 2026; después, API 36 salvo extensión.
- [ ] Completar Content rating, Target audience, Ads, App access y Data safety.
- [ ] Informar la URL de eliminación y verificarla sin login.

## iOS / App Store Connect

- [ ] Registrar App ID explícito idéntico al bundle ID y habilitar Push Notifications.
- [ ] Compilar con Xcode 26 y el SDK de iOS 26 o posterior, requisito para cargas desde el 28 de abril de 2026.
- [ ] Configurar Apple Distribution y perfil App Store Connect, o firma automática en Xcode.
- [ ] Crear APNs Auth Key y custodiar el `.p8` fuera de Git.
- [ ] Incrementar build number en cada carga y fijar marketing version.
- [ ] Archive en Xcode, Validate App y distribuir primero por TestFlight interno.
- [ ] Completar Age Rating, App Privacy, export compliance y Review Information.
- [ ] Proporcionar cuenta demo e instrucciones para cambiar de club/rol.
- [ ] Verificar que eliminación de cuenta sea fácil de localizar desde Perfil.

## BLOQUEANTES actuales

1. Completar la identidad legal del prestador Tactical Hub en los documentos de Voltregà.
2. Publicar por HTTPS las URLs de privacidad, soporte, condiciones y eliminación de cuenta.
3. Obtener la revisión jurídica de privacidad, bases, conservación, encargados y transferencias.
4. Configurar APNs, habilitar las capacidades iOS y cargar los secretos del servidor de Voltregà.
5. Ejecutar el piloto físico y recopilar capturas sin datos reales.
6. Confirmar la cuenta Apple Developer y sus permisos de publicación.

## Estado técnico de Voltregà a 13 de agosto de 2026

- [x] Bundle ID nativo: `es.tacticalhub.voltrega`.
- [x] Versión de marketing `1.0` y build `1`.
- [x] Build web de producción superada.
- [x] Proyecto iOS sincronizado con siete plugins Capacitor.
- [x] Icono iOS 1024 x 1024 sin transparencia.
- [x] Eliminación de cuenta disponible desde Perfil y mediante página pública integrada.
- [ ] Equipo de firma y capacidades Push Notifications/Remote notifications configurados en Xcode.
- [ ] Archive y Validate App ejecutados en un Mac con Xcode 26.
