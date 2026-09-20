# `design/figma-make/` — Prototipo navegable (titular del diseño)

Proyecto **React 19 + Vite + TypeScript** exportado desde Figma Make. Es el **diseño titular**:
define cómo se ve y qué muestra cada pantalla. Usa datos ficticios (`src/data.ts`) y **no** consume
la API de FashionStore.

```text
figma-make/
  src/          ← pantallas mobile (Splash, Home, Catálogo, Carrito, CU17 AR, CU18 IA, CU19, Voz…)
  src/web/      ← shell de escritorio: WebApp.tsx, WebLayout.tsx y screens/*.tsx (20 pantallas)
  src/ui.tsx    ← tokens `C`, tipografías `T`, iconos de línea y componentes de estado
  src/index.css ← `DM Serif Display` + `Inter`, `.font-display`, `.skeleton`
  src/imports/  ← recursos que Figma Make generó para el proyecto
```

El **mapa pantalla → ruta en la app → CU → estado** está más abajo, en este mismo README.

## Cómo ejecutar el prototipo

```bash
cd design/figma-make
pnpm install                  # npm install también sirve
pnpm dev                      # Vite en http://localhost:5173
```

`AGENTS.md` y `CLAUDE.md` son los archivos que Figma Make genera para sus agentes; no afectan
a las aplicaciones del monorepo.

## Mapa: pantalla del prototipo web → app Angular (`Fashionstore-web`)

| Pantalla Figma (`src/web/screens/`) | Ruta en la app | CU | Estado |
| :-- | :-- | :-- | :-- |
| `LoginPage` | `/auth/login` | CU02 | ✅ alineada al diseño (panel de marca + formulario) |
| — | `/auth/register` | CU01 | ✅ funcional (no está en el prototipo web) |
| `CatalogPage` | `/catalog` (+ `?q=`) | CU08 | ✅ alineada al diseño (filtros + grid) |
| `ProductDetailPage` | `/catalog/:id` | CU08/CU10 | ✅ alineada al diseño (galería + panel de compra) |
| `CartPage` | `/cart` | CU10 | ✅ funcional |
| `CheckoutPage` | `/cart` (bloque de pago) | CU11 | ✅ funcional (Stripe vía backend) |
| `PurchasesPage` | `/purchase-history` | CU16 | ✅ funcional |
| `ReservationsPage` | `/my-reservations` | CU15 | ✅ funcional |
| `AIRecsPage` | `/recommendations` | CU18 | ✅ funcional (pesos y motivos del documento) |
| `ChatbotPage` | `/chatbot` | CU19 | ✅ funcional |
| `PromotionsPage` | `/promotions` | CU20 | ✅ implementada en esta iteración |
| `DashboardPage` | `/reports/dashboard` | CU23 | ✅ funcional (KPI + tablas) |
| `UsersPage` | `/admin/users` | CU03 | ✅ funcional |
| `CatalogAdminPage` | `/admin/products` | CU05 | ✅ funcional |
| `InventoryPage` | `/admin/inventory` | CU09 | ✅ funcional |
| `ReportsPage` | `/reports/sales`, `/reports/inventory`, `/reports/analytical` | CU21/CU22/CU24 | ✅ funcional |
| `POSPage` | `/pos` | CU12 | ✅ funcional |
| `BranchesPage` | `/admin/branches` | CU04 | ✅ funcional |
| `SuppliersPage` | `/admin/suppliers` | CU07 | ✅ funcional |
| `ParametersPage` | `/admin/parameters` | CU06 | ✅ funcional |
| `PromotionsAdminPage` | `/admin/marketing` | CU20 | ✅ funcional |
| — | `/reservations` | CU14 | ✅ funcional (el prototipo lo lista en el menú POS pero no lo dibuja) |
| — | `/profile` | CU02 | ✅ funcional |

## Diferencias conocidas entre el prototipo y la app

1. **Paleta**: el prototipo usa el acento terracota `#E05A47`; las dos aplicaciones reales
   (Angular y Flutter) usan el color de marca del archivo Figma, `#8C3858`. El shell web
   implementa la *estructura* del prototipo con los tokens de marca para no romper el design
   system compartido (`design/DESIGN.md`).
2. **Datos ficticios**: el prototipo muestra imágenes de Unsplash, ratings, favoritos y `oldPrice`.
   El backend no expone `image_url` ni favoritos, así que la app usa placeholders y descuentos
   calculados a partir de las promociones reales (`GET /promotions`).
3. **"Vista móvil"** en la barra lateral del prototipo es un recurso de demostración de Figma;
   en la app no existe (el móvil es la app Flutter).
4. El prototipo lista `reservations-admin` en el menú del rol POS pero no define su pantalla;
   en la app esa vista es `/reservations` (CU14).
