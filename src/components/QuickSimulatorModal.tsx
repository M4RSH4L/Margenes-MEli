import React, { useState, useEffect } from 'react';
import { ProductItem } from '../types/product';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { X, Calculator, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface QuickSimulatorModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  initialUseSugerido?: boolean;
  onClose: () => void;
  onSaveProductPrice?: (updatedProduct: ProductItem) => void;
}

export const QuickSimulatorModal: React.FC<QuickSimulatorModalProps> = ({
  product,
  isOpen,
  initialUseSugerido = false,
  onClose,
  onSaveProductPrice,
}) => {
  const [venta, setVenta] = useState<number>(100000);
  const [compra, setCompra] = useState<number>(65000);
  const [comisionPercent, setComisionPercent] = useState<number>(12.5);
  const [shippingFee, setShippingFee] = useState<number>(16290);
  const [retencionPercent, setRetencionPercent] = useState<number>(0);

  useEffect(() => {
    if (product) {
      const initialPrice = initialUseSugerido && product.sugerido ? product.sugerido : product.ventaMeli;
      setVenta(initialPrice);
      setCompra(product.compra ?? 0);
      setComisionPercent(product.comisionMeli.percentage || 12.5);
      setShippingFee(product.deduction.amount || 0);
      setRetencionPercent(0);
    }
  }, [product, initialUseSugerido]);

  if (!isOpen) return null;

  // Current calculation for entered values
  const comisionAmount = (venta * comisionPercent) / 100;
  const retencionAmount = (venta * retencionPercent) / 100;
  const recibis = venta - comisionAmount - shippingFee - retencionAmount;
  const ganancia = recibis - compra;
  const margenPercent = venta > 0 ? (ganancia / venta) * 100 : 0;
  const markupPercent = compra > 0 ? (ganancia / compra) * 100 : 0;

  // Comparison metrics with original selling price vs suggested
  const originalVenta = product?.ventaMeli ?? 0;
  const suggestedVenta = product?.sugerido ?? 0;
  const isBelowSugerido = product ? suggestedVenta > originalVenta : false;
  const isCurrentlySugerido = product && Math.round(venta) === Math.round(suggestedVenta);

  // Baseline calculation with product.ventaMeli
  const baselineComision = (originalVenta * comisionPercent) / 100;
  const baselineRecibis = originalVenta - baselineComision - shippingFee;
  const baselineGanancia = baselineRecibis - compra;
  const baselineMargen = originalVenta > 0 ? (baselineGanancia / originalVenta) * 100 : 0;

  // Suggested price calculation
  const suggestedComision = (suggestedVenta * comisionPercent) / 100;
  const suggestedRecibis = suggestedVenta - suggestedComision - shippingFee;
  const suggestedGanancia = suggestedRecibis - compra;
  const suggestedMargen = suggestedVenta > 0 ? (suggestedGanancia / suggestedVenta) * 100 : 0;

  const gainDifference = suggestedGanancia - baselineGanancia;
  const marginDifference = suggestedMargen - baselineMargen;

  const handleApplySavedPrice = () => {
    if (product && onSaveProductPrice) {
      const updated: ProductItem = {
        ...product,
        ventaMeli: Math.round(venta),
        compra: compra > 0 ? compra : product.compra,
        recibisMeli: Math.round(recibis),
        gananciaMeli: Math.round(ganancia),
        margenMeliPercent: Number(margenPercent.toFixed(1)),
      };
      onSaveProductPrice(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-4 sm:p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Calculadora de Márgenes</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[230px] sm:max-w-xs">
                {product ? product.name : 'Simulación rápida'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Propuesta interactiva con precio sugerido */}
        {product && isBelowSugerido && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Propuesta del Proveedor ({product.supplier})
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Sugerido: {formatCurrency(suggestedVenta)}
              </span>
            </div>

            <p className="text-[11px] text-amber-800 leading-snug">
              El precio de venta actual ({formatCurrency(originalVenta)}) está por debajo del sugerido. Calculando con el sugerido oficial de {formatCurrency(suggestedVenta)} tu ganancia aumenta:
            </p>

            {/* Quick compare summary cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/90 p-2 rounded-xl border border-amber-200/80">
                <span className="text-[10px] text-slate-500 block">Con precio actual:</span>
                <span className="font-extrabold text-slate-800 block">
                  {formatCurrency(baselineGanancia)} ({formatPercent(baselineMargen)})
                </span>
                <span className="text-[10px] text-slate-400">Venta: {formatCurrency(originalVenta)}</span>
              </div>

              <div className="bg-emerald-50/90 p-2 rounded-xl border border-emerald-300">
                <span className="text-[10px] text-emerald-800 font-semibold block">Con precio sugerido:</span>
                <span className="font-extrabold text-emerald-700 block">
                  {formatCurrency(suggestedGanancia)} ({formatPercent(suggestedMargen)})
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  +{formatCurrency(gainDifference)} (+{formatPercent(marginDifference)})
                </span>
              </div>
            </div>

            {/* Action to switch between current and suggested price */}
            <div className="flex items-center gap-2 pt-0.5">
              {!isCurrentlySugerido ? (
                <button
                  onClick={() => setVenta(suggestedVenta)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aplicar sugerido ({formatCurrency(suggestedVenta)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center justify-between w-full bg-emerald-100/70 border border-emerald-300 px-3 py-1.5 rounded-xl">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Calculando con precio sugerido
                  </span>
                  <button
                    onClick={() => setVenta(originalVenta)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restablecer actual
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inputs */}
        <div className="mt-3.5 space-y-2.5">
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-1">
              <span>Precio de Venta Meli ($)</span>
              <span className="text-amber-700 font-bold">{formatCurrency(venta)}</span>
            </label>
            <input
              type="number"
              value={venta || ''}
              onChange={(e) => setVenta(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-1">
              <span>Costo de Compra Proveedor ($)</span>
              <span className="text-slate-500">{formatCurrency(compra)}</span>
            </label>
            <input
              type="number"
              value={compra || ''}
              onChange={(e) => setCompra(Number(e.target.value))}
              placeholder="Ej: 65000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Comisión Meli (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={comisionPercent}
                onChange={(e) => setComisionPercent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                -{formatCurrency(comisionAmount)}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Envío Fijo Meli ($)
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Costo flete
              </span>
            </div>
          </div>
        </div>

        {/* Live Calculation Results Box */}
        <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Resultado en Vivo
            </span>
            <span className="text-xs text-slate-600">
              Recibís Meli:{' '}
              <strong className="text-blue-700">{formatCurrency(recibis)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Margen sobre Venta
              </span>
              <span
                className={`text-xl font-black block mt-0.5 ${
                  margenPercent < 0 ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {formatPercent(margenPercent, true)}
              </span>
              <span className="text-[10px] text-slate-400">Markup: {formatPercent(markupPercent)}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Ganancia Neta
              </span>
              <span
                className={`text-xl font-black block mt-0.5 ${
                  ganancia < 0 ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {formatCurrency(ganancia)}
              </span>
              <span className="text-[10px] text-slate-400">
                {ganancia >= 0 ? 'Rentable' : '¡Pérdida!'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3.5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Cerrar
          </button>
          {product && onSaveProductPrice && (
            <button
              onClick={handleApplySavedPrice}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Guardar en producto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
