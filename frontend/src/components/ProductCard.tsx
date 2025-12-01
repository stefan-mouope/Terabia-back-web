// src/components/ui/ProductCard.tsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cartStore";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  location: string;
  vendor: string;
  category?: string;
  stock?: number;
  seller_id?: string; // optionnel, tu pourras l’ajouter plus tard
}

export const ProductCard = ({
  id,
  name,
  price,
  unit,
  image,
  location,
  vendor,
  category,
  stock,
  seller_id,
}: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    console.log("asdfghjkl;ghgjkl;cvhbjnkml,cvbnm,")
    addItem({
      id,
      title: name,
      price,
      unit,
      image: image || "/placeholder.jpg",
      seller_id: seller_id || "unknown",
      seller_name: vendor,
      quantity: 1,
    });
    // Optionnel : tu pourras ajouter un toast plus tard
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden aspect-square bg-muted">
          <img
            src={image || "/placeholder.jpg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {category}
            </Badge>
          )}
          {stock !== undefined && stock < 10 && stock > 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Stock limité
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="secondary" className="absolute inset-0 m-auto w-fit px-4 py-2 text-lg font-bold">
              Rupture
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">{price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">FCFA /{unit}</span>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span className="line-clamp-1">{vendor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" size="sm" asChild>
          <Link to={`/product/${id}`}>Voir détails</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
           onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
          disabled={stock === 0}
          
        >
          
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};