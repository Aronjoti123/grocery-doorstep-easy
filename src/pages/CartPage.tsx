import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, updateCartCount, removeFromCart, cartTotal, deliveryCharge, authUser } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-4">Add some fresh groceries!</p>
        <Link to="/"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="font-display font-bold text-xl text-foreground">Your Cart</h1>

      <div className="space-y-3">
        {cart.map(item => (
          <div key={item.product.id} className="bg-card rounded-lg p-4 card-elevated flex items-center gap-3">
            <span className="text-3xl">{item.product.image}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-card-foreground truncate">{item.product.name}</h3>
              <p className="text-xs text-muted-foreground">{item.product.quantity}</p>
              <p className="font-bold text-sm text-foreground mt-1">₹{item.product.price * item.count}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => updateCartCount(item.product.id, item.count - 1)}
                className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Minus className="w-3.5 h-3.5 text-foreground" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-foreground">{item.count}</span>
              <button onClick={() => updateCartCount(item.product.id, item.count + 1)}
                className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg p-4 card-elevated space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>₹{cartTotal}</span></div>
        <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery</span><span>₹{deliveryCharge}</span></div>
        <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground"><span>Total</span><span>₹{cartTotal + deliveryCharge}</span></div>
      </div>

      <Button className="w-full h-12 font-semibold text-base"
        onClick={() => authUser ? navigate('/checkout') : navigate('/login')}>
        {authUser ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Button>
    </div>
  );
};

export default CartPage;
