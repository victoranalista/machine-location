import { Machine } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <TrendingUp className="h-16 w-16" />
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{machine.name}</CardTitle>
          {!machine.available && (
            <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs">
              Indisponível
            </span>
          )}
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {machine.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold">{machine.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({machine.reviewCount} avaliações)
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{machine.yearManufactured}</span>
          </div>
          <p className="text-sm text-muted-foreground">{machine.manufacturer}</p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-bold">
            R$ {machine.dailyRate.toLocaleString("pt-BR")}
          </div>
          <div className="text-sm text-muted-foreground">por dia</div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/machines/${machine.id}`} className="w-full">
          <Button className="w-full" disabled={!machine.available}>
            {machine.available ? "Ver Detalhes" : "Indisponível"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
