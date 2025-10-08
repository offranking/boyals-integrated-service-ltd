export type Page = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'serviceDetail' 
  | 'gallery' 
  | 'products' 
  | 'productDetail' 
  | 'booking' 
  | 'contact';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Database Interfaces (what your backend returns)
export interface DbService {
  id: number;
  title: string;
  description: string;
  price: number;
  duration?: string;
  category: string;
  status: string;
  imageUrl?: string;
  features?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  status: string;
  brand?: string;
  category: string;
  specs?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbTestimonial {
  id: number;
  customerName: string;
  position?: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  status: string;
  createdAt: string;
}