'use server';

type ReverseGeocodeResult = {
  city: string;
  error?: string;
};

type BigDataCloudResponse = {
  city?: string;
  locality?: string;
  localityInfo?: {
    administrative?: Array<{
      name?: string;
      adminLevel?: number;
    }>;
  };
  principalSubdivision?: string;
};

const sanitizeCityName = (name: string): string => {
  const patterns = [
    /^Região Geográfica Imediata d[oa]\s+/i,
    /^Região Metropolitana d[oa]\s+/i,
    /^Microrregião d[oa]\s+/i,
    /^Mesorregião d[oa]\s+/i
  ];
  return patterns.reduce((acc, p) => acc.replace(p, ''), name).trim();
};

const extractCityName = (data: BigDataCloudResponse): string => {
  if (data.city) return sanitizeCityName(data.city);
  if (data.locality) return sanitizeCityName(data.locality);
  const admin = data.localityInfo?.administrative;
  if (admin && admin.length > 0) {
    const cityLevel = admin.find(
      (a) => a.adminLevel === 8 || a.adminLevel === 6
    );
    if (cityLevel?.name) return sanitizeCityName(cityLevel.name);
  }
  if (data.principalSubdivision)
    return sanitizeCityName(data.principalSubdivision);
  return '';
};

const fetchLocationData = async (
  latitude: number,
  longitude: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
    { signal: controller.signal, headers: { Accept: 'application/json' } }
  );
  clearTimeout(timeoutId);
  return response;
};

const handleGeocodeError = (error: unknown): ReverseGeocodeResult => {
  if (error instanceof Error && error.name === 'AbortError') {
    return { city: '', error: 'Tempo esgotado ao buscar localização' };
  }
  return { city: '', error: 'Erro ao processar localização' };
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  try {
    const response = await fetchLocationData(latitude, longitude);
    if (!response.ok) {
      return { city: '', error: 'Erro ao buscar localização' };
    }
    const data: BigDataCloudResponse = await response.json();
    const city = extractCityName(data);
    if (!city) {
      return { city: '', error: 'Cidade não identificada' };
    }
    return { city };
  } catch (error) {
    return handleGeocodeError(error);
  }
};
