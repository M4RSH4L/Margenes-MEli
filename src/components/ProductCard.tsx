import React, { useState } from 'react';
import { ProductItem } from '../types/product';
import { formatCurrency, formatPercent, getProfitStatus } from '../utils/calculator';
import { ChevronDown, ChevronUp, Calculator, AlertCircle, CheckCircle2, Store, Truck, ShieldAlert, Sparkles, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onSimulate: (product: ProductItem, useSuggested?: boolean) => void;
  onEditCost?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSimulate,
  onEditCost,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const profitStatus = getProfitStatus(product.gananciaMeli);
  const isBelowSugerido = product.sugerido > product.ventaMeli;
  const differenceWithSugerido = product.sugerido - product.ventaMeli;

  const getProfitBadge = () => {
    if (product.gananciaMeli === null) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          Falta costo
        </span>
      );
    }

    if (profitStatus === 'loss') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
          <ShieldAlert className="w-3 h-3 text-red-600" />
          Pérdida ({formatPercent(product.margenMeliPercent)})
        </span>
      );
    }

    if (profitStatus === 'low') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
          Margen bajo ({formatPercent(product.margenMeliPercent)})
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        {formatPercent(product.margenMeliPercent)}
      </span>
    );
  };

  const getBrandTagClass = (supplier: string) => {
    switch (supplier) {
      case 'Royal Canin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Old Prince':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Purina Excellent':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Fawna':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Eukanuba':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Origen':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
      <div>
        {/* Top Header: Brand, Pet, Weight, Status */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getBrandTagClass(product.supplier)}`}>
              {product.supplier}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {product.petType === 'perro' ? '🐶 Perro' : product.petType === 'gato' ? '🐱 Gato' : '🐾 Perro/Gato'}
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {product.weightLabel}
            </span>
          </div>
          <div>{getProfitBadge()}</div>
        </div>

        {/* Product Title */}
        <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-snug mb-2.5">
          {product.name}
        </h2>

        {/* Simplified Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Venta Meli</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
              {formatCurrency(product.ventaMeli)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Costo Compra</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 block mt-0.5">
              {product.compra !== null ? formatCurrency(product.compra) : 'Sin dato'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ganancia Neta</span>
            <span
              className={`text-xs sm:text-sm font-black block mt-0.5 ${
                product.gananciaMeli === null
                  ? 'text-slate-400'
                  : product.gananciaMeli < 0
                  ? 'text-red-600'
                  : 'text-emerald-700'
              }`}
            >
              {product.gananciaMeli !== null ? formatCurrency(product.gananciaMeli) : '-'}
            </span>
          </div>
        </div>

        {/* Propuesta de Cálculo con Precio Sugerido del Proveedor */}
        {isBelowSugerido && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-300 text-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Precio por debajo del sugerido</span>
              </span>
              <span className="text-[11px] font-extrabold text-amber-800">
                +{formatCurrency(differenceWithSugerido)}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 mb-2 leading-relaxed">
              Venta actual: <strong>{formatCurrency(product.ventaMeli)}</strong> vs Sugerido proveedor: <strong>{formatCurrency(product.sugerido)}</strong>.
            </p>
            <button
              onClick={() => onSimulate(product, true)}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calcular con precio sugerido ({formatCurrency(product.sugerido)})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions & Expandable Breakdown */}
      <div>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSimulate(product, false)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-200"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-600" />
            Simular precio
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1 transition border border-slate-200"
          >
            <span>{isExpanded ? 'Menos' : 'Detalles'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Detailed Price Items & Scenario Margins */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-150">
            {/* Itemized Costs */}
            <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex justify-between items-center text-slate-700">
                <span>Precio Venta Meli:</span>
                <span className="font-bold text-slate-900">{formatCurrency(product.ventaMeli)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Precio Sugerido:</span>
                <span className="font-semibold text-slate-700">{formatCurrency(product.sugerido)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Costo de Compra:</span>
                <span className="font-semibold text-slate-900">
                  {product.compra !== null ? formatCurrency(product.compra) : 'Falta registrar'}
                </span>
              </div>
              <div className="h-px bg-slate-200 my-0.5" />
              <div className="flex justify-between items-center text-slate-600">
                <span>Comisión Meli ({product.comisionMeli.percentage}%):</span>
                <span className="text-red-600 font-medium">-{formatCurrency(product.comisionMeli.amount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>{product.deduction.description}:</span>
                <span className="text-red-600 font-medium">-{formatCurrency(product.deduction.amount)}</span>
              </div>
              <div className="h-px bg-slate-200 my-0.5" />
              <div className="flex justify-between items-center text-slate-900 font-bold">
                <span>Recibís en Mano (Meli):</span>
                <span className="text-blue-700">{formatCurrency(product.recibisMeli)}</span>
              </div>
            </div>

            {/* 3 Scenarios Summary */}
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-lg border bg-white border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  Meli (con flete)
                </span>
                <div className="text-right">
                  <span className={`font-bold block ${product.gananciaMeli && product.gananciaMeli < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {product.gananciaMeli !== null ? formatCurrency(product.gananciaMeli) : '-'} ({formatPercent(product.margenMeliPercent)})
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-lg border bg-white border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  Sin Envío (Local)
                </span>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">
                    {formatCurrency(product.sinEnvio.profit)} ({formatPercent(product.sinEnvio.marginPercent)})
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-lg border bg-white border-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                  Con Retenciones
                </span>
                <div className="text-right">
                  <span className={`font-bold block ${product.simuladorPantalla.profit && product.simuladorPantalla.profit < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {formatCurrency(product.simuladorPantalla.profit)} ({formatPercent(product.simuladorPantalla.marginPercent)})
                  </span>
                </div>
              </div>
            </div>

            {product.compra === null && onEditCost && (
              <button
                onClick={() => onEditCost(product)}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold active:scale-95 transition"
              >
                Ingresar costo de compra
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
