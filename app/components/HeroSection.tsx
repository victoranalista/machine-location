'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { reverseGeocode } from './actions';
import { toast } from 'sonner';

type LocationState = {
  city: string;
  loading: boolean;
  error: boolean;
};

const GEOLOCATION_TIMEOUT = 15000;

export const HeroSection = () => {
  const router = useRouter();
  const [location, setLocation] = useState<LocationState>({
    city: '',
    loading: false,
    error: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const handleGeolocationError = (error: GeolocationPositionError) => {
    const messages: Record<number, string> = {
      1: 'Permissão de localização negada. Por favor, permita o acesso à localização.',
      2: 'Localização indisponível no momento',
      3: 'Tempo esgotado ao obter localização'
    };
    const message = messages[error.code] || 'Erro ao obter localização';
    toast.error(message);
    setLocation({ city: '', loading: false, error: true });
  };
  const updateLocationState = (city: string) => {
    setLocation({ city, loading: false, error: false });
    setLocationInput(city);
    toast.success(city);
  };
  const handleGeocodeError = (error: string) => {
    toast.error(error);
    setLocation({ city: '', loading: false, error: true });
  };
  const processCoordinates = async (latitude: number, longitude: number) => {
    try {
      const result = await reverseGeocode(latitude, longitude);
      if (result.error) {
        handleGeocodeError(result.error);
        return;
      }
      updateLocationState(result.city);
    } catch {
      handleGeocodeError('Erro ao processar localização');
    }
  };
  const handleGeolocationSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    processCoordinates(latitude, longitude);
  };
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada pelo navegador');
      setLocation({ city: '', loading: false, error: true });
      return;
    }
    setLocation({ city: '', loading: true, error: false });
    navigator.geolocation.getCurrentPosition(
      handleGeolocationSuccess,
      handleGeolocationError,
      {
        timeout: GEOLOCATION_TIMEOUT,
        enableHighAccuracy: false,
        maximumAge: 300000
      }
    );
  };
  const handleSearchEquipment = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    const cityValue = locationInput || location.city;
    if (cityValue.trim()) params.set('cidade', cityValue.trim());
    router.push(`/equipamentos?${params.toString()}`);
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSearchEquipment()
                  }
                  className="h-12 pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cidade ou Estado"
                  value={locationInput || location.city}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSearchEquipment()
                  }
                  className="h-12 pl-10"
                />
              </div>
            </div>
            <Button
              onClick={handleSearchEquipment}
              className="h-12 w-full text-base"
              size="lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar Equipamentos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
