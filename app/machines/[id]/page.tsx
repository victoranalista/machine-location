import { getMachineById } from "@/actions/machines";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Calendar,
  Package,
  Zap,
  Weight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MachinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machine = await getMachineById(id);

  if (!machine) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar para busca
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <TrendingUp className="h-32 w-32" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-start justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                  {machine.name}
                </h1>
                {!machine.available && (
                  <span className="rounded-md bg-muted px-3 py-1 text-sm">
                    Indisponível
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{machine.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">
                    {machine.rating.toFixed(1)}
                  </span>
                  <span>({machine.reviewCount} avaliações)</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="mb-4 text-xl font-semibold">Descrição</h2>
              <p className="text-muted-foreground">{machine.description}</p>
            </div>

            <Separator />

            <div>
              <h2 className="mb-4 text-xl font-semibold">Especificações</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Ano</div>
                    <div className="font-medium">{machine.yearManufactured}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fabricante</div>
                    <div className="font-medium">{machine.manufacturer}</div>
                  </div>
                </div>

                {machine.power && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Potência</div>
                      <div className="font-medium">{machine.power}</div>
                    </div>
                  </div>
                )}

                {machine.weight && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Weight className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Peso</div>
                      <div className="font-medium">{machine.weight}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Características e Recursos
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {machine.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Valores de Locação</CardTitle>
              <CardDescription>
                Escolha o período que melhor se adequa às suas necessidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="font-medium">Por Hora</div>
                    <div className="text-sm text-muted-foreground">Período mínimo</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      R$ {machine.hourlyRate.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="font-medium">Por Dia</div>
                    <div className="text-sm text-muted-foreground">
                      Mais econômico
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      R$ {machine.dailyRate.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="font-medium">Por Semana</div>
                    <div className="text-sm text-muted-foreground">7 dias</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      R$ {machine.weeklyRate.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="font-medium">Por Mês</div>
                    <div className="text-sm text-muted-foreground">Melhor valor</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      R$ {machine.monthlyRate.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg" disabled={!machine.available}>
                {machine.available ? "Solicitar Orçamento" : "Indisponível"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Valores sujeitos à disponibilidade e localização
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
