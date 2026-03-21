import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plane, Plus, LogOut, TrendingDown, TrendingUp, ArrowRight, Trash2 } from "lucide-react";
import { getCurrentUser, getUserRoutes, logout, Route, deleteRoute } from "../utils/storage";
import { AddRouteDialog } from "./add-route-dialog";
import { toast } from "sonner";

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadRoutes();
  }, [user, navigate]);

  const loadRoutes = () => {
    if (user) {
      const userRoutes = getUserRoutes(user.id);
      setRoutes(userRoutes);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const handleDeleteRoute = (routeId: string) => {
    deleteRoute(routeId);
    loadRoutes();
    toast.success("Rota removida com sucesso!");
  };

  const handleRouteAdded = () => {
    loadRoutes();
    setIsDialogOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Alerta de Passagens</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.name}!</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rotas Monitoradas</CardDescription>
              <CardTitle className="text-3xl">{routes.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Alertas Ativos</CardDescription>
              <CardTitle className="text-3xl">
                {routes.filter((r) => r.active).length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Economia Potencial</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                R$ {routes.reduce((acc, r) => acc + Math.max(0, r.currentPrice - r.targetPrice), 0).toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Routes List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Minhas Rotas</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="size-4 mr-2" />
            Adicionar Rota
          </Button>
        </div>

        {routes.length === 0 ? (
          <Card className="p-12 text-center">
            <Plane className="size-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Nenhuma rota monitorada</h3>
            <p className="text-gray-600 mb-4">
              Adicione sua primeira rota para começar a receber alertas de preço
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Adicionar Rota
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {routes.map((route) => {
              const priceDiff = route.currentPrice - route.targetPrice;
              const isAboveTarget = priceDiff > 0;
              
              return (
                <Card
                  key={route.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/route/${route.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-lg">{route.origin}</span>
                          <ArrowRight className="size-4 text-gray-400" />
                          <span className="font-semibold text-lg">{route.destination}</span>
                        </div>
                        <CardDescription>
                          Adicionada em {new Date(route.createdAt).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoute(route.id);
                        }}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Preço Atual</span>
                        <span className="text-2xl font-bold">
                          R$ {route.currentPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Preço Alvo</span>
                        <span className="text-lg">
                          R$ {route.targetPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        {isAboveTarget ? (
                          <>
                            <Badge variant="secondary" className="gap-1">
                              <TrendingUp className="size-3" />
                              Acima do alvo
                            </Badge>
                            <span className="text-sm text-red-600">
                              +R$ {priceDiff.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <>
                            <Badge className="gap-1 bg-green-600">
                              <TrendingDown className="size-3" />
                              Abaixo do alvo
                            </Badge>
                            <span className="text-sm text-green-600">
                              -R$ {Math.abs(priceDiff).toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <Badge variant={route.active ? "default" : "outline"} className="w-full justify-center">
                        {route.active ? "Alerta Ativo" : "Alerta Pausado"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <AddRouteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onRouteAdded={handleRouteAdded}
      />
    </div>
  );
}
