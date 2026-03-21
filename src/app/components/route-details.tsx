import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ArrowLeft, ArrowRight, Bell, BellOff, TrendingDown, TrendingUp } from "lucide-react";
import { getRouteById, getRoutePriceHistory, updateRoute, PriceHistory } from "../utils/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { toast } from "sonner";

export function RouteDetails() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState(getRouteById(routeId || ""));
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  useEffect(() => {
    if (!routeId) {
      navigate("/dashboard");
      return;
    }

    const routeData = getRouteById(routeId);
    if (!routeData) {
      navigate("/dashboard");
      return;
    }

    setRoute(routeData);
    
    const history = getRoutePriceHistory(routeId);
    // Sort by date
    const sortedHistory = history.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setPriceHistory(sortedHistory);
  }, [routeId, navigate]);

  const handleToggleAlert = (active: boolean) => {
    if (route) {
      updateRoute(route.id, { active });
      setRoute({ ...route, active });
      toast.success(active ? "Alerta ativado!" : "Alerta pausado!");
    }
  };

  if (!route) {
    return null;
  }

  const priceDiff = route.currentPrice - route.targetPrice;
  const isAboveTarget = priceDiff > 0;

  // Calculate statistics
  const prices = priceHistory.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Format data for chart
  const chartData = priceHistory.map(h => ({
    date: new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    price: h.price,
    targetPrice: route.targetPrice,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="size-4 mr-2" />
            Voltar para Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Route Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{route.origin}</h1>
            <ArrowRight className="size-6 text-gray-400" />
            <h1 className="text-3xl font-bold">{route.destination}</h1>
          </div>
          <p className="text-gray-600">
            Monitorando desde {new Date(route.createdAt).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>

        {/* Price Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Preço Atual</CardDescription>
              <CardTitle className="text-2xl">
                R$ {route.currentPrice.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAboveTarget ? (
                <div className="flex items-center gap-2 text-red-600">
                  <TrendingUp className="size-4" />
                  <span className="text-sm">+R$ {priceDiff.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingDown className="size-4" />
                  <span className="text-sm">-R$ {Math.abs(priceDiff).toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Preço Mínimo</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                R$ {minPrice.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Preço Médio</CardDescription>
              <CardTitle className="text-2xl">
                R$ {avgPrice.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Preço Máximo</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                R$ {maxPrice.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Alert Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configurações de Alerta</CardTitle>
            <CardDescription>
              Gerencie quando você quer receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {route.active ? (
                  <Bell className="size-5 text-blue-600" />
                ) : (
                  <BellOff className="size-5 text-gray-400" />
                )}
                <div>
                  <Label>Alertas Ativos</Label>
                  <p className="text-sm text-gray-600">
                    Receber notificações quando o preço cair
                  </p>
                </div>
              </div>
              <Switch
                checked={route.active}
                onCheckedChange={handleToggleAlert}
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Preço Alvo</Label>
                  <p className="text-sm text-gray-600">
                    Você será notificado se o preço cair para
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  R$ {route.targetPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {!isAboveTarget && (
              <Badge className="w-full justify-center py-2 bg-green-600">
                🎉 Preço está abaixo do alvo! Ótima hora para comprar!
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Price History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Preços - Últimos 30 dias</CardTitle>
            <CardDescription>
              Acompanhe a variação de preços ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                  <Line
                    type="monotone"
                    dataKey="targetPrice"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-600"></div>
                <span>Preço Atual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-600 border-dashed border-t-2 border-green-600"></div>
                <span>Preço Alvo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
