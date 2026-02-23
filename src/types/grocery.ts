export type Category = 'fruits' | 'vegetables' | 'dairy' | 'snacks' | 'staples';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  quantity: string;
  inStock: boolean;
  description?: string;
}

export interface CartItem {
  product: Product;
  count: number;
}

export type OrderStatus = 'placed' | 'packed' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryCharge: number;
  status: OrderStatus;
  address: string;
  paymentMethod: 'cod' | 'upi';
  createdAt: string;
  customerName: string;
  customerPhone: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  fruits: '🍎 Fruits',
  vegetables: '🥬 Vegetables',
  dairy: '🥛 Dairy',
  snacks: '🍿 Snacks',
  staples: '🌾 Staples',
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  fruits: '🍎',
  vegetables: '🥬',
  dairy: '🥛',
  snacks: '🍿',
  staples: '🌾',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};
