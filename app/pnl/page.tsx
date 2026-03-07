'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDataStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ExchangeSelector } from '@/components/shared/ExchangeSelector';
import { InstrumentSelector } from '@/components/shared/InstrumentSelector';
import { SideToggle } from '@/components/shared/SideToggle';
import { SizeModeToggle } from '@/components/shared/SizeModeToggle';
import { calculatePerpPnl } from '@/utils/CalculationUtils';
import { formatCurrencyWithSeparator, formatPercentWithSeparator } from '@/utils/FormattingUtils';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '@/utils/StorageUtils';
import type { Side, SizeMode } from '@/utils/CalculationUtils';

export default function PnLPage() {
  const instruments = useDataStore((s) => s.instruments);
  const exchanges = useDataStore((s) => s.exchanges);

  const [exchangeId, setExchangeId] = useState('');
  const [instrumentId, setInstrumentId] = useState('');
  const [side, setSide] = useState<Side>('long');
  const [leverage, setLeverage] = useState<number>(10);
  const [sizeMode, setSizeMode] = useState<SizeMode>('contracts');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [contracts, setContracts] = useState('');
  const [baseSize, setBaseSize] = useState('');
  const [quoteSize, setQuoteSize] = useState('');
  const [makerFee, setMakerFee] = useState('');
  const [takerFee, setTakerFee] = useState('');

  const selectedInstrument = useMemo(
    () => instruments.find((i) => i.id === instrumentId),
    [instruments, instrumentId]
  );

  useEffect(() => {
    const active = exchanges.filter((e) => e.isActive);
    if (!active.length) return;
    const lastId = loadFromLocalStorage(STORAGE_KEYS.LAST_EXCHANGE, '');
    const found = active.find((e) => e.id === lastId) || active[0];
    setExchangeId(found.id);
  }, [exchanges]);

  useEffect(() => {
    const active = instruments.filter((i) => i.isActive);
    if (!active.length) return;
    const lastId = loadFromLocalStorage(STORAGE_KEYS.LAST_INSTRUMENT, '');
    const found = active.find((i) => i.id === lastId) || active[0];
    setInstrumentId(found.id);
    setLeverage(loadFromLocalStorage(STORAGE_KEYS.LAST_LEVERAGE, 10));
    setSizeMode(loadFromLocalStorage(STORAGE_KEYS.LAST_SIZE_MODE, 'contracts'));
    setSide(loadFromLocalStorage(STORAGE_KEYS.LAST_SIDE, 'long'));
  }, [instruments]);

  useEffect(() => {
    if (!selectedInstrument) return;
    if (!makerFee) setMakerFee(String(selectedInstrument.makerFee || 0.0002));
    if (!takerFee) setTakerFee(String(selectedInstrument.takerFee || 0.0005));
  }, [selectedInstrument]);

  useEffect(() => {
    if (!exchangeId || !selectedInstrument) return;
    if (selectedInstrument.exchangeId !== exchangeId) {
      const exInstruments = instruments.filter((i) => i.isActive && i.exchangeId === exchangeId);
      if (exInstruments.length) {
        setInstrumentId(exInstruments[0].id);
        setMakerFee(String(exInstruments[0].makerFee));
        setTakerFee(String(exInstruments[0].takerFee));
      }
    }
  }, [exchangeId]);

  useEffect(() => {
    if (exchangeId) saveToLocalStorage(STORAGE_KEYS.LAST_EXCHANGE, exchangeId);
    if (instrumentId) saveToLocalStorage(STORAGE_KEYS.LAST_INSTRUMENT, instrumentId);
    saveToLocalStorage(STORAGE_KEYS.LAST_LEVERAGE, leverage);
    saveToLocalStorage(STORAGE_KEYS.LAST_SIZE_MODE, sizeMode);
    saveToLocalStorage(STORAGE_KEYS.LAST_SIDE, side);
  }, [exchangeId, instrumentId, leverage, sizeMode, side]);

  const result = useMemo(() => {
    if (!selectedInstrument) return null;
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const maker = parseFloat(makerFee);
    const taker = parseFloat(takerFee);
    if (!entry || !exit || !leverage || isNaN(maker) || isNaN(taker)) return null;

    return calculatePerpPnl(
      side, entry, exit, leverage, sizeMode,
      contracts ? parseFloat(contracts) : null,
      baseSize ? parseFloat(baseSize) : null,
      quoteSize ? parseFloat(quoteSize) : null,
      selectedInstrument.contractValue, maker, taker
    );
  }, [selectedInstrument, side, entryPrice, exitPrice, leverage, sizeMode, contracts, baseSize, quoteSize, makerFee, takerFee]);

  if (!instruments.filter((i) => i.isActive).length) {
    return <div className="container mx-auto p-6"><Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No instruments available.</p></CardContent></Card></div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">PnL Calculator</h1>
        <p className="text-sm text-muted-foreground">Calculate profit/loss, margin, and fees</p>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-lg">Exchange</CardTitle></CardHeader>
        <CardContent>
          <ExchangeSelector value={exchangeId} onChange={setExchangeId} />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-lg">Input Parameters</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Instrument</Label>
              <InstrumentSelector value={instrumentId} onChange={(id) => { setInstrumentId(id); const i = instruments.find(x => x.id === id); if (i) { setMakerFee(String(i.makerFee)); setTakerFee(String(i.takerFee)); } }} exchangeId={exchangeId} />
            </div>
            <div>
              <Label>Position Side</Label>
              <SideToggle value={side} onChange={setSide} />
            </div>
            <div>
              <Label>Leverage (x)</Label>
              <Input type="number" min={1} max={125} value={leverage} onChange={(e) => setLeverage(parseFloat(e.target.value) || 1)} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Entry Price</Label>
                <Input type="number" step="any" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Exit Price</Label>
                <Input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <Separator />
            <div>
              <Label>Position Size</Label>
              <div className="space-y-2 mt-1">
                <SizeModeToggle value={sizeMode} onChange={setSizeMode} baseCurrency={selectedInstrument?.baseCurrency} quoteCurrency={selectedInstrument?.quoteCurrency} />
                {sizeMode === 'contracts' && <Input type="number" step="any" value={contracts} onChange={(e) => setContracts(e.target.value)} placeholder="Contracts" />}
                {sizeMode === 'base' && <Input type="number" step="any" value={baseSize} onChange={(e) => setBaseSize(e.target.value)} placeholder={selectedInstrument?.baseCurrency} />}
                {sizeMode === 'quote' && <Input type="number" step="any" value={quoteSize} onChange={(e) => setQuoteSize(e.target.value)} placeholder={selectedInstrument?.quoteCurrency} />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-lg">Results</CardTitle></CardHeader>
          <CardContent>
            {!result ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Enter all required fields</div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground mb-1">Margin Required</div>
                  <div className="text-xl font-bold">{formatCurrencyWithSeparator(result.margin, selectedInstrument?.quoteCurrency)}</div>
                </div>

                <div className={`p-3 rounded-lg ${result.pnlNet >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  <div className="text-xs text-muted-foreground mb-1">Net PnL (After Fees)</div>
                  <div className={`text-2xl font-bold ${result.pnlNet >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {result.pnlNet >= 0 ? '+' : ''}{formatCurrencyWithSeparator(result.pnlNet, selectedInstrument?.quoteCurrency)}
                  </div>
                  <div className={`text-sm mt-1 ${result.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {result.pnlPercent >= 0 ? '+' : ''}{formatPercentWithSeparator(result.pnlPercent)}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross PnL:</span>
                    <span className={`font-medium ${result.pnlGross >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrencyWithSeparator(result.pnlGross, selectedInstrument?.quoteCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Fees:</span>
                    <span className="font-medium text-red-500">-{formatCurrencyWithSeparator(result.feeOpen + result.feeClose, selectedInstrument?.quoteCurrency)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
