import React, { useState, useEffect } from 'react';
import { ProductItem } from '../types/product';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { X, Calculator, Sparkles, Check } from 'lucide-react';

interface QuickSimulatorModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProductPrice?: (updatedProduct: ProductItem) => void;
}

export const QuickSimulatorModal: React.FC<QuickSimulatorModalProps> = ({
  product,
  isOpen,
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
      setVenta(product.ventaMeli);
      setCompra(product.compra ?? 0);
      setComisionPercent(product.comisionMeli.percentage || 12.5);
      setShippingFee(product.deduction.amount || 0);
      setRetencionPercent(0);
    }
  }, [product]);

  if (!isOpen) return null;

  const comisionAmount = (venta * comisionPercent) / 100;
  const retencionAmount = (venta * retencionPercent) / 100;
  const recibis = venta - comisionAmount - shippingFee - retencionAmount;
  const ganancia = recibis - compra;
  const margenPercent = venta > 0 ? (ganancia / venta) * 100 : 0;
  const markupPercent = compra > 0 ? (ganancia / compra) * 100 : 0;

  const calcTargetSalePrice = (targetMarginDecimal: number) => {
    const divisor = 1 - comisionPercent / 100 - retencionPercent / 100 - targetMarginDecimal;
    if (divisor <= 0) return null;
    return (shippingFee + compra) / divisor;
  };

  const target15 = calcTargetSalePrice(0.15);
  const target20 = calcTargetSalePrice(0.2);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Simulador de Margen en Vivo</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[240px] sm:max-w-xs">
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

        {/* Inputs */}
        <div className="mt-3.5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-1">
              <span>Precio de Venta Mercado Libre ($)</span>
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

          <div className="grid grid-cols-2 gap-2.5">
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
                Envío / Cargo Fijo ($)
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Costo logístico Meli
              </span>
            </div>
          </div>
        </div>

        {/* Live Calculation Results Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Resultado en Vivo
            </span>
            <span className="text-xs text-slate-600">
              Recibís Meli:{' '}
              <strong className="text-blue-700">{formatCurrency(recibis)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
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

        {/* Smart Price Target Suggestions */}
        {compra > 0 && (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
            <div className="flex items-center gap-1 font-bold text-amber-900 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sugerencias de Precio Óptimo:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded-lg border border-amber-200/60">
                <span className="text-[10px] text-slate-500 block">Margen al 15%:</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {target15 ? formatCurrency(Math.round(target15)) : '-'}
                </span>
                {target15 && (
                  <button
                    onClick={() => setVenta(Math.round(target15))}
                    className="text-[10px] font-bold text-amber-700 underline mt-0.5 block"
                  >
                    Aplicar precio
                  </button>
                )}
              </div>

              <div className="bg-white p-2 rounded-lg border border-amber-200/60">
                <span className="text-[10px] text-slate-500 block">Margen al 20%:</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {target20 ? formatCurrency(Math.round(target20)) : '-'}
                </span>
                {target20 && (
                  <button
                    onClick={() => setVenta(Math.round(target20))}
                    className="text-[10px] font-bold text-amber-700 underline mt-0.5 block"
                  >
                    Aplicar precio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
