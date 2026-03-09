import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { OrderStatus } from '@/types/grocery';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, MapPin, Clock, CalendarDays, CreditCard, Phone, User, Navigation } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';

const statusSteps: { key: OrderStatus; icon: React.ReactNode; label: string; description: string }[] = [
  { key: 'placed', icon: <CheckCircle2 className="w-5 h-5" />, label: 'Placed', description: 'Your order has been received' },
  { key: 'packed', icon: <Package className="w-5 h-5" />, label: 'Packed', description: 'Items are packed & ready' },
  { key: 'out_for_delivery', icon: <Truck className="w-5 h-5" />, label: 'On the Way', description: 'Rider is heading to you' },
  { key: 'delivered', icon: <MapPin className="w-5 h-5" />, label: 'Delivered', description: 'Order delivered successfully' },
];

const statusIndex: Record<OrderStatus, number> = { placed: 0, packed: 1, out_for_delivery: 2, delivered: 3 };

// Simulated rider route points (lat, lng pairs representing a delivery path)
const routePoints = [
  { lat: 12.9716, lng: 77.5946, label: 'Store' },
  { lat: 12.9735, lng: 77.5980, label: '' },
  { lat: 12.9760, lng: 77.6010, label: '' },
  { lat: 12.9785, lng: 77.6035, label: '' },
  { lat: 12.9810, lng: 77.6055, label: '' },
  { lat: 12.9830, lng: 77.6080, label: '' },
  { lat: 12.9850, lng: 77.6100, label: 'Your Location' },
];

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();
  const order = orders.find(o => o.id === id);
  const [riderPosition, setRiderPosition] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);

  // Calculate real ETA minutes from order creation
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const updateEta = () => {
      const placed = new Date(order.createdAt).getTime();
      const etaEnd = placed + 45 * 60 * 1000;
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((etaEnd - now) / 60000));
      setMinutesLeft(remaining);

      // Simulate rider position based on elapsed time
      const elapsed = now - placed;
      const totalDuration = 45 * 60 * 1000;
      const progress = Math.min(elapsed / totalDuration, 1);
      const pointIndex = Math.min(Math.floor(progress * (routePoints.length - 1)), routePoints.length - 1);
      setRiderPosition(pointIndex);
    };

    updateEta();
    const interval = setInterval(updateEta, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [order]);

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
  const isOutForDelivery = order.status === 'out_for_delivery';
  const isDelivered = order.status === 'delivered';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-4xl mb-1">{isDelivered ? '✅' : '🎉'}</p>
        <h1 className="font-display font-bold text-xl text-foreground">
          {isDelivered ? 'Order Delivered!' : 'Order Confirmed!'}
        </h1>
        <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      {/* Live ETA Banner with countdown */}
      {!isDelivered && (
        <div className="bg-primary/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center relative">
              <Clock className="w-6 h-6 text-primary" />
              {isOutForDelivery && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Estimated Delivery</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl text-foreground">
                  {minutesLeft}
                </span>
                <span className="text-sm font-medium text-muted-foreground">min left</span>
              </div>
            </div>
            {isOutForDelivery && (
              <div className="flex flex-col items-center">
                <Navigation className="w-5 h-5 text-primary animate-bounce" />
                <span className="text-[10px] text-primary font-semibold mt-0.5">LIVE</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, ((45 - minutesLeft) / 45) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Order placed</span>
              <span>Arriving soon</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Map Tracker (simulated) */}
      {isOutForDelivery && (
        <div className="bg-card rounded-xl card-elevated overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Live Tracking
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </div>

          {/* Simulated map view */}
          <div className="relative h-48 bg-muted/50 mx-4 mb-4 rounded-lg overflow-hidden">
            {/* Grid lines for map feel */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(8)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full border-t border-foreground/20" style={{ top: `${(i + 1) * 12.5}%` }} />
              ))}
              {[...Array(8)].map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full border-l border-foreground/20" style={{ left: `${(i + 1) * 12.5}%` }} />
              ))}
            </div>

            {/* Route path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 180" preserveAspectRatio="none">
              {/* Full route (dashed) */}
              <path
                d="M 30,150 Q 80,130 120,100 T 200,60 T 270,30"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.3"
              />
              {/* Completed route */}
              <path
                d="M 30,150 Q 80,130 120,100 T 200,60 T 270,30"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${(riderPosition / (routePoints.length - 1)) * 400}`}
                strokeDashoffset="0"
              />
            </svg>

            {/* Store marker */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Package className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-foreground bg-card px-1.5 py-0.5 rounded shadow-sm">Store</span>
            </div>

            {/* Rider marker (animated) */}
            <div
              className="absolute transition-all duration-[2000ms] ease-in-out flex flex-col items-center"
              style={{
                left: `${15 + (riderPosition / (routePoints.length - 1)) * 70}%`,
                top: `${75 - (riderPosition / (routePoints.length - 1)) * 60}%`,
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 w-8 h-8 bg-accent/30 rounded-full animate-ping" />
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg z-10 relative">
                  <Truck className="w-4 h-4 text-accent-foreground" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-foreground bg-card px-1.5 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">
                🏍️ Rider · {minutesLeft}m away
              </span>
            </div>

            {/* Destination marker */}
            <div className="absolute top-3 right-4 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-foreground bg-card px-1.5 py-0.5 rounded shadow-sm">You</span>
              <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center shadow-lg">
                <MapPin className="w-3 h-3 text-destructive-foreground" />
              </div>
            </div>
          </div>

          {/* Rider info bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg">
                🏍️
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Delivery Partner</p>
                <p className="text-xs text-muted-foreground">On the way · {minutesLeft} min away</p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
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

            // Calculate timestamp for each step
            const stepTime = (() => {
              if (!isCompleted) return null;
              const base = new Date(order.createdAt).getTime();
              const offsets = [0, 8, 20, 45]; // minutes after placement
              return new Date(base + offsets[i] * 60000);
            })();

            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    isCompleted ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step.icon}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-10 my-1 transition-colors ${isCompleted && i < currentIdx ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
                <div className="pt-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                          Current
                        </span>
                      )}
                    </p>
                    {stepTime && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {stepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {isCurrent && !isDelivered && (
                    <p className="text-xs text-primary font-medium mt-0.5">~{minutesLeft} min remaining</p>
                  )}
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
