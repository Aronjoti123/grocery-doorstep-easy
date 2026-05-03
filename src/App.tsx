import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />

        <HashRouter>
          <Header />

          <Routes>
            {/* First open login page */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login page */}
            <Route path="/login" element={<LoginPage />} />

            {/* After login go here */}
            <Route path="/home" element={<Index />} />

            {/* Other pages */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Wrong link goes login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;