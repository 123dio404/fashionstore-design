# FashionStore — Referencias de diseño (Figma)

Fuente única de verdad del diseño: **[FashionStore en Figma](https://www.figma.com/proto/kF4LTpwPIlg13ZIPyWGdBy/FashionStore?node-id=2-4)**

- `file_key`: `kF4LTpwPIlg13ZIPyWGdBy`
- `lastModified`: 2026-09-19
- PNG exportados por API el 2026-09-19 (scale 1).

> Los PNG de `figma/` son **instantáneas de referencia** para leerlos sin conexión. Si el diseño cambia en Figma, hay que re-exportar.

## Estructura del archivo Figma

| Página Figma | node-id | PNG en este repo |
| :-- | :-- | :-- |
| 1. Cover | `0:1` | — |
| 2. Design System | `2:4` | `figma/system/02-design-system-sample.png` |
| 3. Tokens y variables | `5:15` | `figma/system/03-tokens-variables.png` |
| 4. Componentes reutilizables | `5:47` | `figma/system/04-componentes.png` |
| 5. Mobile - Cliente | `5:69` | `figma/mobile/05-mobile-cliente.png` |
| 6. Web - Administración | `5:453` | `figma/web/06-web-admin.png` |
| 7. Web - Sucursales | `5:485` | `figma/web/07-web-sucursales.png` |
| 8. Web - POS | `5:500` | `figma/web/08-web-pos.png` |
| 9. Web - Reportes | `5:515` | `figma/web/09-web-reportes.png` |
| 10. Estados, modales y mensajes | `5:543` | `figma/system/10-estados-modales.png` |
| 11. Prototipos navegables | `5:574` | — (prototipo interactivo) |
| 12. Assets exportables | `5:599` | `figma/system/12-assets-exportables.png` |

## Mapa pantalla → caso de uso

### Mobile (página 5) — 20 pantallas en 4 filas

| Pantalla | CU / ámbito | Estado mostrado | Estado en la app |
| :-- | :-- | :-- | :-- |
| Splash | CU01 · carga | `loading` | ❌ no existe |
| Onboarding | CU01 | `success` | ❌ no existe |
| Registro | CU01 | `error` | ✅ `RegisterPage` |
| Login | CU02 | `session` | ✅ `LoginPage` |
| Home | CU08 | `promo` | ⚠️ el catálogo hace de home |
| Catálogo | CU08 | `filtros` | ✅ `CatalogPage` |
| Producto | CU05 | `agregado` | ✅ `ProductDetailPage` |
| Carrito | CU10 | `error` | ✅ `CartPage` |
| Checkout | CU11 | `Stripe / processing` | ✅ en `CartPage` |
| Perfil | CU02 | `compras · reservas` | ✅ `ProfilePage` |
| Reservas | CU15 | `pendiente` | ✅ `MyReservationsPage` |
| Compras | CU16 | `pagado` | ✅ `PurchaseHistoryPage` |
| AR | CU17 | `cámara` | ✅ `VirtualFittingScreen` |
| Recomend. | CU18 | `IA` | ⚠️ `RecommendationsPage` (parcial) |
| Chatbot | CU19 | `IA` | ⚠️ `ChatbotPage` (parcial) |
| Voz | CU24 | `mic` | ❌ no existe |
| Preferencias | Perfil | `success` | ❌ no existe |
| Offline | Estados | `offline` | ❌ no existe |
| Support | Estados | `info` | ❌ no existe |
| Settings | Config | `neutral` | ❌ no existe |

Navegación inferior definida: **Inicio · Catálogo · Reservas · Carrito · Perfil**.

### Web (páginas 6–9)

| Módulo | Contenido del diseño | Cobertura actual |
| :-- | :-- | :-- |
| Administración | KPIs (Ventas hoy $24.5K +12%, Pedidos 178 +8%, Stock bajo 14, Reservas 32) · Sidebar (dashboard, usuarios, ciudades, sucursales, catálogo…) · Usuarios y permisos · Acceso denegado | ⚠️ dashboard y usuarios existen; falta el shell con sidebar y la página de acceso denegado estilizada |
| Sucursales | Sucursales y ciudades · Reservas en tienda (pendientes, del día, preparar, asignar probador, marcar atendida) · Inventario y transferencias | ✅ `BranchesPage`, `ReservationsPage`, `InventoryPage` |
| POS | Login cajero (**seleccionar sucursal, abrir/cerrar caja**) · Caja principal (**buscar, escanear código de barras**, talla/color, agregar, editar) · Pago y comprobante (**efectivo/tarjeta/datáfono**, estados de pago, **recibo imprimible**) | ⚠️ `PosPage` existe sin caja/escaneo/métodos de pago/recibo |
| Reportes | KPIs (Ventas totales $128K, Ticket $45, Reservas 42, Stock bajo 15) · Ventas por fecha/sucursal/canal (**exportable CSV y PDF**) · Inventario (rotación, agotados, valor, historial) · Analítica IA (**escrita, voz, transcripción**) | ⚠️ reportes existen sin exportables |

## Design system

**Componentes (página 4):**
- **Button**: primary / secondary / disabled / brand tones.
- **Input**: default / focus / error / success / disabled.
- **Badge + Cards**: status chips, stat cards, product cards, table rows.

**Estados (página 10):**
- Loading (skeletons y spinners) · Empty (sin resultados) · Error (validación, red o servicio) · Success · Offline (reintento sin conexión)
- **Modal de confirmación** (cancelar reserva, eliminar producto, cerrar sesión)
- Access denied (permisos por rol) · Service not configured (falta integración de IA, voz o pasarela)

**Tokens (página 3):** «Colección local con colores, spacing y radius».
> ⚠️ **Pendiente**: los valores viven en **Figma Variables** (no están publicados como styles). Para extraerlos por API el PAT necesita el scope **`file_variables:read`**; sin él solo se ve el título del frame.

## Assets a exportar (página 12)

- **Logo**: monograma + wordmark (header, splash, marca).
- **Iconos**: search, cart, user, spark, voice, scan, arrow.
- **Formatos de handoff**: SVG, PNG, PDF, CSV.
- **Convención de nombres**: por plataforma → `mobile`, `web/admin`, `web/pos`, `web/reports`.
- **Measures**: spacing, radius y tamaños documentados desde Dev Mode.

## Brechas detectadas (para planificar)

**Web**
1. Shell de administración con **sidebar** (el diseño lo pide explícitamente).
2. **POS completo**: abrir/cerrar caja, escaneo de código de barras, métodos de pago (efectivo/tarjeta/datáfono), recibo imprimible.
3. **Exportables** CSV/PDF en reportes.
4. Componentes de estado: **skeleton**, **offline**, **modal de confirmación**, **Service not configured**.

**Mobile**
1. Pantallas nuevas: **Splash**, **Onboarding**, **Home con promociones**, **Voz (CU24)**, **Preferencias**, **Offline**, **Support**, **Settings**.
2. Navegación inferior con 5 pestañas (Inicio · Catálogo · Reservas · Carrito · Perfil).

**Transversal**
3. ~~Alinear los tokens~~ ✅ Hecho: la paleta se extrajo de los PNG y ya está aplicada en `styles.scss` y en `AppTheme` de Flutter (ver abajo).

## Paleta implementada (extraída de los PNG)

> El PAT no tenía el scope `file_variables:read`, así que los valores se obtuvieron muestreando los PNG exportados (`figma/system/*`). Ajustar si la colección de Figma Variables difiere.

| Token | Valor | Uso |
| :-- | :-- | :-- |
| `--brand` | `#8C3858` | Color de marca — **valor exacto del SVG del logo** |
| `--brand-dark` | `#6E2C45` | Hover / énfasis |
| `--brand-soft` | `#F7F2F7` | Fondos con tinte de marca |
| `--success` | `#219E69` (`--success-soft` `#ACDBC7`) | KPIs y estados positivos |
| `--danger` | `#D94C52` (`--danger-soft` `#ECA6A9`) | Errores y alertas |
| `--warning` | `#B45309` (`--warning-soft` `#FDE68A`) | Advertencias (provisional) |
| `--info` | `#3B5BDB` (`--info-soft` `#DCE3FB`) | Información (provisional) |
| Fondos | `#FAF7F5` · `#FFFFFF` · `#EDEEF0` | bg · surface · surface-2 |
| Bordes | `#E3E6EB` | border |
| Texto | `#1F1F24` · `#707582` · `#A6A9B1` | text · muted · muted-2 |
| Radios | `6 / 10 / 14 / 999` | sm · md · lg · pill |
| Espaciado | `4 / 8 / 12 / 16 / 24 / 32` | xs … xxl |
| Tipografía | `32 / 20 / 14 / 12` | Display · H2 · Body · Label |

### Dónde está implementado

- **Web** (`Fashionstore-web`): tokens en `src/styles.scss` (`:root`) + clases de Button, Input, Badge, Card, Table, Skeleton, Spinner, Modal y estados; componentes en `src/app/shared/ui/`:
  `app-ui-button`, `app-ui-spinner`, `app-ui-skeleton`, `app-ui-empty`, `app-ui-error`, `app-ui-offline`, `app-ui-service-unavailable`, `app-ui-confirm` (+ `ConfirmService`), `app-ui-access-denied`.
- **Móvil** (`fashionstore-mobile`): tokens y tema en `lib/core/theme/app_theme.dart`; widgets en `lib/shared/widgets/`:
  `AppButton`, `AppBadge`, `AppCard`, `AppStatCard`, `AppProductCard`, `AppCardHeader`, `AppTextField`, `AppSkeleton`, `AppLoadingRow`, `AppEmptyState`, `AppErrorState`, `AppOfflineState`, `AppServiceUnavailable`, `AppBanner`, `showAppConfirmDialog`.

## Assets reales

| Asset | Origen | Destino |
| :-- | :-- | :-- |
| `logo.svg` (24 KB, autocontenido) | nodo Figma `5:21` (badge + monograma + wordmark, texto vectorizado) | `Fashionstore-web/public/img/brand/logo.svg` · `design/figma/assets/logo.svg` |
| `logo.png` (@3x) | mismo nodo | `fashionstore-mobile/assets/images/logo.png` (declarado en `pubspec.yaml`) |

**Lo que todavía NO existe en Figma:**
- **Iconos** (search, cart, user, spark, voice, scan, arrow): la página «Assets exportables» solo lista sus nombres; no hay vectores. En web los componentes de estado usan **emoji** y en Flutter **Material Icons** como marcador.
- **Imágenes/fotos**: el archivo tiene **0 image fills** (y el backend no tiene campo `image_url` en productos).
- **Componentes de Figma**: **0 publicados**; las secciones «Componentes» son ilustraciones, no componentes reales.

> ⚠️ El logo muestra el monograma **«R»** mientras la marca es *FashionStore* — parece heredado de una plantilla. Confirmar si debería ser «F», «FS» u otro.

## CU18 — Dónde manda el documento y dónde manda el diseño

**Regla de decisión (2026-09-19 → actualizada el 2026-09-20):** el *documento*
(`Parcial1-SI2.md`) define **qué** (CU, RF y diccionario de datos); el *prototipo de Figma
(titular del diseño)* define **cómo se ve y qué muestra cada pantalla**; el *backend* define **el
contrato de datos**.

Con la actualización del 2026-09-20 **el diseño de Figma pasa a ser titular**: si una pantalla del
prototipo muestra un dato que el backend todavía no expone, ese dato entra al **backlog del backend**
(ver «Lo que el diseño exige y el backend aún no tiene») en lugar de recortar el diseño. La única
excepción son los datos que el documento prohíbe o no contempla.

> Histórico: la regla anterior (2026-09-19) priorizaba el backend sobre Figma; por eso los puntos de
> CU18 de las dos secciones siguientes dicen «se cambia Figma». Ya están aplicados y se conservan
> como registro de la decisión.

### Regla de UI limpia (aplicada el 2026-09-20)

La interfaz **solo muestra lo que el prototipo muestra**. Queda prohibido en pantalla:

- Códigos de caso de uso (`CU01`…`CU24`) en títulos, subtítulos, insignias del sidebar o breadcrumb.
- Notas internas de implementación: «el backend…», «la API…», «endpoint…», «backlog…», «todavía no
  existe…», nombres de variables de entorno (`AI_PROVIDER_MODE`), proveedores concretos de IA
  (`Google Speech`), etc.
- Módulos ajenos al sistema: **Finanzas** (cuotas/multas) y **Operaciones** (instalaciones,
  mantenimiento, uso de espacios) no aparecen ni en el documento (`Parcial1-SI2.md`, 9 módulos) ni en
  Figma → **eliminados de la web** (rutas, sidebar, páginas, servicios y modelos). El backend todavía
  conserva `app/api/v1/finance.py` y `app/api/v1/operations.py` (pendiente de limpieza).

La trazabilidad al documento se mantiene **en el código** (comentario de clase de cada página y campo
`cu` de `core/navigation.ts`), nunca en la interfaz.

### Auditoría del front heredado (2026-09-20)

Se revisó archivo por archivo de `Fashionstore-web` contra el prototipo y contra el documento, y se
eliminó todo lo que no venía de ninguno de los dos:

| Qué | Detalle |
| :-- | :-- |
| Módulos fuera de alcance | `pages/admin/finance.page.ts` y `operations.page.ts`, sus servicios (`finance`, `operations`), sus modelos y sus entradas de sidebar y de rutas |
| Componentes UI huérfanos | `shared/ui/button\|spinner\|offline-state\|service-unavailable.component.ts` (0 usos) |
| Artefacto de API | `openapi.json` en la raíz del repo (283 kB, sin referencias) |
| CSS duplicado o heredado | definiciones viejas de `.btn*`, `.badge.ok/.warn`, `.page-head`, `.page-title` (ya pisadas por el kit de Figma) y utilidades sin uso: `.eyebrow`, `.page-lead`, `.card-head`, `.stat-card`, `.text-display/h2/body/label`, `.toolbar`, `.error`, `.success`, `.alert-info`, `.badge-success/warning/danger/info/neutral`, `.state-offline/service/success`, `.spinner`, `.loading-row`, `.grid` |

`styles.scss` pasó de **166 a 83 clases** y de **1234 a 1052 líneas**, con los valores alineados a los
tokens (`--radius-lg`, `--radius-pill`, `--space-*`). Se conservan cinco primitivas del design system
de Figma (página 4) que hoy ninguna pantalla usa — `btn-secondary`, `btn-brand`, `btn-lg`,
`field-error-text`, `field-success-text` — porque son el vocabulario del kit.

### Login alineado al prototipo web v8 (2026-09-20)

El prototipo web (Figma Make, *Version 8*) es una pantalla a sangre, sin barra pública, con:

- **Panel de marca** (55 %): foto al 35 % sobre `#111827`, logo + wordmark, titular «Moda que inspira,
  plataforma que impulsa.», claim del sistema y tres cifras.
- **Formulario** (45 %): «Bienvenida de nuevo», selector **Acceso como** (Cliente · Administrador ·
  Punto de Venta, cada uno con su color), correo, contraseña con enlace
  **«¿Olvidaste tu contraseña?»**, botón oscuro `#111827` y pie «© 2026 FashionStore · Versión 3.2.1».

Implementado en `Fashionstore-web` con la foto en `public/img/auth/hero.jpg` (descargada del mismo
Unsplash del prototipo, para no depender de una URL externa en producción). En `/auth/*` se oculta la
barra pública y el contenedor va a sangre (`app.isAuthRoute` + `.container.bleed`).

El selector de portal se validó contra el backend: si el rol de la cuenta no corresponde al portal
elegido, se cierra la sesión y se indica cuál corresponde. El enlace de contraseña abre un aviso
(la recuperación real es backlog: `auth.py` solo expone `/register` y `/login`).

**Desviaciones deliberadas respecto al prototipo** (todas por datos reales o navegabilidad):

| Prototipo | App | Motivo |
| :-- | :-- | :-- |
| `24K+ Productos` · `98% Satisfacción` · `3 Sucursales` | Productos · Sucursales · Marcas (cifras reales del catálogo) | No se inventan métricas: la satisfacción requiere reseñas, que están en el backlog |
| Cuadro de color con icono de etiqueta | Logo real (`logo.svg`) | El logo es el asset de la página 12 de Figma |
| Botón «Vista móvil» en el panel de marca | — | Es un control del propio editor de Figma Make, no del producto |
| Acento `#E05A47` (token `accent` de `ui.tsx`) | `--brand` `#8C3858` | El brand sale del SVG del logo; pendiente confirmar cuál manda en la colección de variables |
| Sin enlace a registro | «¿No tienes cuenta? Crear una cuenta» | Sin él, `/auth/register` solo se alcanzaría por URL |

### Cambios hechos en el backend (para cumplir el documento)

| Punto | Documento | Antes | Ahora |
| :-- | :-- | :-- | :-- |
| Base de la sugerencia | "historial del cliente, **temporada** y disponibilidad" (`Parcial1-SI2.md:650`) | historial + disponibilidad | + **temporada activa** (`fecha_inicio ≤ hoy ≤ fecha_fin`) |
| RF25 "preferencias" | RF25 (`:324`) | `colores_preferidos` y `tallas_preferidas` se guardaban y **no se usaban** | **color +10** y **talla +10** (variantes con stock) |
| `recomendacion.tipo` | "categoría o tipo de recomendación estilística" (`:2447`) | `"personalizada"` fijo | `estilo` / `historial` / `temporada` / `disponibilidad` |
| `recomendacion.estado` | Visto / Pendiente / Descartado (`:2449`) | `"activa"` fijo, sin API | nace **`pendiente`** + `GET /recommendations` + `PATCH /recommendations/{id}` |
| `detalle_recomendacion` | `puntuacion` numeric(5,2), `motivo` varchar(255) (`:2459`) | numeric(6,2), `text` | migración `20260919_cu18_dictionary` |
| Payload del detalle | — (mejora de API) | sólo `product_id` | + `product{name,brand,price,category_id,season_id}` y `available_stock` |

### Pesos del recomendador (total 100)

| Señal | Puntos | Motivo expuesto |
| :-- | --: | :-- |
| Categoría favorita | 25 | `categoría preferida` |
| Marca favorita | 20 | `marca preferida` |
| Historial de compras | 20 | `historial de compras` |
| Talla preferida con stock | 10 | `talla preferida` |
| Color preferido con stock | 10 | `color preferido` |
| Temporada activa | 5 | `temporada` |
| Disponibilidad | 10 | `disponibilidad` (sólo si no hay otro motivo) |

Filtros duros: se descartan los productos **agotados** y los que quedan **fuera del presupuesto**.
Sin preferencias guardadas la sugerencia sigue naciendo del historial, la temporada y el stock
(verificado: Blazer = historial 3 + temporada 5 + disponibilidad 5 = 13).

### Cambios que le tocaron a Figma (no al backend) — histórico, regla anterior

1. **Marca única** (el backend guarda `marca_preferida` como un solo `string`) — ya aplicado.
2. **Colores**: ya no necesitan el badge "Próximamente"; el motor los usa. Se pueden **activar**.
3. **Chip "Disponible ahora"**: al ser verdadero para el 100 % de los resultados es ruido;
   reemplazar por el dato real (`available_stock`, p. ej. "5 disponibles") o por "Últimas unidades".
4. **Estado del bloque**: agregar acciones "Marcar como visto" y "Descartar", y el historial de
   bloques con badges `Pendiente / Visto / Descartado` (nuevos endpoints ya disponibles).
5. **Fotos de producto**: el backend no tiene `image_url`; usar placeholder (inicial de marca).
6. Fuera de alcance por ahora: `recomendacion_talla` y `perfil_corporal` existen en el documento y en
   `db/init.sql` pero **no tienen modelo ni API** — requieren una fase 2 (ver CU17).

Prueba funcional del motor: `tests` aún no existe en el backend; la verificación se ejecutó con un
script sobre SQLite en memoria (20 comprobaciones, todas OK) cubriendo pesos, exclusiones, motivos,
tipo, estados e historial.


---

## Prototipos de Figma Make (titular del diseño de pantallas)

El prototipo navegable vive en `design/figma-make/` (un solo proyecto React + Vite): las pantallas
mobile están en `src/*.tsx` y las de escritorio en `src/web/` (`WebApp.tsx`, `WebLayout.tsx` y
`screens/*.tsx`). El mapa completo **pantalla → ruta en la app → CU → estado** está en
`design/figma-make/README.md`.

## Lo que el diseño exige y el backend aún no tiene (backlog)

Desde que el prototipo de Figma es titular, cada dato que dibuja se convierte en trabajo del backend
en vez de en un recorte del diseño. Estado al 2026-09-20:

| Dato que muestra el diseño | Dónde aparece | Situación | Acción propuesta |
| :-- | :-- | :-- | :-- |
| `image_url` por producto | tarjetas de catálogo, detalle, carrito, promociones | ❌ no existe el campo | migración + columna + carga de imágenes |
| `old_price` / `discount` | badge `-%` y precio tachado | ⚠️ no es un campo; hoy se **calcula** con las promociones activas (`/promotions`) | mantener el cálculo o agregar campos al producto |
| `rating` y nº de reseñas | estrellas en la tarjeta de producto | ❌ no hay modelo de reseñas | tabla `resena` + endpoints (fase 2) |
| Favoritos (corazón) | tarjeta y detalle de producto | ❌ no hay modelo | tabla `favorito` + endpoints |
| Imagen, color y código de cupón | banner hero y chip `CÓDIGO: X` de promociones | ❌ no hay campos | + `imagen_url`, `codigo`, `banner_color` en promoción/colección |
| Respuestas del chatbot con datos reales | CU19 (pedidos, stock, devoluciones) | ✅ el prompt incluye pedidos, stock, promociones, reservas, preferencias e historial de la conversación (RF25); sin proveedor de IA responde igual con esos datos | completar con tool-calling cuando existan devoluciones y reseñas |
| Entrada por voz en la web | CU24 | ⚠️ la web consulta por texto; el prototipo ya tiene pantalla de voz en mobile | Web Speech API en `/reports/analytical` (opcional) |
| Pantallas de Ajustes, Soporte y Preferencias | mobile | ❌ no hay API detrás | UI estática o endpoints nuevos según RF |
| `recomendacion_talla` y `perfil_corporal` | CU17 / diccionario (`db/init.sql`) | ❌ sin modelo ni API | fase 2 con AR |
| Arqueo y cierre de caja del POS | CU12 (prototipo) | ❌ no hay endpoint de sesión de caja | tabla `sesion_caja` (monto inicial, cierre, cuadre) + endpoints |
| Estado por sugerencia (`visto`/`descartado` por ítem) | CU18 | ⚠️ la API solo maneja el estado del bloque | `PATCH /recommendations/{id}/items/{item_id}` |
| Historial de consultas analíticas | CU24 | ⚠️ hoy vive solo en la pestaña | persistir consultas + dictamen (tabla propia) |
| Recuperación de contraseña | CU02 | ❌ no hay endpoint | `POST /auth/forgot-password` + envío de correo |

## Shell web implementado (Angular)

`Fashionstore-web/src/app/app.{html,scss,ts}` reproduce `src/web/WebLayout.tsx`:

| Elemento del prototipo | Implementación |
| :-- | :-- |
| Sidebar oscura de 240 px que colapsa a 64 px (estado persistido) | `.sidebar` + `--sidebar-w` / `--sidebar-w-collapsed` |
| Insignia de rol con color | `ROLE_META` (`core/navigation.ts`) |
| Menús por rol (Cliente / Administrador / Encargado / Cajero) | `navForRole()` |
| Ítems con icono de línea y borde de acento activo | `app-ui-icon` + `.nav-item.active` |
| Topbar de 64 px: breadcrumb, buscador, campana, menú de usuario | `.topbar`; el buscador navega a `/catalog?q=` |
| Estados (skeleton, empty, error, offline, sin servicio, 403, modal) | `shared/ui/*` |

Cada ítem de navegación lleva el campo `cu` (p. ej. `CU18`) y el topbar lo muestra como chip:
la trazabilidad con `Parcial1-SI2.md` queda visible en la propia interfaz.

Pantallas ya alineadas al prototipo: el shell, **Iniciar sesión** (panel de marca + formulario,
CU02), **Catálogo** (panel de filtros + grid de tarjetas, CU08), **Detalle de prenda** (galería +
panel de compra con talla/color, stock por sucursal y carrito, CU08/CU10) y **Colecciones y
promociones** (banners + productos con descuento, CU20, ruta nueva `/promotions`).

### Decisión sobre la paleta (actualizada 2026-09-20)

El prototipo de Figma Make (`design/web-mobile.zip` ≡ `design/figma-make/src/`) es la
**fuente única de verdad** del diseño móvil y usa el acento terracota `#E05A47`.
El token vino `#8C3858` (del logo exportado, nodo `5:21`) queda **superado** para mobile:

| Token | Valor | Uso |
| :-- | :-- | :-- |
| `accent` | `#E05A47` | marca, botones, badges, precios en oferta |
| `accentDark` | `#C24A38` | estados activos y texto sobre `accentSoft` |
| `accentSoft` | `#FCEAE6` | fondos de chips y avisos |
| `dark` | `#111827` | barras, botón primario, texto principal |
| `background` | `#F8F9FA` | fondo de pantalla |
| `surface` | `#FFFFFF` | tarjetas |
| `muted` / `mutedLight` | `#6B7280` / `#9CA3AF` | texto secundario |
| `border` / `borderLight` | `#E5E7EB` / `#F3F4F6` | bordes y separadores |

Tipografías: **DM Serif Display** (títulos) + **Inter** (cuerpo), vía `google_fonts`.
El cambio aplica a `fashionstore-mobile` (`lib/core/theme/app_theme.dart`); la app Angular
mantiene su propia paleta. Los PNG de `design/figma/` quedan como instantáneas históricas.

## Implementación móvil (Flutter) alineada al prototipo

`fashionstore-mobile/lib` reproduce las 20 pantallas de `design/figma-make/src/*.tsx`:

| Prototipo (`src/*.tsx`) | Implementación Flutter |
| :-- | :-- |
| `SplashScreen` | `features/splash/splash_screen.dart` |
| `OnboardingScreen` | `features/onboarding/onboarding_screen.dart` |
| `LoginScreen` | `features/auth/presentation/login_screen.dart` |
| `RegisterScreen` | `features/auth/presentation/register_screen.dart` |
| `HomeScreen` | `features/home/home_screen.dart` |
| `CatalogScreen` | `features/catalog/presentation/catalog_screen.dart` |
| `ProductDetail` (en `App.tsx`) | `features/catalog/presentation/product_detail_screen.dart` |
| `ReservationsScreen` | `features/reservations/reservations_screen.dart` |
| `CartScreen` | `features/cart/cart_screen.dart` |
| `CheckoutScreen` | `features/checkout/checkout_screen.dart` |
| `PurchaseSuccessScreen` | `features/checkout/purchase_success_screen.dart` |
| `PurchasesScreen` | `features/purchases/purchases_screen.dart` |
| `ProfileScreen` | `features/profile/profile_screen.dart` |
| `PreferencesScreen` | `features/preferences/preferences_screen.dart` |
| `SettingsScreen` | `features/settings/settings_screen.dart` |
| `SupportScreen` | `features/support/support_screen.dart` |
| `AIRecommendationsScreen` | `features/ai/ai_recommendations_screen.dart` |
| `ARFitterScreen` | `features/ar/ar_fitter_screen.dart` |
| `ChatbotScreen` | `features/chatbot/chatbot_screen.dart` |
| `VoiceScreen` | `features/voice/voice_screen.dart` |
| `StateScreens` (demo) | `features/state_demo/state_demo_screen.dart` |
| `ui.tsx` (kit de UI) | `lib/shared/kit/*` |
| `data.ts` (datos demo) | `lib/core/data/mock_data.dart` |
| `App.tsx` (estado + navegación) | `lib/core/state/app_state.dart` + `lib/features/app_shell.dart` |

Catálogo, carrito, reservas, compras, preferencias, chatbot, voz y probador virtual usan los
datos demo equivalentes a `data.ts`, porque `ProductResponse` del backend no expone imagen,
marca, colores, tallas ni rating. **Login y Registro sí llaman al backend real**
(`/auth/login`, `/auth/register`); el resto funciona sin conexión con el catálogo local.

