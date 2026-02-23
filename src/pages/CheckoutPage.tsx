import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cart, cartTotal, deliveryCharge, placeOrder, profile } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState(profile?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) { navigate('/'); return null; }

  const handleOrder = async () => {
    if (!address.trim()) { toast.error('Please enter a delivery address'); return; }
    setSubmitting(true);
    const orderId = await placeOrder(address, paymentMethod);
    setSubmitting(false);
    if (orderId) {
      toast.success('Order placed successfully!');
      navigate(`/order/${orderId}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="font-display font-bold text-xl text-foreground">Checkout</h1>

      <div className="bg-card rounded-lg p-4 card-elevated">
        <h2 className="font-semibold text-sm text-foreground mb-3">Order Summary</h2>
        {cart.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">{item.product.image} {item.product.name} × {item.count}</span>
            <span className="text-foreground font-medium">₹{item.product.price * item.count}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery</span><span>₹{deliveryCharge}</span></div>
          <div className="flex justify-between font-bold text-foreground"><span>Total</span><span>₹{cartTotal + deliveryCharge}</span></div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-foreground">Delivery Address</Label>
        <Input id="address" placeholder="Enter your full delivery address" value={address} onChange={e => setAddress(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Payment Method</Label>
        <div className="grid grid-cols-2 gap-3">
          {(['cod', 'upi'] as const).map(m => (
            <button key={m} onClick={() => setPaymentMethod(m)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${paymentMethod === m ? 'border-primary bg-fresh-light' : 'border-border bg-card'}`}>
              <span className="text-2xl block mb-1">{m === 'cod' ? '💵' : '📱'}</span>
              <span className="text-sm font-medium text-foreground">{m === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</span>
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full h-12 font-semibold text-base" onClick={handleOrder} disabled={submitting}>
        {submitting ? 'Placing Order...' : `Place Order — ₹${cartTotal + deliveryCharge}`}
      </Button>
    </div>
  );
};

export default CheckoutPage;
