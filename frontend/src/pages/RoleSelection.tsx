import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Sprout, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'buyer',
      title: 'Acheteur',
      description: 'Achetez des produits frais directement auprès des agriculteurs',
      icon: ShoppingBag,
      path: '/signup/buyer',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'seller',
      title: 'Vendeur / Agriculteur',
      description: 'Vendez vos produits directement aux consommateurs',
      icon: Sprout,
      path: '/signup/seller',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'delivery',
      title: 'Agence de livraison',
      description: 'Gérez et livrez les commandes dans votre zone',
      icon: Truck,
      path: '/signup/delivery',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Terabia</h1>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Choisissez votre rôle
          </h2>
          <p className="text-muted-foreground">
            Sélectionnez le type de compte que vous souhaitez créer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="relative overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl group"
                onClick={() => navigate(role.path)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${role.color} mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {role.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    S'inscrire
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Vous avez déjà un compte ?
          </p>
          <Button variant="link" onClick={() => navigate('/login')}>
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
