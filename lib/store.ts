import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Описываем типы данных (TypeScript)
export interface Exchange {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Instrument {
  id: string;
  symbol: string;
  exchangeId: string;
  baseCurrency: string;
  quoteCurrency: string;
  contractValue: number;
  makerFee: number;
  takerFee: number;
  maintenanceMarginRate: number;
  isActive: boolean;
}

interface DataStore {
  exchanges: Exchange[];
  instruments: Instrument[];
  updateInstrument: (id: string, data: Partial<Instrument>) => void;
  updateExchange: (id: string, data: Partial<Exchange>) => void;
}

// 2. Базовые данные (Биржи)
const defaultExchanges: Exchange[] = [
  { id: 'binance', name: 'Binance', isActive: true },
  { id: 'bybit', name: 'Bybit', isActive: true },
  { id: 'okx', name: 'OKX', isActive: true },
];

// 3. Базовые данные (Монеты)
const defaultInstruments: Instrument[] = [
  {
    id: 'binance_btc_usdt',
    symbol: 'BTCUSDT',
    exchangeId: 'binance',
    baseCurrency: 'BTC',
    quoteCurrency: 'USDT',
    contractValue: 1, // 1 контракт = 1 BTC
    makerFee: 0.0002, // 0.02%
    takerFee: 0.0005, // 0.05%
    maintenanceMarginRate: 0.004, // 0.4%
    isActive: true,
  },
  {
    id: 'binance_eth_usdt',
    symbol: 'ETHUSDT',
    exchangeId: 'binance',
    baseCurrency: 'ETH',
    quoteCurrency: 'USDT',
    contractValue: 1,
    makerFee: 0.0002,
    takerFee: 0.0005,
    maintenanceMarginRate: 0.005, // 0.5%
    isActive: true,
  },
  {
    id: 'bybit_btc_usdt',
    symbol: 'BTCUSDT',
    exchangeId: 'bybit',
    baseCurrency: 'BTC',
    quoteCurrency: 'USDT',
    contractValue: 1,
    makerFee: 0.0002,
    takerFee: 0.00055, // На Bybit чуть другие комиссии
    maintenanceMarginRate: 0.005,
    isActive: true,
  },
  {
    id: 'okx_btc_usdt',
    symbol: 'BTC-USDT-SWAP',
    exchangeId: 'okx',
    baseCurrency: 'BTC',
    quoteCurrency: 'USDT',
    contractValue: 0.01, // На OKX 1 контракт = 0.01 BTC
    makerFee: 0.0002,
    takerFee: 0.0005,
    maintenanceMarginRate: 0.004,
    isActive: true,
  }
];

// 4. Создаем хранилище Zustand с сохранением в LocalStorage
export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      exchanges: defaultExchanges,
      instruments: defaultInstruments,
      
      // Функция для обновления монеты (например, скрыть её в админке)
      updateInstrument: (id, data) =>
        set((state) => ({
          instruments: state.instruments.map((inst) =>
            inst.id === id ? { ...inst, ...data } : inst
          ),
        })),

      // Функция для обновления биржи
      updateExchange: (id, data) =>
        set((state) => ({
          exchanges: state.exchanges.map((ex) =>
            ex.id === id ? { ...ex, ...data } : ex
          ),
        })),
    }),
    {
      name: 'crypto-calc-settings', // Имя ключа в браузере
    }
  )
);
