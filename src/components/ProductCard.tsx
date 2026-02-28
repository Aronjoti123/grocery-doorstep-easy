import { Product } from '@/types/grocery';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { cart, addToCart, updateCartCount } = useApp();
  const cartItem = cart.find(i => i.product.id === product.id);
  const count = cartItem?.count || 0;

  return (
    <div className="bg-card rounded-lg p-3 card-elevated flex flex-col animate-fade-in">
      <Link to={`/product/${product.id}`}>
        <div className="text-5xl text-center py-4 bg-fresh-light rounded-lg mb-3 hover:scale-105 transition-transform">
          {product.image}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.quantity}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold text-foreground">₹{product.price}</span>
        {!product.inStock ? (
          <span className="text-xs text-destructive font-medium">Out of stock</span>
        ) : count === 0 ? (
          <Button
            size="sm"
            className="h-8 px-3 text-xs font-semibold"
            onClick={() => addToCart(product)}
          >
            ADD
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateCartCount(product.id, count - 1)}
              className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-foreground">{count}</span>
            <button
              onClick={() => updateCartCount(product.id, count + 1)}
              className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
