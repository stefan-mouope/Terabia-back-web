// src/features/seller/VendorStats.tsx

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,   // AJOUTÉ ICI !
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSellerStats, type SellerStats } from "@/api/users";

export default function VendorStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    getSellerStats(user.id)
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch(() => {
        // Optionnel : gérer l'erreur silencieusement ou afficher un toast
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Ventes totales",
      value: stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString()} FCFA` : "0 FCFA",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Produits actifs",
      value: stats?.activeProducts ?? 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Commandes",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-purple-600",
    },
    {
      title: "Total produits",
      value: stats?.totalProducts ?? 0,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, i) => (
        <Card key={i} className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-gray-100">
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">{card.title}</p>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}