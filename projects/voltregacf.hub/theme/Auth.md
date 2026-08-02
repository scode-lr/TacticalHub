# Voltrega CF Hub — Auth redesign · Design notes

Contexto y decisiones de estilo del rediseño de las pantallas de **Welcome / Sign in / Sign up**.
Archivo fuente: `Voltrega Auth.dc.html` · Export offline: `Voltrega Auth Standalone.html`

---

## 1. Base

- **Sistema de diseño:** Organic (`_ds/organic-413eb886-b25e-4342-96d1-21f5ca7c81d2/`) — se carga `styles.css` + `_ds_bundle.js` en el `<helmet>`.
- **App de origen:** Ionic/Angular monorepo `TacticalHub`, variante **VoltregaCF** (`projects/voltregacf.hub`).
- **Formato:** Design Component (`.dc.html`) en modo canvas. Se muestran 3 pantallas en **frame de móvil** (`ios-frame.jsx`) y 3 en **frame de escritorio** (chrome de ventana propio).
- **Escudo:** `assets/voltrega-logo.svg` (copiado de `projects/voltregacf.hub/assets/icon/logo.svg`).

---

## 2. Paleta

Fusión: forma y fondo de **Organic** + colores de marca **Voltrega** (`theme/variables.scss`).

| Rol | Valor | Uso |
|-----|-------|-----|
| Fondo (blanco roto) | `#f7f5f1` | ground — override de `--color-bg` |
| Superficie | `#edeae3` | fills de inputs, barra de título |
| Texto | `#201e1d` (token Organic) | tipografía principal |
| Amarillo Voltrega | `#ffd700` | botón primario (relleno) |
| Amarillo hover / active | `#f2ca00` / `#dcb600` | estados del botón primario |
| Dorado (texto acento) | `#b8860b` | "Hub", acentos; legible sobre claro |
| Dorado oscuro (texto pequeño) | `#8a6a06` / `#7a5a06` | links, kickers |
| Negro marca | `#1a1a1a` | texto sobre amarillo |
| Panel desktop (claro) | `linear-gradient(160deg,#faf6ec,#f1e6c9)` | lado de marca (escudo se lee entero) |
| Rojo escudo | `#d81f2a` | solo dentro del logo |

> Nota: se dejó el fondo en **blanco roto** (no crema) y el panel de marca en **claro** — el escudo tiene mucho negro y sobre fondo oscuro se perdía.

Colores de marca originales (`variables.scss` VoltregaCF): primary `#ffd700`, contrast `#1a1a1a`, shade `#b8860b`, secondary/dark `#1a1a1a`.

---

## 3. Tipografía

- Override de `--font-heading` a **Figtree 700** (más legible/profesional que el display Caprasimo por defecto de Organic).
- Body: **Figtree** (`--font-body`, ya en Organic).
- Ambas cargan desde `styles.css` (Google Fonts).

---

## 4. Overrides sobre Organic (bloque `<style>` en `<helmet>`, scope `.volt`)

```css
.volt { --color-accent:#b8860b; --color-accent-600:#9a7108; --color-accent-700:#7a5a06; }
.volt { --font-heading:"Figtree",system-ui,sans-serif; --font-heading-weight:700;
        --color-bg:#f7f5f1; --color-surface:#edeae3; }
.volt .btn-primary { background:#ffd700; color:#1a1a1a; }
.volt .btn-primary:hover { background:#f2ca00; }
.volt .btn-primary:active { background:#dcb600; }
.volt .btn-block { margin-top:0; }        /* el gap controla el espaciado */
.volt a { color:#8a6a06; text-decoration:none; }
.volt a:hover { color:#5f4a04; text-decoration:underline; }
```

El acento se desacopla: **dorado** para texto/links/focus (legible sobre claro) y **amarillo puro** solo para el relleno del botón primario.

---

## 5. Componentes del DS usados

Clases de `styles.css` (no reinventadas):

- `.btn` + `.btn-primary` (amarillo) / `.btn-secondary` (outline) / `.btn-icon` / `.btn-block`
- `.field` + `label` + `.input` (pills, `border-radius:999px`)
- Tokens: `var(--color-*)`, `var(--color-divider)`, `var(--font-heading/body)`

Iconos: **Lucide** inline (`stroke-width:2.75`) — `user-plus`, `log-in`, `arrow-left`. Marca: SVG de **Google** (4 colores) y **Apple**.

---

## 6. Estructura de pantallas

**Welcome**
- Escudo grande centrado (~218px) sobre el fondo, **sin caja** (se probó box oscura y halo; descartados).
- Título "Voltrega CF **Hub**" + tagline "Grow together."
- Botones: Create account (primario) / Sign in (secundario).
- Pie: "Powered by **Tactical**".

**Sign in**
- Back (btn-icon), título, Email + Password, "Forgot password?", botón Sign in.
- Divisor "or" + Continue with Google / Apple.
- Footer: "Don't have an account? Sign up".

**Sign up**
- Back, título, First/Last name (fila), Email, Date of birth (DD/MM/YYYY), Password, Confirm password.
- Botón Create account + texto de Términos/Privacidad.
- Divisor + Google/Apple. Footer: "Already have an account? Sign in".

**Desktop (los 3):** split — panel de marca claro a la izquierda (escudo + nombre + tagline) y formulario a la derecha, dentro de un chrome de ventana (semáforo + url `voltregacf.hub/...`).

Campos conservados según pedido: nombre, apellido, email, fecha de nacimiento, password, confirm password. Social: Google + Apple.

---

## 7. Frames / assets

- `ios-frame.jsx` — bezel de iPhone (status bar, dynamic island, home indicator). Montado con `<x-import component-from-global-scope="IOSDevice">`, `width="380px" height="800px"`.
- Chrome de escritorio: hecho a mano (barra 42px con semáforo + título) — el `MacWindow` del starter forzaba sidebar, no encajaba en un split de auth.
- `assets/voltrega-logo.svg` — escudo del club.

---

## 8. Export offline

`super_inline_html` empaqueta todo en `Voltrega Auth Standalone.html` (~1.1 MB), con `<template id="__bundler_thumbnail">` (splash con escudo simplificado sobre `#f7f5f1`).
