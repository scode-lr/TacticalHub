# Estado de preparación de publicación

Actualizado: 1 de agosto de 2026.

## Estado actual

| Bloque | Estado | Pendiente externo |
|---|---|---|
| Roles y aislamiento multi-club | Implementado y cubierto por tests | Piloto con dos cuentas y dos clubes reales |
| Registro, verificación, recuperación y baja | Implementado | SMTP de producción y prueba real de entrega |
| MVP de equipos, jugadores y usuarios | Implementado | Validación funcional del club |
| Push Android/iOS | Implementado en app y API | Credenciales FCM/APNs y proyectos nativos |
| CSV y Google Sheets | Implementado y endurecido | Cuenta de servicio y hoja del club |
| Privacidad, términos y aviso legal | Borradores integrados | Identidades legales y revisión jurídica |
| Pruebas de dispositivo y piloto | Guion preparado | Dispositivos físicos y usuarios piloto |
| Stores y firma | Checklist preparado | Cuentas, certificados, keystore y creatividades finales |

La rama no debe marcarse como lista para producción hasta cerrar todos los elementos `BLOQUEANTE` de los documentos de esta carpeta.

## Validaciones automáticas superadas

- API .NET en `Release`: 0 errores y 0 advertencias.
- 19 tests de API: 19 superados.
- Builds de producción: Tactical Hub y Voltregà CF superados.
- Proyectos Capacitor Android/iOS generados y sincronizados localmente; plugin push detectado en ambos.
- APK debug Android de Tactical Hub y Voltregà CF compilados correctamente.
- Smoke web a 390 x 844: sin overflow horizontal, sin errores de consola y enlaces legales accesibles.
- Migraciones EF: modelo sin cambios pendientes en la última comprobación.

## Identidades de aplicación

| Aplicación | App name | Bundle/Application ID |
|---|---|---|
| Tactical Hub | `Tactical Hub` | `com.tactical.hub` |
| Voltregà CF | `Voltregà CF` | `es.tacticalhub.voltrega` |

Estos identificadores deben coincidir exactamente en Capacitor, Firebase, Apple Developer, App Store Connect, Google Play y en `PushNotifications:ApnsBundleId`. Un identificador publicado no se cambia posteriormente.

## Orden recomendado

1. Completar datos legales y publicar las cuatro URLs públicas de cada app.
2. Configurar SMTP, cifrado, Google y push en el entorno de producción.
3. Aplicar migraciones y ejecutar el guion de piloto.
4. Generar proyectos nativos, instalar credenciales y probar push en dispositivos reales.
5. Congelar versión, generar AAB/IPA firmados y ejecutar el checklist de stores.
