// src/features/seller/DeleteProductDialog.tsx

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { deleteProduct } from "@/api/products";
import type { Product } from "@/api/products";

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteProductDialog = ({
  product,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProductDialogProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product) return;

    setDeleting(true);
    try {
      const res = await deleteProduct(product.id);
      if (res.success) {
        onSuccess();        // Rafraîchit la liste des produits
        onOpenChange(false); // Ferme le dialog
      } else {
        alert(res.error || "Impossible de supprimer le produit");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur inattendue est survenue");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Êtes-vous sûr de vouloir supprimer définitivement le produit :
            <span className="font-semibold text-foreground block mt-2">
              "{product?.title ?? "Produit sans titre"}"
            </span>
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;