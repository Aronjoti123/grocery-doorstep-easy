import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { CATEGORY_LABELS } from '@/types/grocery';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, cart, addToCart, updateCartCount, loadingProducts } = useApp();
  const product = products.find(p => p.id === id);
  const cartItem = cart.find(i => i.product.id === id);
  const count = cartItem?.count || 0;

  if (loadingProducts) {
    return <div className="text-center py-20 text-muted-foreground">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl mb-2">🔍</p>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Product not found</h2>
        <Link to="/"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.inStock)
    .slice(0, 4);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      {/* Product hero */}
      <div className="bg-fresh-light rounded-2xl p-8 text-center">
        <span className="text-8xl block">{product.image}</span>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{product.quantity}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {CATEGORY_LABELS[product.category]}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-extrabold text-3xl text-foreground">₹{product.price}</span>
          {!product.inStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : count === 0 ? (
            <Button onClick={() => addToCart(product)} className="gap-2">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartCount(product.id, count - 1)}
                className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-lg font-bold text-foreground">{count}</span>
              <button
                onClick={() => updateCartCount(product.id, count + 1)}
                className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="font-display font-semibold text-sm text-foreground">About this product</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </>
      )}

      {/* Product details card */}
      <div className="bg-card rounded-xl p-4 card-elevated space-y-2">
        <h2 className="font-display font-semibold text-sm text-foreground">Details</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Category</span>
          <span className="text-foreground font-medium text-right">{CATEGORY_LABELS[product.category]}</span>
          <span className="text-muted-foreground">Pack Size</span>
          <span className="text-foreground font-medium text-right">{product.quantity}</span>
          <span className="text-muted-foreground">Price</span>
          <span className="text-foreground font-medium text-right">₹{product.price}</span>
          <span className="text-muted-foreground">Availability</span>
          <span className={`font-medium text-right ${product.inStock ? 'text-primary' : 'text-destructive'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-sm text-foreground">You might also like</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {relatedProducts.map(rp => (
              <Link key={rp.id} to={`/product/${rp.id}`}
                className="shrink-0 w-32 bg-card rounded-lg p-3 card-elevated text-center hover:shadow-md transition-shadow">
                <span className="text-3xl block mb-2">{rp.image}</span>
                <p className="text-xs font-medium text-foreground truncate">{rp.name}</p>
                <p className="text-xs font-bold text-foreground mt-1">₹{rp.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
