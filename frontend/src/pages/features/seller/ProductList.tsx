// src/features/seller/ProductList.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsBySellerId, Product } from "@/api/products";
import DeleteProductDialog from "./DeleteProductDialog";

interface Props {
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export default function ProductList({ onEdit, onRefresh }: Props) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (user) {
      getProductsBySellerId(user.id).then(res => {
        if (res.success) setProducts(res.data || []);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <Card><CardContent><p>Chargement...</p></CardContent></Card>;

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Mes produits ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center py-16 text-gray-500">Aucun produit pour le moment</p>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50">
                  <div className="flex items-center gap-5">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                    <div>
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="font-medium text-green-600">{product.price} FCFA/{product.unit}</span>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Actif" : "Inactif"}
                        </Badge>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <Button variant="ghost" size="icon" asChild>
                      <Link to={`/product/${product.id}`}><Eye className="w-5 h-5" /></Link>
                    </Button> */}
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setProductToDelete(product)}>
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteProductDialog
        product={productToDelete}
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        onSuccess={onRefresh}
      />
    </>
  );
}