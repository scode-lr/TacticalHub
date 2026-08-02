# Configuración de notificaciones push

## API por despliegue/app

Configurar mediante variables de entorno de .NET (`__` separa secciones):

```text
AppName=Tactical Hub                         # o Voltregà CF
PushNotifications__Enabled=true
PushNotifications__FirebaseProjectId=<firebase-project-id>
PushNotifications__AndroidChannelId=tacticalhub_general
PushNotifications__ApnsTeamId=<apple-team-id>
PushNotifications__ApnsKeyId=<apns-key-id>
PushNotifications__ApnsBundleId=com.tactical.hub
PushNotifications__ApnsUseSandbox=false
GOOGLE_SERVICE_ACCOUNT_JSON=<json-completo-en-una-linea>
APNS_PRIVATE_KEY=<contenido-completo-del-fichero-p8>
```

Para Voltregà, usar `AppName=Voltregà CF` y `PushNotifications__ApnsBundleId=com.voltregacf.hub`. No compartir accidentalmente un despliegue cuyo `AppName` corresponda a otra app: los tokens se aíslan por ese valor configurado en el servidor.

## Android

1. Crear una app Android en Firebase por cada `applicationId`.
2. Descargar su `google-services.json` y guardarlo localmente en `<proyecto>/android/app/google-services.json`.
3. No versionar el archivo si contiene configuración propia del entorno.
4. Ejecutar el build web y `npx cap sync android` desde el subproyecto.
5. Probar permiso en Android 13+, token, recepción en foreground/background, toque y logout.

`BLOQUEANTE`: el proyecto nativo actual de Voltregà tiene target SDK 35. Es válido para nuevas entregas hasta el 30 de agosto de 2026; Google Play exigirá API 36 a partir del 31 de agosto de 2026 salvo extensión aplicable. Si se publica después, actualizar la cadena Android/Capacitor y repetir todo el piloto.

## iOS

1. Registrar el App ID explícito con Push Notifications.
2. Crear la APNs Auth Key `.p8` y conservar de forma segura Team ID y Key ID.
3. Generar/sincronizar el proyecto iOS y habilitar `Push Notifications` y `Background Modes > Remote notifications` en Xcode.
4. Confirmar que `AppDelegate` reenvía correctamente a Capacitor los callbacks de registro APNs.
5. Usar sandbox en pruebas de desarrollo y producción para TestFlight/App Store.

## Casos de aceptación

- Un usuario autenticado registra un token para la app correcta.
- El mismo dispositivo cambia de usuario sin enviar notificaciones al usuario anterior.
- Logout desactiva el token.
- Eliminar cuenta borra sus tokens.
- Token inválido se desactiva sin romper la notificación interna.
- El toque abre las notificaciones del rol/club correcto.
- Un aviso de Club A nunca llega a usuarios que solo pertenecen a Club B.
