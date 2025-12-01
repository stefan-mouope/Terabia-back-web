// src/components/ProtectedRoute.tsx

import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // ex: ['seller', 'delivery']
  requireAuth?: boolean;   // si true → doit être connecté (même sans rôle spécifique)
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Pendant le chargement → écran blanc ou spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Pas connecté mais la route est protégée ?
  if (!isAuthenticated && requireAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Connecté mais pas le bon rôle ?
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirection intelligente selon le rôle
    if (user.role === "seller") return <Navigate to="/vendor-dashboard" replace />;
    if (user.role === "delivery") return <Navigate to="/delivery-dashboard" replace />;
    if (user.role === "buyer") return <Navigate to="/" replace />;
    
    // Par défaut → accueil
    return <Navigate to="/" replace />;
  }

  // Tout est bon → on affiche la page
  return <>{children}</>;
};

export default ProtectedRoute;