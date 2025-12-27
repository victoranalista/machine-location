export const toBrasiliaDate = (date: Date | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
};
export const formatDateBR = (date: Date | string): string => {
  const d = toBrasiliaDate(date);
  return d.toLocaleDateString('pt-BR');
};
export const parseInputDate = (dateString: string): Date => {
  const parts = dateString.split('-');
  const year = parseInt(parts[0] || '0');
  const month = parseInt(parts[1] || '0');
  const day = parseInt(parts[2] || '0');
  return new Date(year, month - 1, day, 12, 0, 0);
};
export const nowBrasilia = (): Date => {
  const now = new Date();
  const brasiliaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );
  return brasiliaTime;
};
