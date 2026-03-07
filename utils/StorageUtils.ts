export const STORAGE_KEYS = {
  LAST_INSTRUMENT: 'calc_last_instrument',
  LAST_EXCHANGE: 'calc_last_exchange',
  LAST_LEVERAGE: 'calc_last_leverage',
  LAST_SIZE_MODE: 'calc_last_size_mode',
  LAST_SIDE: 'calc_last_side',
  LAST_MAKER_FEE: 'calc_last_maker_fee',
  LAST_TAKER_FEE: 'calc_last_taker_fee',
} as const;

export function saveToLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}
