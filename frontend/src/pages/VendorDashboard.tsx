// src/pages/VendorDashboard.tsx

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import VendorStats from "../pages/features/seller/VendorStats";
import ProductList from "../pages/features/seller/ProductList";
import ProductFormModal from "../pages/features/seller/ProductFormModal";
import type { Product } from "@/api/products";

export default function VendorDashboard() {
  const { user } = useAuth();

  // État pour rafraîchir les composants (stats + liste)
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  // État pour le modal + le produit en cours d'édition
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fonction appelée quand on clique sur le crayon dans la liste
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Fermeture du modal → on remet tout à zéro
  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingProduct(null); // Important : vide le produit à l'édition
    }
  };

  // Protection d'accès
  if (user?.role !== "seller") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">Accès refusé – Réservé aux vendeurs</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Tableau de bord vendeur</h1>
            <p className="text-gray-600 mt-2">Bonjour, {user?.name ?? "Vendeur"}</p>
          </div>

          {/* Bouton Ajouter */}
          <Button
            onClick={() => {
              setEditingProduct(null); // Mode création
              setModalOpen(true);
            }}
            size="lg"
            className="shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un produit
          </Button>
        </div>

        {/* Stats */}
        <VendorStats key={refreshTrigger} />

        {/* Liste des produits */}
        <ProductList
          key={`list-${refreshTrigger}`}
          onEdit={handleEdit}           // On passe la fonction qui ouvre le modal avec le produit
          onRefresh={refreshData}
        />
      </main>

      {/* Modal unique pour Ajout ET Édition */}
      <ProductFormModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        onSuccess={refreshData}
        product={editingProduct}   // Le produit à éditer (ou null = ajout)
      />

      <Footer />
    </div>
  );
}