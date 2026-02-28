import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { OrderStatus } from '@/types/grocery';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, MapPin, Clock, CalendarDays, CreditCard, Phone, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const statusSteps: { key: OrderStatus; icon: React.ReactNode; label: string; description: string }[] = [
  { key: 'placed', icon: <CheckCircle2 className="w-5 h-5" />, label: 'Placed', description: 'Your order has been received' },
  { key: 'packed', icon: <Package className="w-5 h-5" />, label: 'Packed', description: 'Items are packed & ready' },
  { key: 'out_for_delivery', icon: <Truck className="w-5 h-5" />, label: 'On the Way', description: 'Rider is heading to you' },
  { key: 'delivered', icon: <MapPin className="w-5 h-5" />, label: 'Delivered', description: 'Order delivered successfully' },
];

const statusIndex: Record<OrderStatus, number> = { placed: 0, packed: 1, out_for_delivery: 2, delivered: 3 };

const getEstimatedDelivery = (createdAt: string, status: OrderStatus) => {
  const placed = new Date(createdAt);
  const eta = new Date(placed.getTime() + 45 * 60 * 1000); // 45 min from placed
  if (status === 'delivered') return 'Delivered';
  return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl mb-2">📦</p>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Order not found</h2>
        <p className="text-sm text-muted-foreground mb-4">It may still be loading.</p>
        <Link to="/orders"><Button variant="outline">View All Orders</Button></Link>
        <Link to="/" className="mt-2"><Button>Go Home</Button></Link>
      </div>
    );
  }

  const currentIdx = statusIndex[order.status];
  const placedDate = new Date(order.createdAt);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-4xl mb-1">{order.status === 'delivered' ? '✅' : '🎉'}</p>
        <h1 className="font-display font-bold text-xl text-foreground">
          {order.status === 'delivered' ? 'Order Delivered!' : 'Order Confirmed!'}
        </h1>
        <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      {/* ETA Banner */}
      {order.status !== 'delivered' && (
        <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estimated Delivery</p>
            <p className="font-display font-bold text-lg text-foreground">
              {getEstimatedDelivery(order.createdAt, order.status)}
            </p>
          </div>
        </div>
      )}

      {/* Status Timeline - Vertical */}
      <div className="bg-card rounded-xl p-5 card-elevated">
        <h3 className="font-display font-semibold text-sm text-foreground mb-4">Order Progress</h3>
        <div className="space-y-0">
          {statusSteps.map((step, i) => {
            const isCompleted = i <= currentIdx;
            const isCurrent = i === currentIdx;
            const isLast = i === statusSteps.length - 1;
            return (
              <div key={step.key} className="flex gap-3">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    isCompleted ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step.icon}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-8 my-1 transition-colors ${isCompleted && i < currentIdx ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
                {/* Label */}
                <div className="pt-1">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-card rounded-xl p-4 card-elevated space-y-3">
        <h3 className="font-display font-semibold text-sm text-foreground">Order Details</h3>
        <div className="space-y-2">
          <DetailRow icon={<CalendarDays className="w-4 h-4" />} label="Ordered" value={placedDate.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + placedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
          <DetailRow icon={<CreditCard className="w-4 h-4" />} label="Payment" value={order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'} />
          <DetailRow icon={<MapPin className="w-4 h-4" />} label="Address" value={order.address} />
          {order.customerName && <DetailRow icon={<User className="w-4 h-4" />} label="Name" value={order.customerName} />}
          {order.customerPhone && <DetailRow icon={<Phone className="w-4 h-4" />} label="Phone" value={order.customerPhone} />}
        </div>
      </div>

      {/* Items */}
      <div className="bg-card rounded-xl p-4 card-elevated">
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          Items ({order.items.reduce((s, i) => s + i.count, 0)})
        </h3>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.product.id} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.product.image}</span>
                <div>
                  <p className="text-sm text-foreground">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.count} × ₹{item.product.price}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">₹{item.product.price * item.count}</span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal</span><span>₹{order.total - order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Delivery</span><span>₹{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-foreground pt-1">
            <span>Total</span><span>₹{order.total}</span>
          </div>
        </div>
      </div>

      <Link to="/" className="block">
        <Button variant="outline" className="w-full">Continue Shopping</Button>
      </Link>
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
    <span className="text-muted-foreground shrink-0 w-16">{label}</span>
    <span className="text-foreground font-medium text-right flex-1">{value}</span>
  </div>
);

export default OrderTrackingPage;
