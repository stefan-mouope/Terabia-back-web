// src/pages/features/buyer/ProductDetailPage.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { getProductById } from "@/api/products";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(id).then((res) => {
        if (res.success) {
          setProduct(res.data);
        } else {
          console.error("Produit non trouvé");
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold">Produit non trouvé</h2>
        <Button asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                <span className="text-gray-400">Pas d'image</span>
              </div>
            )}
            {product.stock < 10 && (
              <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-4 py-1">
                Stock limité ({product.stock} restants)
              </Badge>
            )}
          </div>

          {/* Infos */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-xl text-gray-600 mt-2">{product.price.toLocaleString()} FCFA / {product.unit}</p>
            </div>

            {product.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <User className="h-5 w-5 text-primary" />
                <span>Vendu par <strong>{product.seller_name || "Vendeur"}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{product.location_city}</span>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 text-lg" disabled={product.stock === 0}>
                <ShoppingCart className="mr-3 h-5 w-5" />
                {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={`/seller/${product.seller_id}`}>
                  Voir le vendeur
                </Link>
              </Button>
            </div>

            {/* Avis futurs */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold">4.8</span>
                  <span className="text-gray-600">(12 avis)</span>
                </div>
                <p className="text-sm text-gray-600">Les clients adorent ce produit !</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}