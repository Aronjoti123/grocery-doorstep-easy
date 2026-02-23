import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, Product, Order, OrderStatus, UserProfile } from '@/types/grocery';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AppContextType {
  // Cart (local state)
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartCount: (productId: string, count: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  deliveryCharge: number;

  // Auth
  authUser: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Products (from DB)
  products: Product[];
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;

  // Orders
  orders: Order[];
  loadingOrders: boolean;
  placeOrder: (address: string, paymentMethod: 'cod' | 'upi') => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const deliveryCharge = 29;
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.count, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.count, 0);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        // Defer fetches to avoid Supabase deadlock
        setTimeout(() => {
          fetchProfile(session.user.id);
          checkAdmin(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdmin(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load products on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile({ name: data.name, phone: data.phone, address: data.address });
    }
  };

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin');
    setIsAdmin((data && data.length > 0) || false);
  };

  const refreshProducts = async () => {
    setLoadingProducts(true);
    const { data } = await supabase.from('products').select('*').order('created_at');
    if (data) {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        quantity: p.quantity,
        category: p.category as Product['category'],
        image: p.image,
        inStock: p.in_stock,
      })));
    }
    setLoadingProducts(false);
  };

  const refreshOrders = async () => {
    if (!authUser) return;
    setLoadingOrders(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (data) {
      setOrders(data.map(o => ({
        id: o.id,
        items: (o.order_items as any[]).map((i: any) => ({
          product: {
            id: i.product_id,
            name: i.product_name,
            price: Number(i.price),
            image: i.product_image,
            quantity: '',
            category: 'staples' as const,
            inStock: true,
          },
          count: i.count,
        })),
        total: Number(o.total),
        deliveryCharge: Number(o.delivery_charge),
        status: o.status as OrderStatus,
        address: o.address,
        paymentMethod: o.payment_method as 'cod' | 'upi',
        createdAt: o.created_at,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
      })));
    }
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (authUser) refreshOrders();
  }, [authUser]);

  // Cart operations
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, count: i.count + 1 } : i);
      return [...prev, { product, count: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartCount = useCallback((productId: string, count: number) => {
    if (count <= 0) setCart(prev => prev.filter(i => i.product.id !== productId));
    else setCart(prev => prev.map(i => i.product.id === productId ? { ...i, count } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Auth operations
  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCart([]);
    setOrders([]);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authUser) return;
    const { error } = await supabase.from('profiles').update(updates).eq('id', authUser.id);
    if (error) { toast.error('Failed to update profile'); return; }
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  // Order operations
  const placeOrder = async (address: string, paymentMethod: 'cod' | 'upi'): Promise<string | null> => {
    if (!authUser || cart.length === 0) return null;

    const total = cartTotal + deliveryCharge;
    const { data: order, error } = await supabase.from('orders').insert({
      user_id: authUser.id,
      total,
      delivery_charge: deliveryCharge,
      address,
      payment_method: paymentMethod,
      customer_name: profile?.name || '',
      customer_phone: profile?.phone || '',
    }).select().single();

    if (error || !order) { toast.error('Failed to place order'); return null; }

    const items = cart.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      count: item.count,
      price: item.product.price,
    }));

    await supabase.from('order_items').insert(items);
    setCart([]);
    await refreshOrders();
    return order.id;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { toast.error('Failed to update status'); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateCartCount, clearCart, cartTotal, cartCount, deliveryCharge,
      authUser, profile, isAdmin, loading, signUp, signIn, signOut, updateProfile,
      products, loadingProducts, refreshProducts,
      orders, loadingOrders, placeOrder, updateOrderStatus, refreshOrders,
    }}>
      {children}
    </AppContext.Provider>
  );
};
