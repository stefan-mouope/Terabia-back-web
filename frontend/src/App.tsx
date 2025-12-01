// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import CartPage from "./pages/features/buyer/CartPage";
import ProductDetailPage from "./pages/features/buyer/ProductDetailPage";
import SellerProfilePage from "./pages/features/buyer/SellerProfilePage";

import VendorDashboard from "./pages/VendorDashboard";
import DeliveryDashboard from "./pages/features/delivery/DeliveryDashboard";

import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import SignupBuyer from "./pages/SignupBuyer";
import SignupSeller from "./pages/SignupSeller";
import SignupDelivery from "./pages/SignupDelivery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* === Routes PUBLIQUES (toujours accessibles) === */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<RoleSelection />} />
            <Route path="/signup/buyer" element={<SignupBuyer />} />
            <Route path="/signup/seller" element={<SignupSeller />} />
            <Route path="/signup/delivery" element={<SignupDelivery />} />

            {/* === Routes ACHETEURS (connecté ou pas) === */}
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/seller/:id" element={<SellerProfilePage />} />

            {/* === Routes PROTÉGÉES === */}

            {/* Panier : doit être connecté */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute requireAuth={true}>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Vendeur */}
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Livreur */}
            <Route
              path="/delivery-dashboard"
              element={
                <ProtectedRoute allowedRoles={["delivery"]}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;