/**
 * Formata valores numéricos para Real Brasileiro (BRL) demonstrativo
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formata valores compactos para badges (ex: "+ R$ 12.500" ou "Incluso")
 */
export function formatOptionPrice(price: number): string {
  if (price === 0) return 'Incluso';
  return `+ ${formatCurrency(price)}`;
}
