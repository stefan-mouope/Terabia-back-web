// src/pages/features/buyer/CartPage.tsx

import {Button} from "@/components/ui/button";
import { useCart } from "@/store/cartStore";
import { createOrder } from "@/api/orders"; // ← ton fichier API
import { Trash2, CheckCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function CartPage() {
  const { items, removeItem, getTotalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

const handleCheckout = async () => {

  if (!user?.id) {
    alert("Connectez-vous pour commander");
    navigate("/login");
    return;
  }

  if (!confirm(`Confirmer la commande de ${getTotalPrice().toLocaleString()} FCFA ?`)) return;

  setIsLoading(true);

  try {
    const orderData = {
    buyer_id: user.id,
    items: items.map((i) => ({
        product_id: i.id,
        quantity: i.quantity,
        price: i.price,
    })),
    total: getTotalPrice(),
    subtotal: getTotalPrice(),           // AJOUTÉ
    delivery_fee: 0,                     // AJOUTÉ (facultatif mais propre)
    delivery_address: "Adresse par défaut",
    delivery_city: "Yaoundé",
    };

    console.log("Envoi commande :", orderData);

    await createOrder(orderData);

    clearCart();
    setOrderSuccess(true);
  } catch (err: any) {
    console.error("Erreur :", err.response?.data || err);
    alert("Erreur : " + (err.response?.data?.error || "Impossible de passer commande"));
  } finally {
    setIsLoading(false);
  }
};




  // Écran de succès
  if (orderSuccess) {
    return (
      <div className="container mx-auto py-20 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Commande envoyée !
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Un livreur est en route vers chez vous
        </p>
        <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <ShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-30" />
        <p className="text-2xl text-muted-foreground">Votre panier est vide</p>
        <Button className="mt-6" onClick={() => navigate("/catalog")}>
          Voir les produits
        </Button>
      </div>
    );
  }

  // Panier normal
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-10">Mon panier</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-6 p-6 bg-card rounded-lg border shadow-sm"
          >
            <img
              src={item.image || "/placeholder.jpg"}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-md"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.seller_name} • {item.price.toLocaleString()} FCFA × {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {(item.price * item.quantity).toLocaleString()} FCFA
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              className="ml-4"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-card p-8 rounded-lg border text-right">
        <p className="text-3xl font-bold text-primary">
          Total : {getTotalPrice().toLocaleString()} FCFA
        </p>

        <Button
          size="lg"
          className="mt-6 w-full sm:w-auto px-12"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>Envoi en cours...</>
          ) : (
            <>Commander maintenant</>
          )}
        </Button>
      </div>
    </div>
  );
}