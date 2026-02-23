import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products as initialProducts } from '@/data/products';
import { ORDER_STATUS_LABELS, OrderStatus, Product, Category, CATEGORY_LABELS } from '@/types/grocery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
  const { isAdmin, orders, updateOrderStatus } = useApp();
  const [managedProducts, setManagedProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('fruits');
  const [newQuantity, setNewQuantity] = useState('');
  const [newEmoji, setNewEmoji] = useState('🛒');

  if (!isAdmin) return <Navigate to="/login" replace />;

  const handleAddProduct = () => {
    if (!newName || !newPrice || !newQuantity) {
      toast.error('Fill all fields');
      return;
    }
    const product: Product = {
      id: 'p-' + Date.now(),
      name: newName,
      price: parseFloat(newPrice),
      category: newCategory,
      quantity: newQuantity,
      image: newEmoji,
      inStock: true,
    };
    setManagedProducts(prev => [...prev, product]);
    setNewName(''); setNewPrice(''); setNewQuantity(''); setNewEmoji('🛒');
    toast.success('Product added!');
  };

  const toggleStock = (id: string) => {
    setManagedProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display font-bold text-2xl text-foreground mb-6">🔧 Admin Panel</h1>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add">Add Product</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-card rounded-lg p-4 card-elevated space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName} · {order.customerPhone}</p>
                    <p className="text-xs text-muted-foreground">{order.address}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-foreground">₹{order.total}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.items.map(i => `${i.product.name} ×${i.count}`).join(', ')}
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Status:</Label>
                  <Select
                    value={order.status}
                    onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
                  >
                    <SelectTrigger className="w-48 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map(s => (
                        <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-2">
          {managedProducts.map(p => (
            <div key={p.id} className="bg-card rounded-lg p-3 card-elevated flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.image}</span>
                <div>
                  <p className="font-medium text-sm text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">₹{p.price} · {p.quantity}</p>
                </div>
              </div>
              <Button
                variant={p.inStock ? 'outline' : 'destructive'}
                size="sm"
                className="text-xs"
                onClick={() => toggleStock(p.id)}
              >
                {p.inStock ? 'In Stock' : 'Out of Stock'}
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Add Product Tab */}
        <TabsContent value="add" className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label className="text-foreground">Product Name</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Fresh Tomatoes" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-foreground">Price (₹)</Label>
              <Input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="50" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Quantity</Label>
              <Input value={newQuantity} onChange={e => setNewQuantity(e.target.value)} placeholder="1 kg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-foreground">Category</Label>
              <Select value={newCategory} onValueChange={v => setNewCategory(v as Category)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as Category[]).map(c => (
                    <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Emoji</Label>
              <Input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} placeholder="🍅" />
            </div>
          </div>
          <Button onClick={handleAddProduct} className="w-full">Add Product</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
