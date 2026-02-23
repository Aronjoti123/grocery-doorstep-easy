
-- Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity TEXT NOT NULL DEFAULT '1 unit',
  category TEXT NOT NULL DEFAULT 'staples',
  image TEXT NOT NULL DEFAULT '🛒',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders table
CREATE TYPE public.order_status AS ENUM ('placed', 'packed', 'out_for_delivery', 'delivered');
CREATE TYPE public.payment_method AS ENUM ('cod', 'upi');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total NUMERIC NOT NULL,
  delivery_charge NUMERIC NOT NULL DEFAULT 29,
  status order_status NOT NULL DEFAULT 'placed',
  address TEXT NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'cod',
  customer_name TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL DEFAULT '🛒',
  count INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users see/edit own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products: everyone can read, admins can manage
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Orders: users see own, admins see all
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Order items: viewable if user owns the order or is admin
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
  );

CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- user_roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Seed products
INSERT INTO public.products (name, price, quantity, category, image, in_stock) VALUES
  ('Fresh Bananas', 40, '1 dozen', 'fruits', '🍌', true),
  ('Red Apples', 180, '1 kg', 'fruits', '🍎', true),
  ('Mangoes (Alphonso)', 350, '1 kg', 'fruits', '🥭', true),
  ('Oranges', 80, '1 kg', 'fruits', '🍊', true),
  ('Grapes (Green)', 120, '500 g', 'fruits', '🍇', false),
  ('Tomatoes', 30, '1 kg', 'vegetables', '🍅', true),
  ('Onions', 35, '1 kg', 'vegetables', '🧅', true),
  ('Potatoes', 28, '1 kg', 'vegetables', '🥔', true),
  ('Fresh Spinach', 25, '250 g', 'vegetables', '🥬', true),
  ('Carrots', 45, '500 g', 'vegetables', '🥕', true),
  ('Green Chillies', 15, '100 g', 'vegetables', '🌶️', true),
  ('Full Cream Milk', 68, '1 L', 'dairy', '🥛', true),
  ('Curd (Dahi)', 45, '400 g', 'dairy', '🍶', true),
  ('Paneer', 90, '200 g', 'dairy', '🧀', true),
  ('Butter', 55, '100 g', 'dairy', '🧈', true),
  ('Potato Chips', 30, '150 g', 'snacks', '🍟', true),
  ('Biscuits (Marie)', 25, '250 g', 'snacks', '🍪', true),
  ('Namkeen Mix', 60, '400 g', 'snacks', '🥜', true),
  ('Chocolate Bar', 45, '100 g', 'snacks', '🍫', true),
  ('Basmati Rice', 160, '1 kg', 'staples', '🍚', true),
  ('Wheat Flour (Atta)', 55, '1 kg', 'staples', '🌾', true),
  ('Toor Dal', 140, '1 kg', 'staples', '🫘', true),
  ('Sugar', 45, '1 kg', 'staples', '🧂', true),
  ('Cooking Oil', 180, '1 L', 'staples', '🫗', true);
