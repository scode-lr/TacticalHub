# 1. El `package.json` raíz es la única fuente de dependencias

## Estado

Aceptado

## Contexto

El workspace es un monorepo Angular multi-proyecto (`app` / TacticalHub y `voltregacf.hub` / VoltregaCF) que comparte un único `node_modules` gestionado desde el `package.json` de la raíz. Cada subproyecto Capacitor (`projects/tactical.hub/`, `projects/voltregacf.hub/`) tiene además su propio `package.json`, requerido por el CLI de Capacitor para reconocer esa carpeta como un paquete npm válido al ejecutar `npx cap sync`.

En el commit `2ac2c33` ("Remove capacitor dependencies from sub-project package.json files") ya se estableció que estos `package.json` de subproyecto solo deben contener metadata mínima (`name`, `version`, `private`), y que las dependencias reales viven en la raíz. Posteriormente, en el commit `e94e636` se volvió a añadir `@capacitor/push-notifications` como dependencia declarada en ambos subproyectos. Como esos `package.json` no comparten el `node_modules` de la raíz, esa dependencia declarada quedaba sin resolver y rompía las builds.

## Decisión

Los `package.json` de `projects/tactical.hub/` y `projects/voltregacf.hub/` contienen únicamente `name`, `version` y `private`. No se añade ningún bloque `dependencies` ni `devDependencies` en ellos. Toda dependencia del proyecto (incluidas las de Capacitor) se declara exclusivamente en el `package.json` raíz.

## Consecuencias

- Una sola fuente de verdad para versiones de dependencias, evitando conflictos de versión entre raíz y subproyectos.
- Al añadir un nuevo plugin de Capacitor u otra librería, se instala solo en la raíz (`npm install` en `TacticalHub/`), nunca dentro de `projects/*/package.json`.
- Si una build falla por dependencias "no necesarias" en `projects/tactical.hub/package.json` o `projects/voltregacf.hub/package.json`, la corrección es eliminarlas de ahí, no sincronizarlas con la raíz.
