import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  MapPin, 
  Shield,
  Users,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-market.jpg";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <img 
              src={heroImage} 
              alt="Marché agricole" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl animate-fade-in">
              <Badge className="mb-6 bg-accent text-accent-foreground">
                Marketplace Agricole Direct Producteur
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Connectez-vous directement aux producteurs locaux
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                Terabia élimine les intermédiaires pour offrir aux agriculteurs des revenus équitables 
                et aux acheteurs des produits frais au meilleur prix.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg h-14 px-8" asChild>
                  <Link to="/login">
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Acheter des produits
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20" asChild>
                  <Link to="/login">
                    <Sprout className="mr-2 w-5 h-5" />
                    Devenir vendeur
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pourquoi choisir Terabia ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une plateforme conçue pour révolutionner la vente de produits agricoles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-colors animate-scale-in">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Revenus équitables
                  </h3>
                  <p className="text-muted-foreground">
                    Vendez directement sans intermédiaires et augmentez vos revenus jusqu'à 40%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: "0.1s" }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Produits locaux
                  </h3>
                  <p className="text-muted-foreground">
                    Achetez frais et local, soutenez les producteurs de votre région
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Livraison rapide
                  </h3>
                  <p className="text-muted-foreground">
                    Réseau d'agences de livraison pour une distribution efficace
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: "0.3s" }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Paiement sécurisé
                  </h3>
                  <p className="text-muted-foreground">
                    Mobile Money intégré pour des transactions rapides et sûres
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: "0.4s" }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Communauté active
                  </h3>
                  <p className="text-muted-foreground">
                    Échangez directement avec les producteurs, posez vos questions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors animate-scale-in" style={{ animationDelay: "0.5s" }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Agriculture durable
                  </h3>
                  <p className="text-muted-foreground">
                    Favorisez une agriculture responsable et des pratiques durables
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Prêt à commencer ?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Que vous soyez agriculteur, acheteur ou agence de livraison, 
                      rejoignez Terabia et participez à la révolution agricole.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" asChild>
                        <Link to="/login">
                          Explorer les produits
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/login">
                          Créer mon compte vendeur
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <img 
                      src={heroImage}
                      alt="Rejoignez Terabia" 
                      className="rounded-lg shadow-terabia-lg w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
