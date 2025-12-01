import { useEffect, useState } from "react";
import { Package, MapPinHouse, Phone, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllOrders, updateOrder } from "@/api/orders";
import { useAuth } from "@/contexts/AuthContext";

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  title?: string;
}

interface Order {
  id: number;
  order_number: string;
  items: OrderItem[];
  total: number;
  delivery_address: string;
  delivery_city: string;
  buyer_notes?: string;
  created_at: string;
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPendingOrders = async () => {
    try {
      const res = await getAllOrders();
      if (res.success) {
        const pending = res.data.filter(
          (o: any) => o.status === "pending_delivery" || o.status === "pending"
        );
        setOrders(pending);
      }
    } catch (err) {
      console.error("Erreur récupération commandes livreur", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 10000); // toutes les 10s
    return () => clearInterval(interval);
  }, []);

  const acceptDelivery = async (orderId: number) => {
    if (!user?.id) {
      alert("Vous devez être connecté");
      return;
    }

    try {
      const res = await updateOrder(orderId.toString(), {
        status: "in_delivery",
        delivery_person_id: user.id,
        delivery_person_name: user.name || user.phone || "Livreur",
      });

      if (res.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        // Optionnel : toast ou son
        alert("Livraison acceptée ! Rendez-vous chez le client !");
      }
    } catch (err) {
      alert("Erreur lors de l'acceptation");
    }
  };

  if (loading) {
    return <div className="text-center py-20">Chargement des commandes...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Package className="w-10 h-10 text-primary" />
            Commandes à livrer
          </h1>
          <p className="text-muted-foreground mt-2">
            Acceptez une mission et gagnez de l'argent !
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-4 opacity-30">
                <Package className="w-full h-full" />
              </div>
              <p className="text-xl text-muted-foreground">
                Aucune commande disponible pour le moment
              </p>
              <p className="text-sm mt-2">Revenez dans quelques minutes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Commande #{order.order_number}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(order.created_at).toLocaleTimeString()}
                      </Badge>
                    </div>
                    <Badge variant="default">{order.items.length} article{order.items.length > 1 ? "s" : ""}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinHouse className="w-4 h-4 text-primary" />
                    <span>{order.delivery_address}, {order.delivery_city}</span>
                  </div>

                  {order.buyer_notes && (
                    <div className="text-sm text-muted-foreground italic">
                      Note : "{order.buyer_notes}"
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-2xl font-bold text-primary">
                      {order.total.toLocaleString()} FCFA
                    </div>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => acceptDelivery(order.id)}
                    >
                      Accepter la livraison
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}