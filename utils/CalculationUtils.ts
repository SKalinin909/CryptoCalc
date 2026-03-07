export type Side = 'long' | 'short';
export type SizeMode = 'contracts' | 'base' | 'quote';

export interface PositionSize {
  Q: number;
  contracts: number;
}

export interface PerpPnlResult {
  margin: number;
  pnlGross: number;
  pnlNet: number;
  pnlPercent: number;
  feeOpen: number;
  feeClose: number;
}

export interface LiquidationResult {
  liquidationPrice: number;
  distancePercent: number;
  distanceAbsolute: number;
  initialMargin: number;
  totalEquity: number;
  maintenanceMargin: number;
}

export interface AverageEntryResult {
  avgPrice: number;
  totalQty: number;
  totalCost: number;
  margin?: number;
}

export interface FundingCostResult {
  fundingPeriods: number;
  fundingCost: number;
  fundingCostPercent: number;
}

export function getPerpPositionSize(
  sizeMode: SizeMode,
  contracts: number | null,
  baseSize: number | null,
  quoteSize: number | null,
  contractValue: number,
  entryPrice: number
): PositionSize | null {
  if (sizeMode === 'contracts') {
    if (!contracts) return null;
    const Q = contracts * contractValue;
    return { Q, contracts };
  }
  if (sizeMode === 'base') {
    if (!baseSize) return null;
    const Q = baseSize;
    const contractsCalc = Q / contractValue;
    return { Q, contracts: contractsCalc };
  }
  if (!quoteSize) return null;
  const Q = quoteSize / entryPrice;
  const contractsCalc = Q / contractValue;
  return { Q, contracts: contractsCalc };
}

export function calculatePerpPnl(
  side: Side,
  entryPrice: number,
  exitPrice: number,
  leverage: number,
  sizeMode: SizeMode,
  contracts: number | null,
  baseSize: number | null,
  quoteSize: number | null,
  contractValue: number,
  makerFee: number,
  takerFee: number
): PerpPnlResult | null {
  if (!entryPrice || !exitPrice || !leverage) return null;
  const pos = getPerpPositionSize(sizeMode, contracts, baseSize, quoteSize, contractValue, entryPrice);
  if (!pos) return null;
  const { Q } = pos;
  const isLong = side === 'long';
  const pnl = isLong ? (exitPrice - entryPrice) * Q : (entryPrice - exitPrice) * Q;
  const margin = (entryPrice * Q) / leverage;
  const feeOpen = entryPrice * Q * makerFee;
  const feeClose = exitPrice * Q * takerFee;
  const pnlNet = pnl - feeOpen - feeClose;
  const pnlPercent = margin ? (pnlNet / margin) * 100 : 0;
  return { margin, pnlGross: pnl, pnlNet, pnlPercent, feeOpen, feeClose };
}

export function calculateFundingCost(
  side: Side,
  positionValue: number,
  fundingRate: number,
  durationHours: number
): FundingCostResult {
  const fundingPeriods = durationHours / 8;
  const fundingRateDecimal = fundingRate / 100;
  let fundingCost = positionValue * fundingRateDecimal * fundingPeriods;
  if (side === 'short') fundingCost = -fundingCost;
  const fundingCostPercent = positionValue ? (fundingCost / positionValue) * 100 : 0;
  return { fundingPeriods, fundingCost, fundingCostPercent };
}

export function calculateTargetExitPrice(
  side: Side,
  entryPrice: number,
  leverage: number,
  sizeMode: SizeMode,
  contracts: number | null,
  baseSize: number | null,
  quoteSize: number | null,
  contractValue: number,
  targetType: 'absolute' | 'percentage',
  targetPnl: number | null,
  targetPnlPercent: number | null
): number | null {
  if (!entryPrice || !leverage) return null;
  const pos = getPerpPositionSize(sizeMode, contracts, baseSize, quoteSize, contractValue, entryPrice);
  if (!pos) return null;
  const { Q } = pos;
  let pnlTarget: number | null = null;
  if (targetType === 'absolute') {
    if (targetPnl == null) return null;
    pnlTarget = targetPnl;
  } else {
    if (targetPnlPercent == null) return null;
    const margin = (entryPrice * Q) / leverage;
    pnlTarget = margin * (targetPnlPercent / 100);
  }
  const isLong = side === 'long';
  if (isLong) return entryPrice + pnlTarget / Q;
  else return entryPrice - pnlTarget / Q;
}

export function calculateLiquidationPrice(
  side: Side,
  entryPrice: number,
  leverage: number,
  sizeMode: SizeMode,
  contracts: number | null,
  baseSize: number | null,
  quoteSize: number | null,
  contractValue: number,
  additionalMargin: number,
  maintenanceMarginRate: number
): LiquidationResult | null {
  if (!entryPrice || !leverage) return null;
  const pos = getPerpPositionSize(sizeMode, contracts, baseSize, quoteSize, contractValue, entryPrice);
  if (!pos) return null;
  const { Q } = pos;
  const margin = (entryPrice * Q) / leverage;
  const equity = margin + (additionalMargin || 0);
  const isLong = side === 'long';
  let liqPrice: number;
  if (isLong) {
    const numerator = entryPrice * Q - equity;
    const denominator = Q * (1 - maintenanceMarginRate);
    liqPrice = numerator / denominator;
  } else {
    const numerator = entryPrice * Q + equity;
    const denominator = Q * (1 + maintenanceMarginRate);
    liqPrice = numerator / denominator;
  }
  const distanceAbsolute = Math.abs(liqPrice - entryPrice);
  const distancePercent = (distanceAbsolute / entryPrice) * 100;
  const maintenanceMargin = liqPrice * Q * maintenanceMarginRate;
  return { liquidationPrice: liqPrice, distancePercent, distanceAbsolute, initialMargin: margin, totalEquity: equity, maintenanceMargin };
}

export function calculateAverageEntry(
  fills: Array<{ price: number | null; quantity: number | null }>,
  leverage: number | null
): AverageEntryResult | null {
  const validFills = fills.filter(f => f.price && f.quantity && f.price > 0 && f.quantity > 0);
  if (!validFills.length) return null;
  let sumPQ = 0;
  let sumQ = 0;
  for (const f of validFills) {
    sumPQ += (f.price as number) * (f.quantity as number);
    sumQ += f.quantity as number;
  }
  if (sumQ === 0) return null;
  const avgPrice = sumPQ / sumQ;
  const result: AverageEntryResult = { avgPrice, totalQty: sumQ, totalCost: sumPQ };
  if (leverage && leverage > 0) result.margin = sumPQ / leverage;
  return result;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatCurrency(value: number, currency: string = 'USDT', decimals: number = 2): string {
  return `${formatNumber(value, decimals)} ${currency}`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${formatNumber(value, decimals)}%`;
}
