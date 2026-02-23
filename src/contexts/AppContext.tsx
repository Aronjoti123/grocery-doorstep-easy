import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, Order, OrderStatus, UserProfile } from '@/types/grocery';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartCount: (productId: string, count: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  deliveryCharge: number;

  // Auth
  user: UserProfile | null;
  isAdmin: boolean;
  login: (phone: string, name: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateAddress: (address: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (address: string, paymentMethod: 'cod' | 'upi') => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const deliveryCharge = 29;

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.count, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.count, 0);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, count: i.count + 1 } : i);
      }
      return [...prev, { product, count: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartCount = useCallback((productId: string, count: number) => {
    if (count <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCart(prev => prev.map(i => i.product.id === productId ? { ...i, count } : i));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const login = useCallback((phone: string, name: string) => {
    setUser({ name, phone, address: '' });
    setIsAdmin(false);
  }, []);

  const loginAsAdmin = useCallback(() => {
    setUser({ name: 'Admin', phone: '0000000000', address: '' });
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
  }, []);

  const updateAddress = useCallback((address: string) => {
    setUser(prev => prev ? { ...prev, address } : null);
  }, []);

  const placeOrder = useCallback((address: string, paymentMethod: 'cod' | 'upi') => {
    const id = 'ORD-' + Date.now().toString(36).toUpperCase();
    const order: Order = {
      id,
      items: [...cart],
      total: cartTotal + deliveryCharge,
      deliveryCharge,
      status: 'placed',
      address,
      paymentMethod,
      createdAt: new Date().toISOString(),
      customerName: user?.name || 'Guest',
      customerPhone: user?.phone || '',
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    return id;
  }, [cart, cartTotal, deliveryCharge, user]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateCartCount, clearCart, cartTotal, cartCount, deliveryCharge,
      user, isAdmin, login, loginAsAdmin, logout, updateAddress,
      orders, placeOrder, updateOrderStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};
