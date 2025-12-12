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
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct, updateProduct, Product } from "@/api/products";
import { getAllCategories, Category } from "@/api/categories";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  product?: Product | null;
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

  // Formulaires texte
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    unit: "kg",
    category_id: "",
    location_city: user?.city || "",
  });

  // Gestion des images
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Charger les catégories
  useEffect(() => {
    getAllCategories().then((res) => {
      if (res.success) setCategories(res.data || []);
    });
  }, []);

  // Reset + pré-remplissage quand le modal s’ouvre ou que le produit change
  useEffect(() => {
    if (open) {
      if (product) {
        // Mode édition
        setForm({
          title: product.title,
          description: product.description || "",
          price: product.price.toString(),
          stock: product.stock.toString(),
          unit: product.unit || "kg",
          category_id: product.category_id.toString(),
          location_city: product.location_city || user?.city || "",
        });

        // Afficher les anciennes images (URL du serveur)
        setImagePreviews(product.images || []);
        setSelectedImages([]); // On garde les anciennes, on n’ajoute pas de nouveaux fichiers par défaut
      } else {
        // Mode création
        setForm({
          title: "",
          description: "",
          price: "",
          stock: "",
          unit: "kg",
          category_id: "",
          location_city: user?.city || "",
        });
        setSelectedImages([]);
        setImagePreviews([]);
      }
    }
  }, [product, open, user?.city]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length + (product?.images?.length || 0) > 10) {
      alert("Maximum 10 images autorisées");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.stock || !form.category_id) {
      alert("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Champs texte
    formData.append("title", form.title);
    formData.append("description", form.description || "");
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("unit", form.unit);
    formData.append("category_id", form.category_id);
    formData.append("location_city", form.location_city);

    if (!product) {
      formData.append("seller_id", user!.id);
    }

    // Nouvelles images sélectionnées
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      if (product) {
        await updateProduct(product.id, formData);
        alert("Produit modifié avec succès !");
      } else {
        await createProduct(formData);
        alert("Produit ajouté avec succès !");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert(err.error || "Erreur lors de l’enregistrement");
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
          {/* Titre + Prix */}
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

          {/* Description */}
          <div>
            <Label>Description (optionnel)</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Décrivez votre produit..."
            />
          </div>

          {/* Stock, Unité, Ville */}
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

          {/* Catégorie */}
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

          {/* Upload Images */}
          <div>
            <Label>Images du produit (max 10)</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="cursor-pointer"
            />

            {/* Aperçus */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src.startsWith("blob:") || src.startsWith("data:") ? src : `${import.meta.env.VITE_API_URL}${src}`}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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