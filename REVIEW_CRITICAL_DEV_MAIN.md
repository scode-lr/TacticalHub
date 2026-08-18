# Revisión crítica `dev` → `main`

**Fecha:** 2026-08-10  
**Veredicto:** **NO-GO** por tres defectos críticos de código y por la ambigüedad del commit de release.

## Resumen ejecutivo

La comparación local (`main...dev`) contiene **428 archivos** y **23.442 altas / 6.331 bajas**, pero no representa el estado actual del remoto: `origin/main` ya contiene `dev` y ambos tienen el mismo árbol de archivos.

Los builds productivos de TacticalHub y Voltregà sobre `dev` (`7950caa`) finalizan correctamente. Aun así, la revisión funcional del diff confirma **tres regresiones críticas**. Los endpoints productivos configurados también responden correctamente en `/health`.

## Hallazgos críticos de código

### K1 — Las respuestas booleanas se muestran siempre como afirmativas

`src/app/components/submission-detail-view/submission-detail-view.component.html:36` fija `[ngModel]="true"` en vez de usar `value.valueBoolean`. En `main` se mostraba el valor real.

**Afectación:** una respuesta `false` aparece marcada como `true` durante la revisión administrativa. Puede provocar aprobaciones o rechazos incorrectos, especialmente en consentimientos y declaraciones.

**Gate:** restaurar el binding al valor recibido y probar explícitamente casos `true`, `false` y `null`.

### K2 — Aprobar o rechazar solicitudes de equipo no persiste nada

Las notificaciones ya se cargan desde la API (`notifications.service.ts:53-72`), pero `team-join-requests.component.ts:46-52` sigue llamando a `handleApproval()`, que solo modifica el signal local (`notifications.service.ts:182-205`) y no invoca ningún endpoint.

**Afectación:** la interfaz confirma visualmente la decisión, pero no cambia la afiliación ni el estado en backend; al recargar, la solicitud reaparece. El flujo de incorporación de miembros/coaches queda inoperativo.

**Gate:** conectar aprobar/rechazar con la operación real de backend y verificar persistencia tras recarga.

### K3 — Guardar una configuración de exportación corrompe el origen de columnas

`src/app/pages/forms-submissions/forms-submissions.page.ts:344` y `:567` reemplazan siempre `sourceKind` por `FormField`, ignorando el tipo original recibido (`System`, `PlayerProperty`, etc.). El propio flujo espera columnas de sistema como `SubmittedAt`.

**Afectación:** guardar la configuración —también al inicializar Google Sheets— puede convertir columnas de sistema en campos inexistentes. Los CSV/sincronizaciones pueden quedar incompletos o mapear datos erróneos silenciosamente.

**Gate:** conservar `column.sourceKind` y probar un perfil mixto con columnas de sistema y campos del formulario.

## Hallazgos críticos

### C1 — La referencia de release es ambigua

- `main` local: `154c089` (94 commits por detrás de `dev`).
- `dev`: `7950caa`.
- `origin/main`: `4a9505c`; contiene `dev` mediante tres merges y no presenta diferencias de contenido frente a `dev`.

**Afectación:** revisar o desplegar usando `main` local evalúa una base histórica; usar `origin/main` implica que los cambios ya están integrados. Se puede certificar o desplegar un commit distinto del revisado.

**Gate:** fijar un único SHA de producción y generar la validación desde ese SHA.

### C2 — No existe gate CI para `dev` ni `main`

El workflow de CI en `.github/workflows/ci.yml` solo se ejecuta para `deploy` y únicamente compila Voltregà. No ejecuta lint, tests ni el build productivo de TacticalHub. El workflow de publicación también se activa desde `deploy`, no desde `main`.

**Afectación:** el contenido ya integrado en `origin/main` puede llegar a producción sin una comprobación automática reproducible de compilación y regresiones.

**Gate mínimo sobre el SHA de release:** instalación limpia, build productivo de TacticalHub, build productivo de Voltregà, lint y tests críticos de autenticación/rutas.

### C3 — El entorno de desarrollo de TacticalHub apunta a un host no-dev

`projects/tactical.hub/environments/environment.ts` tiene `production: false`, pero usa `https://api-voltrega.tacticalhub.es`; Voltregà sí dispone de un host explícito `api-dev-voltrega` para desarrollo.

**Afectación:** una validación local de TacticalHub puede ejecutarse contra un entorno compartido o productivo y alterar datos reales, además de dar resultados de QA no reproducibles.

**Gate:** confirmar formalmente que ese host es de desarrollo; si no lo es, no usarlo para validar el release.

## Decisión recomendada

No desplegar hasta resolver **K1–K3**, fijar el SHA de release (**C1**) y ejecutar el gate de **C2**. **C3** debe quedar confirmado antes de cualquier smoke test local.
