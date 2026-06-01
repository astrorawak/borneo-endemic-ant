export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  categorySlug: string;
  description: string;
  shortDesc: string;
  image: string;
  stock: number;
  isActive: boolean;
  origin: string;
  badge?: string;
  scientificName?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCountry: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: 'paypal' | 'usdt' | 'western_union';
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  whatsapp: string;
  paypalEmail: string;
  usdtAddress: string;
  usdtNetwork: string;
  westernUnionName: string;
  westernUnionCountry: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  shippingNote: string;
  liveArrivalGuarantee: boolean;
}
