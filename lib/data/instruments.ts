export interface Instrument {
  id: string;
  exchangeId: string;
  symbol: string;
  marketType: 'perp' | 'forex';
  baseCurrency: string;
  quoteCurrency: string;
  contractValue: number;
  pricePrecision: number;
  quantityPrecision: number;
  defaultLeverage: number;
  makerFee: number;
  takerFee: number;
  maintenanceMarginRate: number;
  fundingRate?: number;
  isActive: boolean;
}

export const defaultInstruments: Instrument[] = [
  // BINANCE
  { id: 'bin-btcusdt', exchangeId: 'binance', symbol: 'BTCUSDT', marketType: 'perp', baseCurrency: 'BTC', quoteCurrency: 'USDT', contractValue: 0.001, pricePrecision: 0.1, quantityPrecision: 0.001, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'bin-ethusdt', exchangeId: 'binance', symbol: 'ETHUSDT', marketType: 'perp', baseCurrency: 'ETH', quoteCurrency: 'USDT', contractValue: 0.01, pricePrecision: 0.01, quantityPrecision: 0.01, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'bin-solusdt', exchangeId: 'binance', symbol: 'SOLUSDT', marketType: 'perp', baseCurrency: 'SOL', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.001, quantityPrecision: 0.1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'bin-xrpusdt', exchangeId: 'binance', symbol: 'XRPUSDT', marketType: 'perp', baseCurrency: 'XRP', quoteCurrency: 'USDT', contractValue: 1, pricePrecision: 0.0001, quantityPrecision: 1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'bin-dogeusdt', exchangeId: 'binance', symbol: 'DOGEUSDT', marketType: 'perp', baseCurrency: 'DOGE', quoteCurrency: 'USDT', contractValue: 10, pricePrecision: 0.00001, quantityPrecision: 10, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'bin-adausdt', exchangeId: 'binance', symbol: 'ADAUSDT', marketType: 'perp', baseCurrency: 'ADA', quoteCurrency: 'USDT', contractValue: 1, pricePrecision: 0.0001, quantityPrecision: 1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.005, isActive: true },
  // BYBIT
  { id: 'byb-btcusdt', exchangeId: 'bybit', symbol: 'BTCUSDT', marketType: 'perp', baseCurrency: 'BTC', quoteCurrency: 'USDT', contractValue: 0.001, pricePrecision: 0.1, quantityPrecision: 0.001, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.00055, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'byb-ethusdt', exchangeId: 'bybit', symbol: 'ETHUSDT', marketType: 'perp', baseCurrency: 'ETH', quoteCurrency: 'USDT', contractValue: 0.01, pricePrecision: 0.01, quantityPrecision: 0.01, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.00055, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'byb-solusdt', exchangeId: 'bybit', symbol: 'SOLUSDT', marketType: 'perp', baseCurrency: 'SOL', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.001, quantityPrecision: 0.1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.00055, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'byb-avaxusdt', exchangeId: 'bybit', symbol: 'AVAXUSDT', marketType: 'perp', baseCurrency: 'AVAX', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.001, quantityPrecision: 0.1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.00055, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'byb-linkusdt', exchangeId: 'bybit', symbol: 'LINKUSDT', marketType: 'perp', baseCurrency: 'LINK', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.001, quantityPrecision: 0.1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.00055, maintenanceMarginRate: 0.005, isActive: true },
  { id: 'byb-dotusdt', exchangeId: 'bybit', symbol: 'DOTUSDT', marketType: 'perp', baseCurrency: 'DOT', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.001, quantityPrecision: 0.1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.00055, maintenanceMarginRate: 0.005, isActive: true },
  // OKX
  { id: 'okx-btcusdt', exchangeId: 'okx', symbol: 'BTCUSDT', marketType: 'perp', baseCurrency: 'BTC', quoteCurrency: 'USDT', contractValue: 0.01, pricePrecision: 0.1, quantityPrecision: 0.01, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.004, isActive: true },
  { id: 'okx-ethusdt', exchangeId: 'okx', symbol: 'ETHUSDT', marketType: 'perp', baseCurrency: 'ETH', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.01, quantityPrecision: 0.1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.004, isActive: true },
  { id: 'okx-solusdt', exchangeId: 'okx', symbol: 'SOLUSDT', marketType: 'perp', baseCurrency: 'SOL', quoteCurrency: 'USDT', contractValue: 1, pricePrecision: 0.001, quantityPrecision: 1, defaultLeverage: 10, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.004, isActive: true },
  { id: 'okx-arbusdt', exchangeId: 'okx', symbol: 'ARBUSDT', marketType: 'perp', baseCurrency: 'ARB', quoteCurrency: 'USDT', contractValue: 1, pricePrecision: 0.0001, quantityPrecision: 1, defaultLeverage: 5, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.004, isActive: true },
  { id: 'okx-opusdt', exchangeId: 'okx', symbol: 'OPUSDT', marketType: 'perp', baseCurrency: 'OP', quoteCurrency: 'USDT', contractValue: 1, pricePrecision: 0.0001, quantityPrecision: 1, defaultLeverage: 5, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.004, isActive: true },
  { id: 'okx-aptusdt', exchangeId: 'okx', symbol: 'APTUSDT', marketType: 'perp', baseCurrency: 'APT', quoteCurrency: 'USDT', contractValue: 0.1, pricePrecision: 0.001, quantityPrecision: 0.1, defaultLeverage: 5, makerFee: 0.0002, takerFee: 0.0005, maintenanceMarginRate: 0.004, isActive: true },
];
