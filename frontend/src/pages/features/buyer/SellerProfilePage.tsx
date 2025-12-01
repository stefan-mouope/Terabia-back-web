// src/pages/features/buyer/SellerProfilePage.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, User, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { getProductsBySellerId } from "@/api/products";
import { getUserById } from "@/api/users"; // tu dois avoir cette fonction
import { ProductCard } from "../../../components/ProductCard";

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!id) return;

      try {
        // Récupérer les infos du vendeur
        const sellerRes = await getUserById(id);
        if (sellerRes.success) {
          setSeller(sellerRes.data);
        }

        // Récupérer ses produits
        const productsRes = await getProductsBySellerId(id);
        if (productsRes.success) {
          setProducts(productsRes.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement vendeur", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  // Note moyenne simulée (plus tard tu feras la vraie avec getReviewsByRevieweeId)
  const averageRating = 4.8;
  const totalReviews = 127;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold">Vendeur non trouvé</h2>
        <Button asChild>
          <Link to="/"><ArrowLeft className="mr-2" /> Retour</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Bouton retour */}
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </Button>

        {/* En-tête vendeur */}
        <Card className="mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 h-32"></div>
          <div className="relative px-8 pb-8 -mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl overflow-hidden">
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-gray-900">{seller.name}</h1>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="text-lg text-gray-700">{seller.city || "Cameroun"}</span>
                </div>

                {/* Note */}
                <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(averageRating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">{averageRating}</span>
                  <span className="text-gray-600">({totalReviews} avis)</span>
                </div>
              </div>

              {/* Boutons contact */}
              <div className="flex gap-3">
                <Button size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Appeler
                </Button>
                <Button size="lg" variant="outline">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Separator className="mb-10" />

        {/* Produits du vendeur */}
        <div>
          <h2 className="text-3xl font-bold mb-8">
            Produits de {seller.name} ({products.length})
          </h2>

          {products.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-xl text-gray-600">Ce vendeur n'a pas encore de produits</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  unit={product.unit}
                  image={product.images?.[0] || "/placeholder.svg"}
                  location={product.location_city}
                  vendor={seller.name}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}