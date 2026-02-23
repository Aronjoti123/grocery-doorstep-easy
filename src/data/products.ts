import { Product } from '@/types/grocery';

export const products: Product[] = [
  // Fruits
  { id: 'f1', name: 'Fresh Bananas', price: 40, image: '🍌', category: 'fruits', quantity: '1 dozen', inStock: true },
  { id: 'f2', name: 'Red Apples', price: 180, image: '🍎', category: 'fruits', quantity: '1 kg', inStock: true },
  { id: 'f3', name: 'Mangoes (Alphonso)', price: 350, image: '🥭', category: 'fruits', quantity: '1 kg', inStock: true },
  { id: 'f4', name: 'Oranges', price: 80, image: '🍊', category: 'fruits', quantity: '1 kg', inStock: true },
  { id: 'f5', name: 'Grapes (Green)', price: 120, image: '🍇', category: 'fruits', quantity: '500 g', inStock: false },

  // Vegetables
  { id: 'v1', name: 'Tomatoes', price: 30, image: '🍅', category: 'vegetables', quantity: '1 kg', inStock: true },
  { id: 'v2', name: 'Onions', price: 35, image: '🧅', category: 'vegetables', quantity: '1 kg', inStock: true },
  { id: 'v3', name: 'Potatoes', price: 28, image: '🥔', category: 'vegetables', quantity: '1 kg', inStock: true },
  { id: 'v4', name: 'Fresh Spinach', price: 25, image: '🥬', category: 'vegetables', quantity: '250 g', inStock: true },
  { id: 'v5', name: 'Carrots', price: 45, image: '🥕', category: 'vegetables', quantity: '500 g', inStock: true },
  { id: 'v6', name: 'Green Chillies', price: 15, image: '🌶️', category: 'vegetables', quantity: '100 g', inStock: true },

  // Dairy
  { id: 'd1', name: 'Full Cream Milk', price: 68, image: '🥛', category: 'dairy', quantity: '1 L', inStock: true },
  { id: 'd2', name: 'Curd (Dahi)', price: 45, image: '🍶', category: 'dairy', quantity: '400 g', inStock: true },
  { id: 'd3', name: 'Paneer', price: 90, image: '🧀', category: 'dairy', quantity: '200 g', inStock: true },
  { id: 'd4', name: 'Butter', price: 55, image: '🧈', category: 'dairy', quantity: '100 g', inStock: true },

  // Snacks
  { id: 's1', name: 'Potato Chips', price: 30, image: '🍟', category: 'snacks', quantity: '150 g', inStock: true },
  { id: 's2', name: 'Biscuits (Marie)', price: 25, image: '🍪', category: 'snacks', quantity: '250 g', inStock: true },
  { id: 's3', name: 'Namkeen Mix', price: 60, image: '🥜', category: 'snacks', quantity: '400 g', inStock: true },
  { id: 's4', name: 'Chocolate Bar', price: 45, image: '🍫', category: 'snacks', quantity: '100 g', inStock: true },

  // Staples
  { id: 'st1', name: 'Basmati Rice', price: 160, image: '🍚', category: 'staples', quantity: '1 kg', inStock: true },
  { id: 'st2', name: 'Wheat Flour (Atta)', price: 55, image: '🌾', category: 'staples', quantity: '1 kg', inStock: true },
  { id: 'st3', name: 'Toor Dal', price: 140, image: '🫘', category: 'staples', quantity: '1 kg', inStock: true },
  { id: 'st4', name: 'Sugar', price: 45, image: '🧂', category: 'staples', quantity: '1 kg', inStock: true },
  { id: 'st5', name: 'Cooking Oil', price: 180, image: '🫗', category: 'staples', quantity: '1 L', inStock: true },
];
