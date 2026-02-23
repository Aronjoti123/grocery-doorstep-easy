import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { ORDER_STATUS_LABELS, OrderStatus } from '@/types/grocery';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, MapPin } from 'lucide-react';

const statusSteps: { key: OrderStatus; icon: React.ReactNode; label: string }[] = [
  { key: 'placed', icon: <CheckCircle2 className="w-5 h-5" />, label: 'Placed' },
  { key: 'packed', icon: <Package className="w-5 h-5" />, label: 'Packed' },
  { key: 'out_for_delivery', icon: <Truck className="w-5 h-5" />, label: 'On the Way' },
  { key: 'delivered', icon: <MapPin className="w-5 h-5" />, label: 'Delivered' },
];

const statusIndex: Record<OrderStatus, number> = { placed: 0, packed: 1, out_for_delivery: 2, delivered: 3 };

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl mb-2">📦</p>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Order not found</h2>
        <Link to="/"><Button>Go Home</Button></Link>
      </div>
    );
  }

  const currentIdx = statusIndex[order.status];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <p className="text-4xl mb-2">🎉</p>
        <h1 className="font-display font-bold text-xl text-foreground">Order Confirmed!</h1>
        <p className="text-sm text-muted-foreground mt-1">Order ID: {order.id}</p>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-lg p-6 card-elevated">
        <div className="flex justify-between relative">
          {/* Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
            style={{ width: `${(currentIdx / 3) * 100}%` }}
          />

          {statusSteps.map((step, i) => (
            <div key={step.key} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= currentIdx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step.icon}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                i <= currentIdx ? 'text-foreground' : 'text-muted-foreground'
              }`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-card rounded-lg p-4 card-elevated space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="text-foreground font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Address</span>
          <span className="text-foreground font-medium text-right max-w-[60%]">{order.address}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="text-foreground font-bold">₹{order.total}</span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-card rounded-lg p-4 card-elevated">
        <h3 className="font-semibold text-sm text-foreground mb-2">Items</h3>
        {order.items.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">{item.product.image} {item.product.name} × {item.count}</span>
            <span className="text-foreground">₹{item.product.price * item.count}</span>
          </div>
        ))}
      </div>

      <Link to="/" className="block">
        <Button variant="outline" className="w-full">Continue Shopping</Button>
      </Link>
    </div>
  );
};

export default OrderTrackingPage;
