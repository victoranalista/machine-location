const validatedocument = (document: string): boolean => {
  const cleanTaxId = document.replace(/\D/g, '');
  if (cleanTaxId.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanTaxId)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanTaxId.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanTaxId.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanTaxId.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(cleanTaxId.charAt(10));
};

const cleandocument = (document: string): string => document.replace(/\D/g, '');

const isValiddocument = (document: string): boolean => {
  const cleanId = cleandocument(document);
  return cleanId.length === 11 && validatedocument(cleanId);
};

const isValiddocumentOrCnpj = (input: string): boolean => {
  const cleanInput = input.replace(/[^\d]/g, '');
  if (cleanInput.length === 11) return isValiddocument(cleanInput);
  else if (cleanInput.length === 14) return validateCnpj(cleanInput);
  return false;
};

const validateCnpj = (cnpj: string): boolean => {
  if (/^(\d)\1+$/.test(cnpj)) return false;
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    const char = numbers[size - i];
    if (char) sum += parseInt(char) * pos--;
  }
  if (pos < 2) pos = 9;
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  const firstDigit = digits[0];
  if (!firstDigit || result !== parseInt(firstDigit)) return false;
  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    const char = numbers[size - i];
    if (char) sum += parseInt(char) * pos--;
  }
  if (pos < 2) pos = 9;
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  const secondDigit = digits[1];
  return secondDigit ? result === parseInt(secondDigit) : false;
};

interface ErrorResponse {
  success: false;
  message: string;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'Erro interno do servidor';
};

const handleActionError = (error: unknown): ErrorResponse => ({
  success: false,
  message: getErrorMessage(error)
});

const validateCuidV1 = (cuid: string): void => {
  if (!/^c[0-9a-z]{24}$/.test(cuid)) throw new Error('CUID inválido');
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(dateString));
};

const formatCurrency = (
  value: string | number | { toNumber(): number }
): string => {
  let valueStr: string;
  if (typeof value === 'number') {
    valueStr = (value * 100).toFixed(0);
  } else if (typeof value === 'object' && 'toNumber' in value) {
    valueStr = (value.toNumber() * 100).toFixed(0);
  } else {
    valueStr = value;
  }
  const numbers = valueStr.replace(/\D/g, '');
  if (!numbers) return '';
  const amount = parseFloat(numbers) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().substring(0, 10);
};

export * from '@/lib/utils';
export {
  validatedocument,
  cleandocument,
  isValiddocument,
  isValiddocumentOrCnpj,
  validateCnpj,
  handleActionError,
  validateCuidV1,
  formatDate,
  formatCurrency,
  getDateString
};
