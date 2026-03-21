import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getCurrentUser, saveRoute, savePriceHistory } from "../utils/storage";
import { toast } from "sonner";

interface AddRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteAdded: () => void;
}

export function AddRouteDialog({ open, onOpenChange, onRouteAdded }: AddRouteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const origin = formData.get("origin") as string;
    const destination = formData.get("destination") as string;
    const targetPrice = parseFloat(formData.get("targetPrice") as string);

    const user = getCurrentUser();
    if (!user) return;

    // Simulate fetching current price
    const currentPrice = targetPrice + Math.random() * 500 - 250;

    const newRoute = {
      id: Date.now().toString(),
      userId: user.id,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      targetPrice,
      currentPrice: Math.max(0, currentPrice),
      createdAt: new Date().toISOString(),
      active: true,
    };

    // Save route
    saveRoute(newRoute);

    // Create initial price history
    const initialHistory = {
      id: Date.now().toString(),
      routeId: newRoute.id,
      price: newRoute.currentPrice,
      date: new Date().toISOString(),
    };
    savePriceHistory(initialHistory);

    // Create some mock historical data (last 30 days)
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const historicalPrice = newRoute.currentPrice + (Math.random() * 400 - 200);
      
      savePriceHistory({
        id: `${Date.now()}-${i}`,
        routeId: newRoute.id,
        price: Math.max(0, historicalPrice),
        date: date.toISOString(),
      });
    }

    setTimeout(() => {
      toast.success("Rota adicionada com sucesso!");
      onRouteAdded();
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Rota</DialogTitle>
          <DialogDescription>
            Configure uma nova rota para monitorar os preços de passagens
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origem (código IATA)</Label>
            <Input
              id="origin"
              name="origin"
              placeholder="Ex: GRU, CGH, SDU"
              required
              maxLength={3}
              pattern="[A-Za-z]{3}"
              title="Digite o código IATA de 3 letras"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destino (código IATA)</Label>
            <Input
              id="destination"
              name="destination"
              placeholder="Ex: JFK, LAX, MIA"
              required
              maxLength={3}
              pattern="[A-Za-z]{3}"
              title="Digite o código IATA de 3 letras"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetPrice">Preço Alvo (R$)</Label>
            <Input
              id="targetPrice"
              name="targetPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 1500.00"
              required
            />
            <p className="text-sm text-gray-500">
              Você será notificado quando o preço estiver abaixo deste valor
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
