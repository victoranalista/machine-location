export interface Machine {
  id: string;
  name: string;
  category: string;
  type: string;
  manufacturer: string;
  model: string;
  yearManufactured: number;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  location: string;
  city: string;
  state: string;
  capacity?: string;
  power?: string;
  weight?: string;
  description: string;
  features: string[];
  available: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export const categories = [
  "Escavadeiras",
  "Retroescavadeiras",
  "Tratores",
  "Carregadeiras",
  "Compactadores",
  "Guindastes",
  "Plataformas Elevatórias",
  "Empilhadeiras",
  "Outros"
] as const;

export const locations = [
  "São Paulo - SP",
  "Rio de Janeiro - RJ",
  "Belo Horizonte - MG",
  "Curitiba - PR",
  "Porto Alegre - RS",
  "Brasília - DF",
  "Salvador - BA",
  "Fortaleza - CE",
  "Recife - PE",
  "Manaus - AM"
] as const;
