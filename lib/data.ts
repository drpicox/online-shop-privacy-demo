// lib/data.ts
import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 79.99,
    image: "/products/classic-white-sneakers.png",
    category: "Shoes",
    description: "Versatile white sneakers perfect for any casual outfit. Features a comfortable cushioned sole and premium materials for lasting durability."
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 129.99,
    image: "/products/denim-jacket.png",
    category: "Outerwear",
    description: "Classic denim jacket made from premium cotton. Features a comfortable fit, multiple pockets, and vintage-style washing."
  },
  {
    id: 3,
    name: "Vintage T-Shirt",
    price: 29.99,
    image: "/products/vintage-tshirt.png",
    category: "T-Shirts"
  },
  {
    id: 4,
    name: "Leather Backpack",
    price: 89.99,
    image: "/products/leather-backpack.png",
    category: "Accessories"
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 119.99,
    image: "/api/placeholder/300/300",
    category: "Shoes",
    description: "Lightweight running shoes with advanced cushioning technology. Perfect for both training and casual wear."
  },
  {
    id: 6,
    name: "Graphic Print T-Shirt",
    price: 34.99,
    image: "/api/placeholder/300/300",
    category: "T-Shirts",
    description: "Cotton t-shirt featuring unique artistic design. Limited edition print."
  },
  {
    id: 7,
    name: "Wool Winter Coat",
    price: 199.99,
    image: "/api/placeholder/300/300",
    category: "Outerwear",
    description: "Warm and stylish winter coat made from premium wool blend. Features a modern cut and full lining."
  },
  {
    id: 8,
    name: "Canvas Tote Bag",
    price: 39.99,
    image: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Durable canvas tote with leather handles. Perfect for shopping or casual daily use."
  },
  {
    id: 9,
    name: "High-Top Sneakers",
    price: 84.99,
    image: "/api/placeholder/300/300",
    category: "Shoes",
    description: "Classic high-top sneakers with modern comfort features. Available in multiple colors."
  },
  {
    id: 10,
    name: "Striped Polo Shirt",
    price: 44.99,
    image: "/api/placeholder/300/300",
    category: "T-Shirts",
    description: "Cotton polo shirt with classic stripe pattern. Perfect for casual or semi-formal occasions."
  },
  {
    id: 11,
    name: "Rain Jacket",
    price: 89.99,
    image: "/api/placeholder/300/300",
    category: "Outerwear",
    description: "Waterproof rain jacket with hood. Lightweight and packable design."
  },
  {
    id: 12,
    name: "Leather Wallet",
    price: 49.99,
    image: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Genuine leather wallet with multiple card slots and coin pocket."
  },
  {
    id: 13,
    name: "Sport Sandals",
    price: 59.99,
    image: "/api/placeholder/300/300",
    category: "Shoes",
    description: "Comfortable sport sandals with adjustable straps. Perfect for outdoor activities."
  },
  {
    id: 14,
    name: "Basic V-Neck T-Shirt",
    price: 24.99,
    image: "/api/placeholder/300/300",
    category: "T-Shirts",
    description: "Soft cotton v-neck t-shirt. Available in multiple colors."
  },
  {
    id: 15,
    name: "Windbreaker Jacket",
    price: 69.99,
    image: "/api/placeholder/300/300",
    category: "Outerwear",
    description: "Lightweight windbreaker with zip pockets. Perfect for spring and fall."
  },
  {
    id: 16,
    name: "Sunglasses",
    price: 129.99,
    image: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Classic design sunglasses with UV protection. Includes protective case."
  },
  {
    id: 17,
    name: "Slip-On Sneakers",
    price: 64.99,
    image: "/api/placeholder/300/300",
    category: "Shoes",
    description: "Casual slip-on sneakers with memory foam insole. Perfect for everyday wear."
  },
  {
    id: 18,
    name: "Long Sleeve T-Shirt",
    price: 39.99,
    image: "/api/placeholder/300/300",
    category: "T-Shirts",
    description: "Comfortable long sleeve t-shirt made from soft cotton blend."
  },
  {
    id: 19,
    name: "Puffer Jacket",
    price: 149.99,
    image: "/api/placeholder/300/300",
    category: "Outerwear",
    description: "Warm puffer jacket with synthetic fill. Includes hood and zip pockets."
  },
  {
    id: 20,
    name: "Crossbody Bag",
    price: 79.99,
    image: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Stylish crossbody bag with adjustable strap. Multiple compartments for organization."
  }
].map(p => ({
  ...p,
  image: `/products/dt-flat-${p.name.toLowerCase().replace(/ /g, '-')}.jpg`
}));

export const categories = ["All", "Shoes", "Outerwear", "T-Shirts", "Accessories"];
