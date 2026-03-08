export const STORAGE_KEYS = {
  LAST_INSTRUMENT: 'calc_last_instrument',
  LAST_EXCHANGE: 'calc_last_exchange',
  LAST_LEVERAGE: 'calc_last_leverage',
  LAST_SIZE_MODE: 'calc_last_size_mode',
  LAST_SIDE: 'calc_last_side',
  LAST_MAKER_FEE: 'calc_last_maker_fee',
  LAST_TAKER_FEE: 'calc_last_taker_fee',
  LAST_TAB: 'calc_last_tab',
} as const;

// Telegram CloudStorage — async, но мы используем localStorage как основной
// и синхронизируем с CloudStorage в фоне если доступен

function getTelegramCloudStorage(): any | null {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.CloudStorage) return tg.CloudStorage;
  } catch {}
  return null;
}

export function saveToLocalStorage(key: string, value: any): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);

    // Фоновая синхронизация с Telegram CloudStorage
    const cloud = getTelegramCloudStorage();
    if (cloud) {
      cloud.setItem(key, serialized);
    }
  } catch (error) {
    console.error('Failed to save:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
    const cloud = getTelegramCloudStorage();
    if (cloud) cloud.removeItem(key);
  } catch (error) {
    console.error('Failed to remove:', error);
  }
}

// Восстановление из CloudStorage при первом запуске
export async function syncFromCloudStorage(): Promise<void> {
  const cloud = getTelegramCloudStorage();
  if (!cloud) return;

  const keys = Object.values(STORAGE_KEYS);
  try {
    cloud.getItems(keys, (err: any, result: Record<string, string>) => {
      if (err || !result) return;
      for (const [key, value] of Object.entries(result)) {
        if (value && !localStorage.getItem(key)) {
          localStorage.setItem(key, value);
        }
      }
    });
  } catch {}
}
