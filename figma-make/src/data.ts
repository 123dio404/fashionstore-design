import type { Product, Reservation, Purchase, UserPreferences } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Blazer Oversize Lana', brand: 'Massimo', category: 'Mujer',
    price: 89.99, oldPrice: 129.99, discount: 31,
    image: 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=400&h=520&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=400&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=400&h=520&fit=crop&auto=format',
    ],
    colors: [{ name: 'Negro', hex: '#111827' }, { name: 'Beige', hex: '#D4C5A9' }, { name: 'Terracota', hex: '#E05A47' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Blazer de corte relajado con hombros estructurados en mezcla de lana y poliéster. Cierre con botones de nácar y bolsillos con solapa.',
    stock: { 'Centro': 3, 'Norte': 1, 'Sur': 5 },
    rating: 4.7, reviews: 128, isFeatured: true,
  },
  {
    id: 2, name: 'Vestido Midi Fluido', brand: 'Zara Studio', category: 'Mujer',
    price: 67.50, oldPrice: 95.00, discount: 29,
    image: 'https://images.unsplash.com/photo-1664076458686-3449062080ac?w=400&h=520&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1664076458686-3449062080ac?w=400&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=400&h=520&fit=crop&auto=format',
    ],
    colors: [{ name: 'Terracota', hex: '#E05A47' }, { name: 'Negro', hex: '#111827' }, { name: 'Crudo', hex: '#F5F0E8' }],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Vestido de largo midi con escote en V y corte evasé en viscosa fluida. Ideal para ocasiones especiales o el día a día.',
    stock: { 'Centro': 0, 'Norte': 4, 'Sur': 2 },
    rating: 4.5, reviews: 87, isNew: true,
  },
  {
    id: 3, name: 'Conjunto Punto Acanalado', brand: 'COS', category: 'Mujer',
    price: 54.00, oldPrice: 72.00, discount: 25,
    image: 'https://images.unsplash.com/photo-1645996830718-127f7e4f74fc?w=400&h=520&fit=crop&auto=format',
    images: ['https://images.unsplash.com/photo-1645996830718-127f7e4f74fc?w=400&h=520&fit=crop&auto=format'],
    colors: [{ name: 'Gris', hex: '#6B7280' }, { name: 'Negro', hex: '#111827' }, { name: 'Camel', hex: '#C4A882' }],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Conjunto de top y pantalón de tiro alto en tejido punto acanalado de alta densidad.',
    stock: { 'Centro': 7, 'Norte': 2, 'Sur': 0 },
    rating: 4.3, reviews: 64,
  },
  {
    id: 4, name: 'Blazer Estructurado', brand: 'Massimo', category: 'Mujer',
    price: 112.00, oldPrice: 148.00, discount: 24,
    image: 'https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=400&h=520&fit=crop&auto=format',
    images: ['https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=400&h=520&fit=crop&auto=format'],
    colors: [{ name: 'Negro', hex: '#111827' }, { name: 'Carbón', hex: '#374151' }],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Blazer con estructura marcada y solapas amplias en tejido técnico. Perfecto para looks de oficina modernos.',
    stock: { 'Centro': 2, 'Norte': 6, 'Sur': 1 },
    rating: 4.8, reviews: 211, isFeatured: true,
  },
  {
    id: 5, name: 'Sneakers Clásicas', brand: 'Nike', category: 'Calzado',
    price: 79.99, oldPrice: 110.00, discount: 27,
    image: 'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=400&h=520&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=400&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1656164753657-8ff832063a71?w=400&h=520&fit=crop&auto=format',
    ],
    colors: [{ name: 'Blanco', hex: '#F8F9FA' }, { name: 'Negro', hex: '#111827' }, { name: 'Terracota', hex: '#E05A47' }],
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    description: 'Zapatillas de caña alta con upper en canvas y suela de goma vulcanizada con grip antideslizante.',
    stock: { 'Centro': 5, 'Norte': 3, 'Sur': 8 },
    rating: 4.6, reviews: 349, isFeatured: true,
  },
  {
    id: 6, name: 'Chaqueta Denim', brand: 'Levis', category: 'Hombre',
    price: 95.00, oldPrice: 130.00, discount: 27,
    image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&h=520&fit=crop&auto=format',
    images: ['https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&h=520&fit=crop&auto=format'],
    colors: [{ name: 'Índigo', hex: '#374151' }, { name: 'Negro', hex: '#111827' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Chaqueta vaquera de corte recto con acabado desgastado. Dos bolsillos delanteros y traseros con botones metálicos.',
    stock: { 'Centro': 4, 'Norte': 0, 'Sur': 6 },
    rating: 4.4, reviews: 156, isNew: true,
  },
  {
    id: 7, name: 'Vestido Midi Rojo', brand: 'Zara Studio', category: 'Mujer',
    price: 74.99, oldPrice: 99.99, discount: 25,
    image: 'https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?w=400&h=520&fit=crop&auto=format',
    images: ['https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?w=400&h=520&fit=crop&auto=format'],
    colors: [{ name: 'Rojo', hex: '#DC2626' }, { name: 'Terracota', hex: '#E05A47' }],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Vestido fluido con cintura definida y escote cuadrado. Corte midi ideal para ocasiones.',
    stock: { 'Centro': 2, 'Norte': 5, 'Sur': 1 },
    rating: 4.9, reviews: 93, isNew: true,
  },
  {
    id: 8, name: 'Sneakers Blancas', brand: 'Adidas', category: 'Calzado',
    price: 59.99, oldPrice: 85.00, discount: 29,
    image: 'https://images.unsplash.com/photo-1656164753657-8ff832063a71?w=400&h=520&fit=crop&auto=format',
    images: ['https://images.unsplash.com/photo-1656164753657-8ff832063a71?w=400&h=520&fit=crop&auto=format'],
    colors: [{ name: 'Blanco', hex: '#F8F9FA' }, { name: 'Gris', hex: '#9CA3AF' }],
    sizes: ['36', '37', '38', '39', '40', '41'],
    description: 'Zapatillas minimalistas con upper de cuero sintético y suela de EVA ultraligera. El básico imprescindible.',
    stock: { 'Centro': 9, 'Norte': 4, 'Sur': 3 },
    rating: 4.5, reviews: 278,
  },
];

export const CATEGORIES = ['Todos', 'Mujer', 'Hombre', 'Calzado', 'Accesorios', 'Ofertas'];

export const STORES = [
  { id: 'centro', name: 'Sucursal Centro', address: 'Av. Corrientes 1450, CABA', hours: '10:00 – 21:00' },
  { id: 'norte',  name: 'Sucursal Norte',  address: 'Av. del Libertador 3200, Buenos Aires', hours: '10:00 – 21:00' },
  { id: 'sur',    name: 'Sucursal Sur',    address: 'Av. Rivadavia 8900, Buenos Aires', hours: '10:00 – 20:00' },
];

export const TIME_SLOTS = ['10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','17:00','17:30','18:00'];

export const BANNERS = [
  {
    id: 1,
    tag: 'NUEVA TEMPORADA',
    title: 'Otoño · Invierno\n2026',
    subtitle: 'Hasta 40% de descuento',
    image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=700&h=380&fit=crop&auto=format',
    bg: '#111827',
  },
  {
    id: 2,
    tag: 'COLECCIÓN EXCLUSIVA',
    title: 'Blazers\nEstructurados',
    subtitle: 'Estilo editorial, todo el año',
    image: 'https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=700&h=380&fit=crop&auto=format',
    bg: '#374151',
  },
  {
    id: 3,
    tag: 'ÚLTIMAS UNIDADES',
    title: 'Calzado\nPremium',
    subtitle: 'Nike, Adidas y más',
    image: 'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=700&h=380&fit=crop&auto=format',
    bg: '#1E293B',
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-001', productId: 1, productName: 'Blazer Oversize Lana',
    productImage: 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=200&h=260&fit=crop&auto=format',
    brand: 'Massimo', size: 'M', color: 'Negro',
    date: '24 sep 2026', time: '15:30', store: 'Sucursal Centro',
    status: 'confirmada', code: 'FS-7842',
  },
  {
    id: 'RES-002', productId: 5, productName: 'Sneakers Clásicas',
    productImage: 'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=200&h=260&fit=crop&auto=format',
    brand: 'Nike', size: '40', color: 'Blanco',
    date: '28 sep 2026', time: '11:00', store: 'Sucursal Norte',
    status: 'pendiente', code: 'FS-7901',
  },
  {
    id: 'RES-003', productId: 2, productName: 'Vestido Midi Fluido',
    productImage: 'https://images.unsplash.com/photo-1664076458686-3449062080ac?w=200&h=260&fit=crop&auto=format',
    brand: 'Zara Studio', size: 'S', color: 'Terracota',
    date: '10 sep 2026', time: '14:00', store: 'Sucursal Sur',
    status: 'completada', code: 'FS-7650',
  },
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'ORD-4821', date: '15 sep 2026', status: 'entregado',
    total: 157.49, subtotal: 152.50, shipping: 4.99, paymentMethod: 'Visa •••• 4242',
    deliveryMethod: 'home',
    items: [
      { productId: 1, name: 'Blazer Oversize Lana', brand: 'Massimo', price: 89.99, image: 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=120&h=150&fit=crop&auto=format', size: 'M', color: 'Negro', qty: 1 },
      { productId: 4, name: 'Blazer Estructurado', brand: 'Massimo', price: 62.51, image: 'https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=120&h=150&fit=crop&auto=format', size: 'M', color: 'Carbón', qty: 1 },
    ],
  },
  {
    id: 'ORD-4765', date: '2 sep 2026', status: 'en_camino',
    total: 79.99, subtotal: 79.99, shipping: 0, paymentMethod: 'Mastercard •••• 8821',
    deliveryMethod: 'pickup', store: 'Sucursal Norte',
    items: [
      { productId: 5, name: 'Sneakers Clásicas', brand: 'Nike', price: 79.99, image: 'https://images.unsplash.com/photo-1605523741177-cd660595c2cf?w=120&h=150&fit=crop&auto=format', size: '40', color: 'Blanco', qty: 1 },
    ],
  },
  {
    id: 'ORD-4690', date: '18 ago 2026', status: 'cancelado',
    total: 54.00, subtotal: 54.00, shipping: 0, paymentMethod: 'Visa •••• 4242',
    deliveryMethod: 'home',
    items: [
      { productId: 3, name: 'Conjunto Punto Acanalado', brand: 'COS', price: 54.00, image: 'https://images.unsplash.com/photo-1645996830718-127f7e4f74fc?w=120&h=150&fit=crop&auto=format', size: 'M', color: 'Gris', qty: 1 },
    ],
  },
];

export const DEFAULT_PREFS: UserPreferences = {
  brands: ['Massimo', 'Zara Studio'],
  favoriteColors: ['Negro', 'Beige'],
  sizes: ['M', 'L'],
  notifications: true,
  language: 'es',
  theme: 'light',
  currency: 'ARS',
};

export const FAQ = [
  { q: '¿Cuánto tarda el envío?', a: 'El envío a domicilio tarda entre 3 y 5 días hábiles. El retiro en tienda estará disponible en 24 horas.' },
  { q: '¿Puedo cambiar o devolver un producto?', a: 'Sí, aceptamos cambios y devoluciones dentro de los 30 días desde la compra, siempre que el producto esté sin uso y con sus etiquetas.' },
  { q: '¿Cómo funciona el Probador Virtual?', a: 'El Probador Virtual usa la cámara de tu dispositivo para superponer modelos 3D (.glb/.gltf) de nuestras prendas sobre tu imagen en tiempo real.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas Visa, Mastercard, American Express y pagos a través de Stripe. Todos los pagos son procesados de forma segura.' },
  { q: '¿Cómo hago una reserva de probador?', a: 'Desde la pestaña "Reservas" puedes elegir el producto, la sucursal y el horario disponible. Recibirás un código de confirmación.' },
  { q: '¿Las recomendaciones de IA son precisas?', a: 'Nuestro motor de IA analiza tus preferencias de talla, marca, colores y rango de precio para sugerirte productos que se ajusten a tu estilo.' },
];

export const BRANDS_LIST = ['Massimo', 'Zara Studio', 'COS', 'Nike', 'Adidas', 'Levis', 'H&M', 'Mango', 'Pull & Bear', 'Bershka'];
export const COLORS_LIST = ['Negro', 'Blanco', 'Gris', 'Beige', 'Terracota', 'Azul', 'Rojo', 'Verde', 'Camel'];
export const SIZES_LIST = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'];
