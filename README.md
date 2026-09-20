# `design/` — Diseño de FashionStore

Todo lo que es material de diseño (no código de producción) vive aquí.

## Este repositorio

`fashionstore-design` es el cuarto repositorio del proyecto, hermano de los tres de código:

| Repositorio | Contenido |
| :-- | :-- |
| `fashionstore-backend` | API FastAPI + PostgreSQL |
| `fashionstore-mobile` | App Flutter |
| `fashionstore-web` | Cliente Angular 20 |
| **`fashionstore-design`** (este) | Sistema de diseño, tokens, logo, PNG del archivo Figma y prototipos navegables |

En el workspace local los cuatro viven en la misma carpeta:

```text
Fashionstore/
  fashionstore-backend/
  fashionstore-mobile/
  Fashionstore-web/
  design/            ← este repositorio
```

Si solo clonaste este repositorio, los documentos `DESIGN.md` y `figma-make/README.md` referencian
rutas de las apps (`Fashionstore-web/...`, `fashionstore-mobile/...`) para indicar **dónde se
implementó** cada elemento del diseño: clona el repo que necesites para verlo en código.

Publicación (una sola vez):

```bash
git remote add origin https://github.com/123dio404/fashionstore-design.git
git push -u origin main
```

```text
design/
  README.md          ← este archivo
  DESIGN.md          ← decisiones de diseño: precedencia, tokens, mapa pantalla → CU y backlog
  figma/             ← archivo Figma original: sistema de diseño, tokens, pantallas base y logo
    system/          ← design system, tokens, componentes, estados
    mobile/          ← pantalla mobile del archivo original
    web/             ← pantallas web del archivo original (admin, sucursales, POS, reportes)
    assets/          ← logo.svg exportado (nodo 5:21)
  figma-make/        ← PROTOTIPO NAVEGABLE, TITULAR DEL DISEÑO (React + Vite)
    README.md        ← mapa pantalla → ruta en la app → CU → estado
    src/             ← pantallas mobile
    src/web/         ← shell de escritorio (`WebLayout.tsx`) + 20 pantallas web
```

## Qué manda cada cosa

| Fuente | Autoridad |
| :-- | :-- |
| `Parcial1-SI2.md` | **qué** debe hacer el sistema: CU, RF y diccionario de datos |
| `figma-make/` — **titular del diseño** | **cómo se ve y qué muestra** cada pantalla |
| `figma/` (PNG del archivo original) | referencia histórica del archivo Figma y origen del logo |
| Backend | **contrato de datos**: si el diseño pide un dato que no existe, entra al backlog (`DESIGN.md`) |

## Reglas

1. `figma-make/` es un **prototipo de referencia**: usa datos ficticios (`src/data.ts`) y no consume la
   API. El código que funciona es:
   - Web: `Fashionstore-web/` (Angular 20).
   - Mobile: `fashionstore-mobile/` (Flutter).
2. Los PNG de `figma/` son **instantáneas** del archivo Figma original; si ese archivo cambia hay que
   re-exportar (procedimiento en `DESIGN.md`).
3. Ninguna aplicación importa archivos de `design/`: es material de consulta.

## Qué se implementó a partir de este material

| Elemento del diseño | Dónde se implementó |
| :-- | :-- |
| Tokens (color, radios, espaciado, tipografía) | `Fashionstore-web/src/styles.scss` y `fashionstore-mobile/lib/core/theme/app_theme.dart` |
| Logo y wordmark | `Fashionstore-web/public/img/brand/logo.svg`, `fashionstore-mobile/assets/images/logo.png` |
| Iconos de línea (paths de `WebLayout.tsx`) | `Fashionstore-web/src/app/core/navigation.ts` (`ICONS`) |
| Shell web (sidebar por rol + topbar) | `Fashionstore-web/src/app/app.{html,scss,ts}` |
| Estados (loading, empty, error, offline, sin servicio, 403, modal) | `Fashionstore-web/src/app/shared/ui/*` |
| Pantallas web del prototipo | Mapa en `figma-make/README.md` |
