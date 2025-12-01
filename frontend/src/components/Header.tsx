// src/components/layout/Header.tsx (ou où tu l’as mis)

import { Link }from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Menu,
  Sprout,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/store/cartStore"; // ← AJOUT CLÉ !

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Récupère uniquement ce dont tu as besoin du panier
  const itemsCount = useCart((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">
              Terabia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/catalog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Produits
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              À propos
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Espace Vendeur
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Icône panier avec badge dynamique */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/login")}
              aria-label={`Panier (${itemsCount} articles)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-in fade-in zoom-in duration-200">
                  {itemsCount > 99 ? "99+" : itemsCount}
                </span>
              )}
            </Button>

            {/* Auth buttons - Desktop */}
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={() =>
                    navigate(user?.role === "seller" ? "/login" : "/")
                  }
                >
                  <User className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="hidden md:flex"
                  onClick={() => navigate("/login")}
                >
                  Connexion
                </Button>
                <Button
                  variant="outline"
                  className="hidden md:flex"
                  onClick={() => navigate("/signup")}
                >
                  S'inscrire
                </Button>
              </>
            )}

            {/* Menu burger mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-3">
              <Link
                to="/catalog"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                to="/about"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/vendor-dashboard"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Espace Vendeur
              </Link>
            </div>

            <div className="flex gap-3 pt-3">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              ) : (
                <>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                  >
                    S'inscrire
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};