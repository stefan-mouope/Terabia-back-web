// src/features/seller/ProductFormModal.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { createProduct, updateProduct, Product } from "@/api/products";
import { getAllCategories, Category } from "@/api/categories";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  product?: Product | null; // Produit à modifier (ou null = ajout)
}

export default function ProductFormModal({
  open,
  onOpenChange,
  onSuccess,
  product,
}: Props) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // État du formulaire
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    unit: "kg",
    category_id: "",
    location_city: user?.city || "",
  });

  // Charger les catégories une seule fois
  useEffect(() => {
    getAllCategories().then((res) => {
      if (res.success) setCategories(res.data || []);
    });
  }, []);

  // METTRE À JOUR LE FORMULAIRE QUAND LE PRODUIT CHANGE OU QUAND LE MODAL S’OUVRE
  useEffect(() => {
    if (open) {
      if (product) {
        // Mode édition → on pré-remplit avec les données du produit
        setForm({
          title: product.title,
          description: product.description || "",
          price: product.price.toString(),
          stock: product.stock.toString(),
          unit: product.unit || "kg",
          category_id: product.category_id.toString(),
          location_city: product.location_city || user?.city || "",
        });
      } else {
        // Mode ajout → on réinitialise
        setForm({
          title: "",
          description: "",
          price: "",
          stock: "",
          unit: "kg",
          category_id: "",
          location_city: user?.city || "",
        });
      }
    }
  }, [product, open, user?.city]); // Clé : dépend de `open` et `product`

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.stock || !form.category_id) {
      alert("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        unit: form.unit,
        category_id: parseInt(form.category_id),
        location_city: form.location_city,
      };

      if (product) {
        await updateProduct(product.id, payload);
        alert("Produit modifié avec succès !");
      } else {
        await createProduct({ ...payload, seller_id: user!.id });
        alert("Produit ajouté avec succès !");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      alert(err.error || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {product ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Titre <span className="text-red-500">*</span></Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Tomates fraîches"
              />
            </div>
            <div>
              <Label>Prix (FCFA) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="15000"
              />
            </div>
          </div>

          <div>
            <Label>Description (optionnel)</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Décrivez votre produit..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <Label>Stock <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="50"
              />
            </div>
            <div>
              <Label>Unité</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="kg, pièce, botte..."
              />
            </div>
            <div>
              <Label>Ville</Label>
              <Input
                value={form.location_city}
                onChange={(e) => setForm({ ...form, location_city: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Catégorie <span className="text-red-500">*</span></Label>
            <Select
              value={form.category_id}
              onValueChange={(v) => setForm({ ...form, category_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Enregistrer les modifications" : "Ajouter le produit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}