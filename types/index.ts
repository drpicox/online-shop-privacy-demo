// types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}