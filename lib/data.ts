// lib/data.ts
import { Product } from '@/types';

// `slug` keeps the original English identifier used for the image file names
// (e.g. /products/dt-flat-classic-white-sneakers.jpg), so the visible name and
// description can be translated freely without breaking the product images.
const rawProducts = [
  {
    id: 1,
    slug: "classic-white-sneakers",
    name: "Sabatilles blanques clàssiques",
    price: 79.99,
    category: "Calçat",
    description: "Sabatilles blanques versàtils, perfectes per a qualsevol conjunt informal. Tenen una sola encoixinada còmoda i materials de primera qualitat per a una durabilitat duradora."
  },
  {
    id: 2,
    slug: "denim-jacket",
    name: "Jaqueta texana",
    price: 129.99,
    category: "Abrics",
    description: "Jaqueta texana clàssica feta amb cotó de primera qualitat. Té un tall còmode, múltiples butxaques i un rentat d'estil vintage."
  },
  {
    id: 3,
    slug: "vintage-t-shirt",
    name: "Samarreta vintage",
    price: 29.99,
    category: "Samarretes"
  },
  {
    id: 4,
    slug: "leather-backpack",
    name: "Motxilla de pell",
    price: 89.99,
    category: "Accessoris"
  },
  {
    id: 5,
    slug: "running-shoes",
    name: "Sabatilles de running",
    price: 119.99,
    category: "Calçat",
    description: "Sabatilles de running lleugeres amb tecnologia d'amortiment avançada. Perfectes tant per entrenar com per a l'ús diari."
  },
  {
    id: 6,
    slug: "graphic-print-t-shirt",
    name: "Samarreta estampada",
    price: 34.99,
    category: "Samarretes",
    description: "Samarreta de cotó amb un disseny artístic únic. Estampat d'edició limitada."
  },
  {
    id: 7,
    slug: "wool-winter-coat",
    name: "Abric d'hivern de llana",
    price: 199.99,
    category: "Abrics",
    description: "Abric d'hivern càlid i elegant fet amb una mescla de llana de primera qualitat. Té un tall modern i folre complet."
  },
  {
    id: 8,
    slug: "canvas-tote-bag",
    name: "Bossa de lona",
    price: 39.99,
    category: "Accessoris",
    description: "Bossa de lona resistent amb nanses de pell. Perfecta per anar a comprar o per a l'ús diari."
  },
  {
    id: 9,
    slug: "high-top-sneakers",
    name: "Sabatilles de canya alta",
    price: 84.99,
    category: "Calçat",
    description: "Sabatilles de canya alta clàssiques amb comoditat moderna. Disponibles en diversos colors."
  },
  {
    id: 10,
    slug: "striped-polo-shirt",
    name: "Polo de ratlles",
    price: 44.99,
    category: "Samarretes",
    description: "Polo de cotó amb un patró de ratlles clàssic. Perfecte per a ocasions informals o semiformals."
  },
  {
    id: 11,
    slug: "rain-jacket",
    name: "Impermeable",
    price: 89.99,
    category: "Abrics",
    description: "Jaqueta impermeable amb caputxa. Disseny lleuger i plegable."
  },
  {
    id: 12,
    slug: "leather-wallet",
    name: "Cartera de pell",
    price: 49.99,
    category: "Accessoris",
    description: "Cartera de pell autèntica amb múltiples ranures per a targetes i butxaca per a monedes."
  },
  {
    id: 13,
    slug: "sport-sandals",
    name: "Sandàlies esportives",
    price: 59.99,
    category: "Calçat",
    description: "Sandàlies esportives còmodes amb tires ajustables. Perfectes per a activitats a l'aire lliure."
  },
  {
    id: 14,
    slug: "basic-v-neck-t-shirt",
    name: "Samarreta bàsica de coll de pic",
    price: 24.99,
    category: "Samarretes",
    description: "Samarreta de cotó suau amb coll de pic. Disponible en diversos colors."
  },
  {
    id: 15,
    slug: "windbreaker-jacket",
    name: "Tallavents",
    price: 69.99,
    category: "Abrics",
    description: "Tallavents lleuger amb butxaques amb cremallera. Perfecte per a la primavera i la tardor."
  },
  {
    id: 16,
    slug: "sunglasses",
    name: "Ulleres de sol",
    price: 129.99,
    category: "Accessoris",
    description: "Ulleres de sol de disseny clàssic amb protecció UV. Inclouen funda protectora."
  },
  {
    id: 17,
    slug: "slip-on-sneakers",
    name: "Sabatilles sense cordons",
    price: 64.99,
    category: "Calçat",
    description: "Sabatilles informals sense cordons amb plantilla de memory foam. Perfectes per a l'ús diari."
  },
  {
    id: 18,
    slug: "long-sleeve-t-shirt",
    name: "Samarreta de màniga llarga",
    price: 39.99,
    category: "Samarretes",
    description: "Samarreta de màniga llarga còmoda feta amb una mescla de cotó suau."
  },
  {
    id: 19,
    slug: "puffer-jacket",
    name: "Anorac encoixinat",
    price: 149.99,
    category: "Abrics",
    description: "Anorac encoixinat càlid amb farciment sintètic. Inclou caputxa i butxaques amb cremallera."
  },
  {
    id: 20,
    slug: "crossbody-bag",
    name: "Bossa bandolera",
    price: 79.99,
    category: "Accessoris",
    description: "Bossa bandolera elegant amb corretja ajustable. Múltiples compartiments per a l'organització."
  }
];

export const products: Product[] = rawProducts.map(({ slug, ...product }) => ({
  ...product,
  image: `/products/dt-flat-${slug}.jpg`
}));

export const categories = ["Tots", "Calçat", "Abrics", "Samarretes", "Accessoris"];
