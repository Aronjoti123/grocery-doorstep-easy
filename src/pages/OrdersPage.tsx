import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ORDER_STATUS_LABELS } from '@/types/grocery';
import { Package } from 'lucide-react';

const OrdersPage = () => {
  const { orders } = useApp();

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">No orders yet</h2>
        <Link to="/"><Button>Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="font-display font-bold text-xl text-foreground">My Orders</h1>
      {orders.map(order => (
        <Link to={`/order/${order.id}`} key={order.id}>
          <div className="bg-card rounded-lg p-4 card-elevated flex items-center justify-between hover:shadow-md transition-shadow mb-3">
            <div>
              <p className="font-semibold text-sm text-foreground">{order.id}</p>
              <p className="text-xs text-muted-foreground">{order.items.length} items · ₹{order.total}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              order.status === 'delivered' ? 'bg-primary/10 text-primary' :
              order.status === 'out_for_delivery' ? 'bg-accent/10 text-accent' :
              'bg-muted text-muted-foreground'
            }`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrdersPage;
