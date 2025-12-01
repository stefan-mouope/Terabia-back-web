import { Package, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const DeliveryDashboard = () => {
  const stats = [
    { label: 'Livraisons en cours', value: '3', icon: Package, color: 'text-blue-600' },
    { label: 'Livraisons complétées', value: '28', icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Revenus du mois', value: '42,500 FCFA', icon: DollarSign, color: 'text-amber-600' },
    { label: 'Zone couverte', value: 'Yaoundé', icon: MapPin, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord - Livraison</h1>
          <p className="text-muted-foreground">Gérez vos livraisons et missions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Livraisons disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Fonctionnalité de livraison à venir...
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;
