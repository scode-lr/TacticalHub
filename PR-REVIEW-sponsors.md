# PR Review — `feature/sponsors` → `dev`

**Rama:** `feature/sponsors`
**Base:** `origin/dev`
**Alcance del diff:** 269 archivos, +5476 / −3245
**Fecha de revisión:** 2026-06-05
**Veredicto:** ⛔ **No mergear todavía** — hay bloqueantes (ver 🔴).

---

## Resumen ejecutivo

| Severidad | Nº de hallazgos |
|-----------|-----------------|
| 🔴 Crítico / Bloqueante | 2 |
| 🟠 Alto | 3 |
| 🟡 Medio | 4 |
| 🟢 Bajo / Nit | 6 |

Bloqueantes reales: **#1** (artefactos de build en el PR) y **#2** (pérdida de datos al cancelar). **#3, #4 y #5** afectan funcionalidad central de sponsors/información.

---

## 🔴 Crítico / Bloqueante

### 1. Artefactos de build commiteados en la rama (165 archivos en `docs/`)
El grueso del diff no es código: son bundles compilados (`docs/chunk-*.js`, `main-*.js`, `*.css`) más dos commits `deploy` (`43fcef5`, `e4cda90`). Infla el PR, provoca conflictos de merge constantes y mezcla output de despliegue con el feature.

**Acción:** sacar `docs/` del PR, añadirlo a `.gitignore` y manejar el deploy en su rama (`gh-pages`). El PR debería quedar en ~100 archivos de `src/`.

### 2. `cancelAll()` borra las imágenes originales → pérdida de datos
`src/app/pages/settings-club/settings-sponsors/settings-sponsors.page.ts:262-271`

Al editar un sponsor, la URL antigua entra en `orphanedImageUrls` (`:174`). Pero `cancelAll()` llama a `deleteOrphanedImages()` (borra esas URLs del servidor) y luego `loadSponsors()` recarga los sponsors originales que **siguen apuntando a esas URLs ya borradas** → imágenes rotas tras cancelar.

**Acción:** cancelar no debe borrar nada del servidor; solo descartar estado local.

---

## 🟠 Alto

### 3. El reordenamiento de sponsors no funciona
`settings-sponsors.page.ts:241-252`

`moveUp/moveDown` → `swapLocal` solo hace `sponsors.set(...)`; **no** llama a `markPendingChanged()` ni añade nada a los `pending*`. Consecuencias:
- `canSave` sigue en `false` → botón Guardar deshabilitado si solo reordenas.
- En `saveAll`, solo `additions`/`updates` reciben `sortOrder` (`:110-115`); un sponsor existente reordenado-pero-no-editado nunca se envía.
- `SponsorService.reorder()` existe pero no se invoca desde ningún sitio.

### 4. Fuga de imágenes huérfanas en el servidor
`settings-sponsors.page.ts:128-155`

Las imágenes ya subidas (`uploadImage`) que luego se cancelan/sustituyen **no** se añaden a `orphanedImageUrls`, así que quedan colgando en storage. El tracking solo cubre el caso de edición, no el de añadir-y-cancelar.

### 5. `saveAll` navega hacia atrás incluso si falla
`settings-club/settings-information/settings-information.page.ts:336-345`

El `finally` ejecuta `navigationService.goBack()` siempre, también en el `catch`. El usuario ve el toast de error pero ya fue sacado de la página.

**Acción:** mover `goBack()` al bloque de éxito (como sí hace `settings-sponsors.saveAll`, `:306`).

---

## 🟡 Medio

### 6. Claves i18n de toast incorrectas (texto crudo al usuario)
`settings-sponsors.page.ts:87`, `:149`, `:184`

Se usa `'sponsors.error.load'` e `'sponsors.error.imageUpload'`, pero las claves reales están bajo `admin.settings.sponsors.error.*` (`projects/shared/i18n/en.ts:353-362`). `instant()` devuelve la clave literal si no la encuentra (`translation.service.ts:128`), así que el toast mostrará `sponsors.error.load`. `saveAll` sí usa la ruta completa — incoherente.

### 7. Una subida de imagen fallida envía una `blob:` URL al backend
`settings-sponsors.page.ts:140-151`

Si `uploadImage` lanza, el `catch` solo muestra el toast; el sponsor se queda con `imageUrl = blob:...` y `saveAll` lo manda en el batch.

### 8. `onEditSave`: si falla el upload, se borra una imagen aún en uso
`settings-sponsors.page.ts:172-186`

`existingImageUrl` se añade a `orphanedImageUrls` *antes* de subir la nueva. Si el upload falla, `imageUrl` revierte a `existingImageUrl`, pero esa URL ya quedó marcada para borrado → en el próximo save se elimina una imagen todavía referenciada.

### 9. `normalizeSponsor` descarta `additionalInfo` si viene como array
`src/app/core/services/sponsor.service.ts:99-107`

El modelo declara `additionalInfo: AdditionalInfo[]` (`sponsor.model.ts:33`), pero `normalizeSponsor` solo rellena cuando el backend devuelve un **objeto/diccionario**; si devuelve un array lo deja en `[]`. Confirmar el contrato del backend (se envía indexado como `AdditionalInfo[i].Key`).

---

## 🟢 Bajo / Nits

1. **partners** ordena solo por `tier` e ignora `sortOrder` como criterio secundario (`partners.page.ts`, `data.sort((a,b)=>b.tier-a.tier)`).
2. `tierLabel`/`tierClass` son `switch` sin `default` → `undefined` si llega un tier inesperado.
3. `URL.revokeObjectURL` duplicado en `deleteSponsor` (`:219-220` y `:229-231`).
4. `admin.page.ts` contempla `/settings-club/information` para back-button/`isDetailPage` pero **no** `/settings-club/sponsors`.
5. `canSave` en information siempre es `!isSaving()` (sin dirty-check), a diferencia de sponsors (`settings-information.page.ts:82`).
6. **`environment.ts` sin commitear** apunta a `https://api.tacticalhub.lol` (era `localhost:5197`) — confirmar que es intencional y que no se cuela en el commit.

---

## ✅ Correcto (verificado)

- El rename i18n `member.*` → `user.*` (file-validation, news, member.page) **es coherente** con el árbol de traducciones, que ahora usa el namespace `user` (`projects/shared/i18n/en.ts:619`). No es un bug.
- Eliminación de rutas `forms` duplicadas en `member.routes` y de las páginas `admin-forms-*`: sin referencias colgantes.
- Limpieza de `console.log` en `translation.service.instant()`.

---

## Checklist antes de mergear

- [ ] Quitar `docs/` del PR y del control de versiones (#1)
- [ ] `cancelAll()` no debe borrar imágenes del servidor (#2)
- [ ] Implementar persistencia real del reorden (#3)
- [ ] Trackear/limpiar imágenes huérfanas en add-y-cancelar (#4)
- [ ] `goBack()` solo en éxito en `settings-information.saveAll` (#5)
- [ ] Corregir claves i18n de toast (#6)
- [ ] Manejar fallo de upload sin enviar `blob:` URL (#7, #8)
- [ ] Confirmar contrato `additionalInfo` con backend (#9)
- [ ] Confirmar `environment.ts` apunta a la URL correcta
