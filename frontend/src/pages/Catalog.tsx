import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect
import { getAllProducts, Product } from "@/api/products"; // Import API for products
import { getAllCategories, Category } from "@/api/categories"; // Import API for categories

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // State for fetched products
  const [categories, setCategories] = useState<Category[]>([]); // State for fetched categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsResult = await getAllProducts();
        const categoriesResult = await getAllCategories();

        if (productsResult.success && productsResult.data) {
          setProducts(productsResult.data);
        } else {
          setError(productsResult.error || "Erreur lors du chargement des produits.");
        }

        if (categoriesResult.success && categoriesResult.data) {
          // Add "Tous" as a default category option at the beginning
          setCategories([{ id: 0, name: "Tous", slug: "tous" }, ...categoriesResult.data]);
        } else {
          setError(categoriesResult.error || "Erreur lors du chargement des catégories.");
        }
      } catch (err: any) {
        setError(err.message || "Une erreur inattendue est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    // Assuming category_id matches with category.id, and we need category name for filtering
    const matchesCategory = selectedCategory === "Tous" ||
                            categories.find(cat => cat.id === product.category_id)?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    // Implement other sorting logic if needed
    return 0;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p>Chargement des produits...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p className="text-destructive">Erreur: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Catalogue des produits
            </h1>
            <p className="text-muted-foreground">
              Découvrez les meilleurs produits locaux de nos agriculteurs
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="mb-8 space-y-4 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un produit ou vendeur..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="md:hidden h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Categories */}
            <div className={`flex flex-wrap gap-2 ${!showFilters && 'hidden md:flex'}`}>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                unit={product.unit}
                image={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"} // Use first image or placeholder
                location={product.location_city}
                vendor={"Nom du vendeur"} // You might need to fetch seller name separately if not eager loaded
                category={categories.find(cat => cat.id === product.category_id)?.name}
                stock={product.stock}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Aucun produit ne correspond à votre recherche
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Tous");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
