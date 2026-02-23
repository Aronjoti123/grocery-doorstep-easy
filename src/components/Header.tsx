import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LayoutDashboard, Package, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { cartCount, authUser, isAdmin, signOut } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-14 max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🥬</span>
          <span className="font-display font-bold text-lg text-foreground">FreshCart</span>
        </Link>

        <div className="flex items-center gap-2">
          {authUser && !isAdmin && (
            <Link to="/orders">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-bounce-subtle">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}
          {authUser ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-1.5 text-muted-foreground">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
