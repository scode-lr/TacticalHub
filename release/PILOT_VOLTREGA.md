# Piloto Voltregà CF

## Condiciones de entrada

- [ ] Deploy de API con migraciones aplicadas y backup verificado.
- [ ] `AppName=Voltregà CF` y `RegistrationClubId` apuntando al club real de Voltregà.
- [ ] SMTP de producción entrega verificación y recuperación.
- [ ] FCM/APNs configurados en el build del piloto.
- [ ] URLs legales públicas sin marcadores pendientes.
- [ ] Dos administradores activos para evitar bloqueo por baja del último admin.
- [ ] Datos de prueba separados de jugadores reales hasta aprobar el tratamiento.

## Cuentas y matriz de aislamiento

Preparar, sin compartir contraseñas en este documento:

- Administrador A de Voltregà.
- Entrenador A asignado a un único equipo de Voltregà.
- Miembro A de Voltregà.
- Administrador B y miembro B de un segundo club de prueba.
- Usuario multi-club con una relación distinta en cada club.

Cada operación marcada como prohibida debe devolver `401/403/404` y no revelar si el recurso ajeno existe.

## Flujos críticos

### Identidad

- [ ] Registro con edad de 14 años o más crea relación `User` con Voltregà.
- [ ] Registro de menor de 14 años queda bloqueado en UI y API.
- [ ] No hay acceso antes de validar el código recibido por correo.
- [ ] Validar código inicia sesión sin pedir credenciales de nuevo.
- [ ] Código incorrecto, caducado y reutilizado quedan rechazados.
- [ ] Recuperación cambia contraseña y revoca sesiones anteriores.
- [ ] Logout revoca la cookie del servidor.
- [ ] Baja desde Perfil exige contraseña, revoca sesiones/tokens y desactiva relaciones.

### Roles y clubes

- [ ] Admin A gestiona usuarios, roles, equipos, noticias, formularios y exportaciones de Voltregà.
- [ ] Entrenador A solo accede a sus equipos y jugadores asignados.
- [ ] Miembro A solo accede a información publicada para su relación.
- [ ] Ninguna cuenta A puede leer o mutar recursos exclusivos del Club B.
- [ ] El usuario multi-club ve cada contexto por separado y cambiar de rol no mezcla datos.
- [ ] Nadie puede autoasignarse Admin ni asignar un equipo de otro club.
- [ ] No se puede eliminar o desactivar al último administrador activo.

### MVP y datos

- [ ] Crear equipo/temporada, añadir jugador, editar y eliminar.
- [ ] Crear/publicar noticia y comprobar audiencia.
- [ ] Crear formulario, completar, consultar respuestas y exportar.
- [ ] CSV abre con acentos correctos y no ejecuta valores iniciados por `=`, `+`, `-` o `@`.
- [ ] DNI/IBAN/firma no se exportan sin selección consciente.
- [ ] Google Sheets crea/usa la hoja autorizada, conserva cabeceras y reintenta cuotas temporales.
- [ ] IBAN solo se muestra desenmascarado a un administrador autorizado durante exportación.

### Push

- [ ] Permiso aceptado y denegado no rompe el uso de la app.
- [ ] Recepción Android e iOS en foreground, background y app cerrada.
- [ ] Tocar abre la relación y bandeja correctas.
- [ ] Logout y cambio de usuario no filtran avisos.

## Dispositivos mínimos

| Plataforma | Dispositivo/versión | Orientación | Red |
|---|---|---|---|
| iPhone | iOS actual | Vertical | Wi-Fi y 4G/5G |
| iPhone | iOS anterior compatible | Vertical | Wi-Fi |
| Android | Android 13 | Vertical | Wi-Fi |
| Android | Android 15/16 | Vertical | Wi-Fi y datos |
| Web | Safari iPhone + Chrome Android | Vertical | Wi-Fi |

Comprobar además teclado, notch/safe areas, retorno desde segundo plano, modo oscuro del sistema, permisos revocados y mala conectividad.

## Salida del piloto

- [ ] Cero fallos P0: fuga entre clubes, pérdida/corrupción, acceso sin verificar o baja incompleta.
- [ ] Cero fallos P1 abiertos en registro, login, formularios, push o roles.
- [ ] P2 documentados con responsable y fecha.
- [ ] Aprobación escrita del responsable de Voltregà.
- [ ] Evidencia de backup/restore y plan de rollback.
