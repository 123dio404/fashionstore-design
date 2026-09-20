Crea el flujo WEB de FashionStore (desktop, 1440×900) en este mismo archivo, en un
conjunto de frames nuevo llamado "WEB — FashionStore". NO modifiques ninguna pantalla
mobile existente: solo reutiliza sus tokens, tipografías y recetas de componentes.

ESTILO: debe verse como la misma marca que la app mobile, adaptada a escritorio.
Usa exactamente el mismo sistema visual que ya existe en src/ui.tsx:
- Tokens (idénticos): bg #F8F9FA · dark #111827 · accent #E05A47 · muted #6B7280 ·
  mutedLight #9CA3AF · border #E5E7EB · borderLight #F3F4F6 · card #FFFFFF ·
  success #059669 · successBg #ECFDF5 · warning #D97706 · warningBg #FEF3C7 · errorBg #FEF2F2
- Tipografía: DM Serif Display para títulos de página y de bloque; Inter para todo lo demás.
  Escala web: H1 32/Display · H2 20/Inter 700 · Body 14 · Label 12 (uppercase, letter-spacing .06em)
  para encabezados de tabla y etiquetas de campo.
- Radios: chips y botones pill 100 · tarjetas 16 · inputs y botones secundarios 12 · badges 6-8.
- Sombras: solo `0 2px 8px rgba(0,0,0,.04)` y `0 2px 10px rgba(0,0,0,.06)`. Sin sombras fuertes.
- Botón primario: fondo C.dark, texto blanco, radio 12, padding 12×20.
  Botón de acento: fondo C.accent, texto blanco (solo para IA/acciones destacadas).
  Botón secundario: fondo C.borderLight, texto C.muted.
- Chips: pill, seleccionado = fondo C.dark + texto blanco; no seleccionado = fondo C.borderLight.
- Banners: informativo = C.dark con texto #D1D5DB; advertencia = C.warningBg/#92400E;
  éxito = C.successBg/C.success; error = C.errorBg/C.accent. Siempre con icono de línea.
- Toast: pill oscuro (C.dark, radio 14) abajo-centro con icono de check en círculo C.successBg.
- Iconos: SOLO línea, stroke 1.5–2, mismos que mobile (home, grid, calendar, bag, user, search,
  filter, chevrons, plus, minus, trash, heart, star, check, wifi, alert, box, bell, settings,
  log-out, truck, store, map-pin, clock, credit-card, tag, refresh, mic, camera, sparkles).
  Prohibido emojis.
- Estados reutilizables (mismos que mobile, en versión desktop): skeleton shimmer, empty state,
  error con reintento, offline banner, "servicio no configurado".

ESTRUCTURA DE PÁGINA (todas las pantallas autenticadas)
- Sidebar fijo 240px: fondo C.dark, wordmark FashionStore arriba, ítems con icono + label
  (Inter 13). Activo: fondo rgba(255,255,255,.08), texto blanco y barra de acento 3px a la
  izquierda. Los ítems se muestran/ocultan por rol.
- Topbar 64px: buscador global, selector de sucursal, campana con badge C.accent, avatar + menú.
- Contenido: fondo C.bg, padding 24, título de página (DM Serif Display) + acciones a la derecha.
- Tablas: sin líneas verticales; fila 56px, separador C.borderLight, encabezado en Label 12
  uppercase C.muted, acciones a la derecha (iconos), paginación al pie.
- Formularios: panel lateral (drawer 420px) o modal 560px, con label arriba, input radio 12,
  helper text C.mutedLight 11 y errores en C.accent.

PANTALLAS — CLIENTE
1) CU01 · Registro (1440 split: izquierda imagen/bloque C.dark con wordmark, derecha formulario).
2) CU02 · Login y Perfil, incluyendo "recuperar acceso" y edición de datos personales.
3) CU08 · Catálogo: filtros laterales (categoría, marca, talla, color, rango de precio, temporada),
   grid de 4 columnas con tarjetas de producto (misma tarjeta que mobile: imagen 3/4, badge
   -% en C.accent, NUEVO en C.dark, corazón arriba-derecha, marca en Label 12, nombre 13/600,
   precio + precio tachado, "+ Añadir" en C.dark), y estado de disponibilidad por sucursal.
4) CU08 · Ficha de producto: galería a la izquierda, panel de compra a la derecha con selector de
   talla/color por variante y disponibilidad por sucursal (Disponible / Últimas unidades / Agotado).
5) CU10 · Carrito: tabla de ítems con imagen, talla/color, cantidad, subtotal y resumen de compra fijo a la derecha.
6) CU11 · Checkout: pasos (datos → entrega → pago), entrega a domicilio o retiro en tienda/PUD con
   selector de sucursal, y las 3 pasarelas (Libélula, PayPal, Stripe). Pantalla de "compra exitosa".
7) CU15 · Mis reservas: cards con código, sucursal, fecha/hora, estado (Pendiente/Confirmada/
   Atendida/Cancelada) y acción "Cancelar reserva" con confirmación.
8) CU16 · Historial de compras: tabla cronológica (fecha, código, canal, total, estado) + detalle desplegable.
9) CU18 · Recomendaciones IA: bloque "Tu estilo" a la izquierda (marca favorita = selección ÚNICA,
   categoría favorita, tus tallas, presupuesto con slider de rango, colores) y grid de resultados
   a la derecha con chip de "Coincidencia N" + chips de motivo ("Categoría favorita", "Tu marca",
   "Basado en tus compras", "Tu talla", "Tu color", "Temporada"). Incluye acciones "Marcar como visto"
   y "Descartar" con badge Pendiente/Visto/Descartado, y sección "Mis recomendaciones anteriores".
10) CU19 · Chatbot: layout de dos columnas (conversaciones a la izquierda 320px, chat al centro,
    contexto/acciones rápidas a la derecha), burbujas usuario C.dark / asistente C.borderLight,
    input con botón enviar, estado "escribiendo…".
11) CU20 · Promociones (vista cliente): hero de colección + grid de productos en promo.

PANTALLAS — ADMINISTRACIÓN
12) CU23 · Dashboard gerencial: 4 KPI cards arriba (valor en DM Serif Display 32 + variación +% en
    success/accent, label 12 uppercase) y 2 bloques de gráfico (ventas por día, ventas por sucursal)
    + tabla corta de "stock bajo".
13) CU03 · Usuarios y roles: tabla (nombre, email, teléfono, roles como badges, estado, acciones),
    drawer de edición con asignación de roles y switch de estado, y pantalla "Acceso denegado" (403).
14) CU04 · Sucursales y ciudades: tabla + mapa/placeholder, drawer con ciudad, dirección, horarios
    de atención y datos de contacto.
15) CU05 · Catálogo de prendas: tabla con filtros, drawer de alta/edición con ficha técnica,
    categoría, temporada, marca, precio y variantes (talla + color + código) en sub-tabla,
    y campo de modelo 3D (glb/gltf).
16) CU06 · Parámetros: pestañas (Categorías · Tallas · Colores · Temporadas) con CRUD en tabla inline.
17) CU07 · Proveedores: tabla con estado activo/inactivo y drawer de datos (nombre, NIT/CI, contacto).
18) CU09 · Inventario y movimientos: filtro por sucursal, tabla por variante con stock actual,
    reservado y disponible, y acciones "Ingreso", "Transferir entre sucursales" y "Ajuste"
    (drawer con sucursal destino, cantidad y motivo); historial de movimientos.

PANTALLAS — TIENDA Y POS
19) CU12 · POS, en 3 frames: (a) apertura de caja (seleccionar sucursal + monto inicial),
    (b) caja principal (buscador + lector de código de barras, talla/color, lista de ítems,
    subtotal, acciones editar/quitar), (c) pago y comprobante (efectivo/tarjeta/datáfono,
    estados "procesando/pagado/fallido", vuelto y recibo imprimible con el wordmark).
20) CU14 · Reservas en tienda: kanban o tabla con pendientes / del día / listas para preparar,
    acción "asignar probador", "marcar atendida" y confirmación del cliente.

PANTALLAS — GESTIÓN
21) CU20 · Colecciones y promociones (admin): tabla de campañas con vigencia y estado,
    drawer con tipo de descuento (% o monto), fechas y selección de productos.
22) CU21 · Reportes de ventas: barra de filtros (fecha desde/hasta, sucursal, canal), KPI resumen,
    gráfico y tabla exportable (CSV/PDF).
23) CU22 · Reportes de inventario: rotación, agotados y prendas inmovilizadas; tabla con
    unidades vendidas vs stock y semáforo de alerta.
24) CU24 · Reportes analíticos por voz/IA: input de consulta en lenguaje natural con botón de
    micrófono, chips de "consultas sugeridas", panel de resultado con métricas + dictamen generado,
    e historial de consultas. Estado "servicio de IA no configurado" cuando el motor está apagado.

REGLAS DE DATOS (para no dibujar campos que no existen)
- No hay fotos de producto en el backend: usa placeholder con fondo C.borderLight y la inicial de
  la marca. No inventes `image_url`.
- Marca es UN solo valor por preferencia (no multi-select).
- La moneda se muestra como `$ 0.00`; el idioma de toda la interfaz es español.
- En CU18 los motivos posibles son exactamente: "categoría preferida", "marca preferida",
  "historial de compras", "talla preferida", "color preferido", "temporada", "disponibilidad".
  La afinidad es "Coincidencia N" (0–100), nunca un porcentaje de IA.
- No diseñes módulos de finanzas ni de operaciones: no corresponden a ningún caso de uso del documento.
- No agregues pantallas mobile (reservar en probador CU13 y vestidor AR CU17 son solo móvil).

ENTREGABLE
- Nombra cada frame exactamente: "WEB · CU03 · Usuarios y roles", "WEB · CU12 · POS · Caja", etc.
- Componentes reutilizables creados como componentes reales: Sidebar, Topbar, PageHeader, StatCard,
  DataTable, FilterBar, Drawer, Modal, ConfirmDialog, StatusChip, Badge, Toast, EmptyState,
  ErrorState, OfflineBanner, Skeleton, ProductCard, ChartCard, Stepper.
- Auto-layout en todo, ancho de contenido 1200px centrado, y estados hover/focus visibles
  (hover: fondo C.borderLight; focus: anillo 2px C.accent con offset 2px).
- Genera el código del layout base (sidebar + topbar + página) y de las pantallas de CU18, CU23 y CU12.
