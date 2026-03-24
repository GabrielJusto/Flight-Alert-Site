import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getCurrentUser } from "../utils/storage";
import { toast } from "sonner";
import { addRoute, Route } from "../services/routes";

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
    const departureDay = formData.get("departureDay") as string;
    const returnDay = formData.get("returnDay") as string;

    const user = getCurrentUser();
    if (!user) return;

    const newRoute: Route = {
      userId: user.id,
      originIataCode: origin.toUpperCase(),
      destinationIataCode: destination.toUpperCase(),
      targetPrice: targetPrice,
      departureDay: departureDay,
      returnDay: returnDay || null
    };

    const success = await addRoute(newRoute);
    if (success) {
      toast.success("Rota adicionada com sucesso!");
      onRouteAdded();
      onOpenChange(false);
    } else {
      toast.error("Erro ao adicionar a rota. Tente novamente.");
    }
    setIsLoading(false);
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
            <Label htmlFor="departureDay">Data de Ida</Label>
            <Input
              id="departureDay"
              name="departureDay"
              type="date"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnDay">Data de Volta (opcional)</Label>
            <Input
              id="returnDay"
              name="returnDay"
              type="date"
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
