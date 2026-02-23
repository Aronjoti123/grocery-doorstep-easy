import { useState, useMemo } from 'react';
import { Category } from '@/types/grocery';
import { products } from '@/data/products';
import { useApp } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import CategoryBar from '@/components/CategoryBar';
import SearchBar from '@/components/SearchBar';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [sortPrice, setSortPrice] = useState<'none' | 'asc' | 'desc'>('none');
  const [stockOnly, setStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (stockOnly) result = result.filter(p => p.inStock);
    if (sortPrice === 'asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortPrice === 'desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, search, sortPrice, stockOnly]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="fresh-gradient px-4 py-8 text-center">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-foreground mb-1">
          Fresh groceries,<br />delivered fast 🚀
        </h1>
        <p className="text-primary-foreground/80 text-sm">
          Quality essentials at your doorstep in minutes
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryBar selected={category} onSelect={setCategory} />

        {/* Filter controls */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => setSortPrice(s => s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none')}
          >
            <ArrowUpDown className="w-3 h-3" />
            Price {sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : ''}
          </Button>
          <Button
            variant={stockOnly ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => setStockOnly(!stockOnly)}
          >
            In Stock Only
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🔍</p>
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
