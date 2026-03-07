const DECIMAL_SEPARATOR_KEY = 'decimalSeparator';

export type DecimalSeparator = '.' | ',';

export function getDecimalSeparator(): DecimalSeparator {
  if (typeof window === 'undefined') return '.';
  const stored = localStorage.getItem(DECIMAL_SEPARATOR_KEY);
  return (stored === ',' ? ',' : '.') as DecimalSeparator;
}

export function setDecimalSeparator(separator: DecimalSeparator): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DECIMAL_SEPARATOR_KEY, separator);
  window.dispatchEvent(new Event('decimalSeparatorChange'));
}

export function formatNumberWithSeparator(value: number, decimals: number = 2): string {
  const separator = getDecimalSeparator();
  const formatted = value.toFixed(decimals);
  return separator === ',' ? formatted.replace('.', ',') : formatted;
}

export function formatCurrencyWithSeparator(value: number, currency: string = 'USDT', decimals: number = 2): string {
  return `${formatNumberWithSeparator(value, decimals)} ${currency}`;
}

export function formatPercentWithSeparator(value: number, decimals: number = 2): string {
  return `${formatNumberWithSeparator(value, decimals)}%`;
}

export function formatFeeAsPercent(feeDecimal: number | undefined): string {
  if (feeDecimal === undefined || feeDecimal === null) return '0%';
  const percentValue = feeDecimal * 100;
  return formatPercentWithSeparator(percentValue, 4);
}

export function formatFundingRate(fundingRate: number | undefined): string {
  if (fundingRate === undefined || fundingRate === null) return '0%';
  return `${fundingRate >= 0 ? '+' : ''}${formatPercentWithSeparator(fundingRate, 4)}`;
}
