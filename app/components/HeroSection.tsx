'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';

type LocationState = {
  city: string;
  loading: boolean;
  error: boolean;
};

export const HeroSection = () => {
  const [location, setLocation] = useState<LocationState>({
    city: '',
    loading: false,
    error: false
  });
  const detectLocation = () => {
    setLocation({ city: '', loading: true, error: false });
    if (!navigator.geolocation) {
      setLocation({ city: '', loading: false, error: true });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            'Localização detectada';
          setLocation({ city: cityName, loading: false, error: false });
        } catch {
          setLocation({
            city: 'Localização detectada',
            loading: false,
            error: false
          });
        }
      },
      () => setLocation({ city: '', loading: false, error: true })
    );
  };
  return (
    <section className="relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/maquina.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
      <div className="absolute inset-0 bg-grid-primary/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
              Mais de 5.000 equipamentos disponíveis
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 md:text-6xl">
            A Maneira Mais Inteligente de
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Alugar Equipamentos Pesados
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 md:text-xl">
            Encontre, compare e reserve equipamentos de construção de
            fornecedores verificados com total transparência de preços
          </p>
          <div className="mx-auto mb-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-450">
            <Button
              onClick={detectLocation}
              variant="outline"
              className="w-full gap-2"
              disabled={location.loading}
            >
              {location.loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Detectando localização...
                </>
              ) : location.city ? (
                <>
                  <MapPin className="h-4 w-4" />
                  {location.city}
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Definir localização para ver tarifas
                </>
              )}
            </Button>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 rounded-xl border bg-card p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ex: Escavadeira, Empilhadeira..."
                  className="h-12 pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={location.city || 'Cidade ou Estado'}
                  defaultValue={location.city}
                  className="h-12 pl-10"
                />
              </div>
            </div>
            <Button asChild className="h-12 w-full text-base" size="lg">
              <Link href="/equipamentos">
                <Search className="mr-2 h-5 w-5" />
                Buscar Equipamentos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
