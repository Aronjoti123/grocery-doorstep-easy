import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cart, cartTotal, deliveryCharge, placeOrder, user } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const handleOrder = () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    const orderId = placeOrder(address, paymentMethod);
    toast.success(`Order ${orderId} placed successfully!`);
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="font-display font-bold text-xl text-foreground">Checkout</h1>

      {/* Order summary */}
      <div className="bg-card rounded-lg p-4 card-elevated">
        <h2 className="font-semibold text-sm text-foreground mb-3">Order Summary</h2>
        {cart.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">{item.product.image} {item.product.name} × {item.count}</span>
            <span className="text-foreground font-medium">₹{item.product.price * item.count}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Delivery</span><span>₹{deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-bold text-foreground">
            <span>Total</span><span>₹{cartTotal + deliveryCharge}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-foreground">Delivery Address</Label>
        <Input
          id="address"
          placeholder="Enter your full delivery address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      {/* Payment */}
      <div className="space-y-2">
        <Label className="text-foreground">Payment Method</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('cod')}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              paymentMethod === 'cod'
                ? 'border-primary bg-fresh-light'
                : 'border-border bg-card'
            }`}
          >
            <span className="text-2xl block mb-1">💵</span>
            <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
          </button>
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              paymentMethod === 'upi'
                ? 'border-primary bg-fresh-light'
                : 'border-border bg-card'
            }`}
          >
            <span className="text-2xl block mb-1">📱</span>
            <span className="text-sm font-medium text-foreground">UPI Payment</span>
          </button>
        </div>
      </div>

      <Button className="w-full h-12 font-semibold text-base" onClick={handleOrder}>
        Place Order — ₹{cartTotal + deliveryCharge}
      </Button>
    </div>
  );
};

export default CheckoutPage;
