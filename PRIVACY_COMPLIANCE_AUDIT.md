# Auditoría técnica de cumplimiento de la política de privacidad

**Proyecto:** TacticalHub / Voltregà CF  
**Fecha de revisión:** 23 de julio de 2026  
**Alcance:** frontend Angular/Ionic, API .NET y política publicada en `projects/voltregacf.hub/privacy-policy.html`.

> **Actualización técnica del 1 de agosto de 2026:** los hallazgos críticos C-01 a C-04, la restricción de edad, la baja de cuenta, la integración push, la revocación de refresh token y la protección de exportaciones se han corregido en el código actual. Los apartados históricos siguientes se conservan como evidencia de la auditoría original. El estado operativo y los bloqueantes vigentes están en [`release/README.md`](release/README.md), [`release/PILOT_VOLTREGA.md`](release/PILOT_VOLTREGA.md) y [`release/STORES.md`](release/STORES.md).

> Este documento es una revisión técnica del código y de su correspondencia con la política de privacidad. No sustituye una auditoría jurídica ni acredita la configuración efectiva de Railway, Neon, Cloudflare R2, Google Workspace u otros proveedores.

## Resumen ejecutivo

El proyecto no cumple actualmente varias promesas materiales incluidas en la política. Los problemas más urgentes son:

1. Un usuario autenticado puede asignarse a sí mismo el rol de administrador de cualquier club.
2. Existe un endpoint sin autenticación que expone datos personales completos de usuarios.
3. Algunos permisos de administrador no están limitados al club correspondiente.
4. Existen operaciones administrativas que pueden ejecutarse sin autenticación.
5. DNI e IBAN pueden incluirse por defecto en las exportaciones.
6. Las imágenes de noticias se almacenan mediante URLs públicas.

Los cuatro primeros puntos deberían corregirse antes de considerar la aplicación apta para producción. Si la API ya está publicada, conviene revisar los registros para determinar si se han producido accesos no autorizados.

## Hallazgos críticos

### C-01. Escalada de privilegios mediante autoasignación de administrador

**Estado:** incumplimiento confirmado.  
**Riesgo:** crítico.

El endpoint `POST /roles/bind` requiere autenticación, pero permite que el propio usuario envíe el `roleId` y el `clubId` deseados:

- [UserClubRolesController.cs](../TacticalHubApi/Interfaces/Controllers/UserClubRolesController.cs#L42)
- [UserClubRolesService.cs](../TacticalHubApi/Application/Services/UserClubRolesService.cs#L35)

El servicio acepta el rol `AdminId = 1` y lo activa sin invitación ni aprobación. En una sesión posterior, el rol se incorpora al JWT:

- [UserRoles.cs](../TacticalHubApi/Domain/Constants/UserRoles.cs#L3)
- [AuthService.cs](../TacticalHubApi/Application/Services/AuthService.cs#L463)

Los roles del JWT tampoco contienen el club al que pertenecen. Como consecuencia, un usuario podría obtener permisos administrativos y acceder a formularios, noticias, integraciones o exportaciones que no le corresponden.

Esto contradice las promesas de control de acceso por roles, separación entre clubes y restricción de exportaciones.

**Corrección recomendada:**

- Impedir que un usuario elija libremente roles administrativos.
- Introducir invitaciones o aprobación de un administrador ya autorizado.
- Incluir o validar siempre el contexto de `clubId`.
- No utilizar un rol global del JWT como prueba suficiente de autorización sobre un club.

### C-02. Exposición pública de datos personales

**Estado:** incumplimiento confirmado.  
**Riesgo:** crítico.

`GET /users/{id}` no tiene el atributo `[Authorize]`:

- [UserController.cs](../TacticalHubApi/Interfaces/Controllers/UserController.cs#L102)

La respuesta puede contener:

- Correo electrónico.
- Nombre y apellidos.
- Fecha de nacimiento.
- Avatar.
- Fecha del último acceso.
- Clubes, equipos y roles.

La estructura se encuentra en:

- [UserResponseDto.cs](../TacticalHubApi/Interfaces/DTOs/UserResponseDto.cs#L5)

Al utilizar identificadores numéricos, un tercero podría intentar enumerar usuarios. Si esta versión está desplegada y accesible, debe tratarse como una posible exposición de datos hasta revisar los registros.

**Corrección recomendada:**

- Retirar el endpoint si no es imprescindible.
- Como mínimo, exigir autenticación y autorización contextual.
- Crear DTOs mínimos para cualquier dato que deba ser visible a otros usuarios.
- Revisar logs históricos de llamadas a `/users/{id}`.

### C-03. Acceso cruzado a formularios entre clubes

**Estado:** incumplimiento confirmado.  
**Riesgo:** crítico.

Algunos endpoints solo comprueban la existencia del rol global `Admin`, pero no que el usuario sea administrador del club propietario del formulario.

Ejemplos:

- Consulta de respuestas: [FormsController.cs](../TacticalHubApi/Interfaces/Controllers/FormsController.cs#L142).
- El servicio no recibe el usuario ni valida el club: [FormService.cs](../TacticalHubApi/Application/Services/FormService.cs#L100).
- Creación de formularios indicando cualquier `ClubId`: [FormsController.cs](../TacticalHubApi/Interfaces/Controllers/FormsController.cs#L302).
- Modificación de formularios sin usuario ni validación de club: [FormsController.cs](../TacticalHubApi/Interfaces/Controllers/FormsController.cs#L346) y [FormService.cs](../TacticalHubApi/Application/Services/FormService.cs#L386).

Las rutas específicas de exportación sí realizan una validación adicional de administrador del club, pero esta protección no está aplicada uniformemente.

**Corrección recomendada:**

- Centralizar una política `ClubAdminRequirement`.
- Resolver el club propietario de cada recurso antes de autorizar la operación.
- Aplicar la misma validación a lectura, creación, actualización, eliminación y exportación.
- Añadir pruebas automáticas de aislamiento entre clubes.

### C-04. Operaciones administrativas sin autenticación

**Estado:** incumplimiento confirmado.  
**Riesgo:** crítico para la integridad del sistema.

La API define políticas de autorización, pero no una política global que obligue a autenticar todos los endpoints por defecto:

- [ServiceConfiguration.cs](../TacticalHubApi/Infrastructure/Configuration/ServiceConfiguration.cs#L144)

Ejemplos de operaciones abiertas:

- Crear clubes: [ClubController.cs](../TacticalHubApi/Interfaces/Controllers/ClubController.cs#L36).
- Crear o modificar metadatos de clubes: [ClubController.cs](../TacticalHubApi/Interfaces/Controllers/ClubController.cs#L141).
- Crear equipos: [TeamController.cs](../TacticalHubApi/Interfaces/Controllers/TeamController.cs#L35).
- Crear deportes, categorías, divisiones y temporadas.

Aunque algunas de estas operaciones no traten directamente datos personales, contradicen las medidas de control de acceso e integridad declaradas.

**Corrección recomendada:**

- Configurar una `FallbackPolicy` que exija autenticación.
- Marcar expresamente con `[AllowAnonymous]` únicamente los endpoints públicos previstos.
- Aplicar autorización administrativa y contextual a todas las mutaciones.

## Hallazgos de riesgo alto

### A-01. Exportación no selectiva de DNI e IBAN

**Estado:** incumplimiento confirmado.  
**Riesgo:** alto.

La política establece que DNI e IBAN solo se exportarán cuando el administrador seleccione expresamente esas columnas. Sin embargo, el perfil por defecto habilita todos los campos:

- [FormService.cs](../TacticalHubApi/Application/Services/FormService.cs#L772)

Si no existe una configuración, el CSV también incluye todos los campos:

- [FormsController.cs](../TacticalHubApi/Interfaces/Controllers/FormsController.cs#L502)

Para exportar, los valores sensibles se descifran:

- [FormService.cs](../TacticalHubApi/Application/Services/FormService.cs#L706)

La integración con Google Sheets permite compartir con cualquier dirección de correo válida, sin comprobar que sea una cuenta corporativa o autorizada por el club:

- [ExternalIntegrationService.cs](../TacticalHubApi/Application/Services/ExternalIntegrationService.cs#L142)

**Corrección recomendada:**

- Deshabilitar DNI, IBAN y firma en los perfiles de exportación por defecto.
- Exigir una selección consciente y explícita.
- Mostrar una advertencia y registrar quién realizó la exportación.
- Restringir Google Sheets a cuentas o dominios autorizados por el club.

### A-02. Imágenes de noticias almacenadas públicamente

**Estado:** incumplimiento confirmado.  
**Riesgo:** alto, especialmente para imágenes de menores.

La política indica que las imágenes de personas y menores deben permanecer en almacenamiento privado o restringido. El servicio R2 requiere una URL pública y devuelve una URL directa:

- [R2ImageStorageService.cs](../TacticalHubApi/Application/Services/R2ImageStorageService.cs#L35)
- [R2ImageStorageService.cs](../TacticalHubApi/Application/Services/R2ImageStorageService.cs#L105)

Las imágenes de noticias usan este servicio:

- [NewsPostService.cs](../TacticalHubApi/Application/Services/NewsPostService.cs#L241)

Tampoco se encontró una entidad dedicada para registrar el consentimiento de imágenes o su retirada.

**Corrección recomendada:**

- Separar recursos públicos —logos y escudos— de imágenes personales.
- Usar un bucket privado y URLs firmadas con caducidad.
- Registrar finalidad, alcance, fecha y evidencia del consentimiento.
- Implementar la retirada y eliminación de las imágenes afectadas.

### A-03. Registro permitido a menores de 14 años

**Estado:** incumplimiento confirmado respecto a la política.  
**Riesgo:** alto.

La política prohíbe crear cuentas a menores de 14 años. El backend exige una fecha de nacimiento, pero no calcula ni valida la edad:

- [SignUpRequestDto.cs](../TacticalHubApi/Interfaces/DTOs/SignUpRequestDto.cs#L15)
- [AuthService.cs](../TacticalHubApi/Application/Services/AuthService.cs#L152)

El frontend únicamente valida el formato y que la fecha no sea futura:

- [signup.page.ts](src/app/pages/auth/signup/signup.page.ts#L75)

**Corrección recomendada:**

- Validar la edad en el backend, no solo en la interfaz.
- Rechazar el alta de menores de 14 años si se mantiene la prohibición de la política.
- Si se decide admitirlos, diseñar un procedimiento verificable de autorización del representante legal y actualizar la política.

### A-04. Eliminación de cuenta no implementada

**Estado:** incumplimiento confirmado de las funcionalidades anunciadas.  
**Riesgo:** alto.

La política ofrece eliminación desde la aplicación y una página pública de solicitud. No se encontró ninguna de las dos.

La API de usuario solo contiene operaciones de lectura:

- [UserController.cs](../TacticalHubApi/Interfaces/Controllers/UserController.cs#L42)

Existe un método de dominio para desactivar una cuenta, pero no un endpoint ni un flujo que ejecute la eliminación, anonimización, bloqueo y limpieza prometidos.

El correo publicado permite tramitar solicitudes manualmente, pero no sustituye las otras funcionalidades expresamente anunciadas.

**Corrección recomendada:**

- Crear solicitud autenticada dentro de la aplicación.
- Crear una página pública para solicitudes externas.
- Diseñar un workflow de verificación de identidad y aprobación.
- Revocar sesiones, eliminar datos innecesarios y anonimizar los históricos que deban conservarse.
- Registrar la ejecución y los motivos de cualquier dato bloqueado.

### A-05. Plazos de conservación sin implementación técnica

**Estado:** no implementado en los repositorios revisados.  
**Riesgo:** alto.

No se encontraron trabajos periódicos o servicios de limpieza para aplicar los plazos publicados a:

- Cuentas inactivas.
- Borradores de formularios.
- Formularios enviados.
- DNI e IBAN.
- Mensajes de contacto.
- Logs técnicos.
- Copias de seguridad.
- Evidencias de consentimiento.

La retención de logs o backups podría estar configurada en los proveedores externos, pero debe documentarse y verificarse.

**Corrección recomendada:**

- Definir reglas de retención por categoría de datos.
- Implementar jobs idempotentes de revisión, bloqueo y eliminación.
- Documentar la retención real de Railway, Neon y R2.
- Mantener evidencias de ejecución y alertas ante fallos.

## Hallazgos de riesgo medio y documentales

### M-01. Política publicada con datos obligatorios pendientes

**Estado:** incumplimiento documental confirmado.

La política contiene marcadores sin completar para:

- Fecha de publicación.
- Nombre legal del club.
- CIF.
- Domicilio.
- Identidad del prestador tecnológico.

Véase [privacy-policy.html](projects/voltregacf.hub/privacy-policy.html#L397).

La política no debería considerarse definitiva hasta completar la identidad y los datos de contacto del responsable.

### M-02. El enlace de términos conduce a la política de privacidad

**Estado:** problema documental confirmado.

Los enlaces de “Términos de servicio” y “Política de privacidad” apuntan al mismo archivo:

- [welcome.page.html](src/app/pages/auth/welcome/welcome.page.html#L25)

No existe un documento independiente de términos de servicio. El usuario recibe, por tanto, información incorrecta sobre el documento que acepta.

### M-03. Firebase Cloud Messaging aparece en la política, pero no en el proyecto

**Estado:** descripción no respaldada por el código.

No se encontraron SDK, servicios, entidades ni almacenamiento de tokens FCM en frontend o backend. Las afirmaciones sobre desvincular tokens al cerrar sesión o eliminarlos por inactividad no corresponden a la implementación actual.

**Corrección recomendada:** eliminar las referencias a FCM mientras no se utilice, o implementar y documentar correctamente el tratamiento.

### M-04. Registro técnico excesivo o insuficientemente descrito

**Estado:** brecha de transparencia y retención por verificar.

El middleware registra:

- Dirección IP.
- Query string completa.
- Origen.
- Referente.
- User-agent.
- Ruta, estado y tiempo de respuesta.

Véase [ServiceConfiguration.cs](../TacticalHubApi/Infrastructure/Configuration/ServiceConfiguration.cs#L218).

Algunas queries pueden contener búsquedas por nombre de usuario. No se encontró una aplicación técnica del plazo de 30 días declarado para estos logs.

**Corrección recomendada:** minimizar campos, no registrar parámetros personales, definir retención y documentar expresamente las categorías necesarias.

### M-05. El cierre de sesión puede no revocar el refresh token del servidor

**Estado:** defecto técnico confirmado.

La cookie `refreshToken` se limita a la ruta `/auth/refresh`:

- [AuthController.cs](../TacticalHubApi/Interfaces/Controllers/AuthController.cs#L317)

El cierre de sesión se realiza en `/auth/logout`:

- [AuthController.cs](../TacticalHubApi/Interfaces/Controllers/AuthController.cs#L205)

Una cookie limitada a `/auth/refresh` normalmente no será enviada por el navegador a `/auth/logout`. Por ello, el backend puede no recibir el token que pretende revocar en base de datos, aunque el navegador sí reciba una instrucción para expirar la cookie.

**Corrección recomendada:** utilizar una ruta común adecuada, como `/auth`, o introducir un mecanismo de revocación que no dependa de una cookie inaccesible desde el endpoint de logout.

### M-06. HTTPS, backups y contratos no se pueden acreditar desde el código

`UseHttpsRedirection()` solo se activa en desarrollo:

- [ServiceConfiguration.cs](../TacticalHubApi/Infrastructure/Configuration/ServiceConfiguration.cs#L273)

Railway o Cloudflare pueden estar forzando HTTPS en producción, pero es necesario conservar evidencia de:

- Redirección y terminación TLS.
- Cifrado y retención de backups.
- Recuperación ante desastres.
- Contratos de encargado y subencargado.
- Ubicación de los datos y transferencias internacionales.
- Eliminación de copias residuales.

## Aspectos correctamente implementados

La revisión también encontró medidas alineadas con la política:

- Las contraseñas se almacenan mediante BCrypt.
- El IBAN se protege mediante cifrado AES-GCM: [SensitiveFieldService.cs](../TacticalHubApi/Application/Services/SensitiveFieldService.cs#L38).
- El access token se mantiene en memoria y no en `localStorage`: [token.service.ts](src/app/core/services/token.service.ts#L32).
- La cookie de refresh se configura como `HttpOnly` y `Secure`.
- Algunas rutas de exportación e integración sí verifican que el usuario sea administrador del club propietario.
- No se encontraron Firebase Analytics, Firebase Authentication, Crashlytics ni recopilación de ubicación.

Estas medidas son positivas, pero no compensan los fallos de autorización descritos en los hallazgos críticos.

## Orden de corrección recomendado

### Fase 1 — Contención inmediata

- [ ] Proteger o retirar `GET /users/{id}`.
- [ ] Bloquear la autoasignación de roles administrativos.
- [ ] Añadir autorización obligatoria por defecto.
- [ ] Revisar todos los endpoints de mutación actualmente anónimos.
- [ ] Revisar logs por accesos a datos personales o escaladas de privilegios.

### Fase 2 — Aislamiento entre clubes

- [ ] Implementar autorización contextual basada en `clubId`.
- [ ] Corregir lectura, creación y actualización de formularios.
- [ ] Auditar noticias, mensajes, notificaciones, equipos, patrocinadores e integraciones.
- [ ] Añadir tests de acceso cruzado entre dos clubes.

### Fase 3 — Datos sensibles

- [ ] Desactivar DNI, IBAN y firma en exportaciones por defecto.
- [ ] Restringir destinatarios de Google Sheets.
- [ ] Añadir auditoría específica de exportaciones sensibles.
- [ ] Separar almacenamiento público y privado en R2.
- [ ] Implantar consentimiento verificable para imágenes.

### Fase 4 — Derechos y conservación

- [ ] Implementar eliminación de cuenta y página pública de solicitud.
- [ ] Implementar anonimización, bloqueo y revocación de sesiones.
- [ ] Aplicar plazos de conservación mediante jobs.
- [ ] Documentar backups y borrado en proveedores.
- [ ] Implantar procedimientos para acceso, rectificación y portabilidad.

### Fase 5 — Documentación legal

- [ ] Completar identidad legal, CIF, domicilio y fecha de publicación.
- [ ] Identificar correctamente al prestador tecnológico.
- [ ] Crear los términos de servicio y corregir su enlace.
- [ ] Eliminar o corregir las referencias a Firebase.
- [ ] Ajustar la política a los tratamientos y proveedores reales.
- [ ] Someter el resultado a revisión jurídica antes de publicarlo como definitivo.

## Referencias normativas principales

- [Reglamento General de Protección de Datos — texto publicado en el BOE](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).
- [Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673).
