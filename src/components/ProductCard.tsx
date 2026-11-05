import React, { useState } from 'react';
import { ProductItem } from '../types/product';
import { formatCurrency, formatPercent, getProfitStatus } from '../utils/calculator';
import { ChevronDown, ChevronUp, Calculator, AlertCircle, CheckCircle2, Store, Truck, ShieldAlert } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onSimulate: (product: ProductItem) => void;
  onEditCost?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSimulate,
  onEditCost,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const profitStatus = getProfitStatus(product.gananciaMeli);

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
        {formatPercent(product.margenMeliPercent)} margen
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

  const differenceWithSugerido = product.sugerido - product.ventaMeli;

  return (
    <article className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs hover:border-slate-300 transition">
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

      {/* Main Highlights Grid: Venta, Compra, Ganancia Neta */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 mb-2.5">
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
            className={`text-xs sm:text-sm font-extrabold block mt-0.5 ${
              product.gananciaMeli === null
                ? 'text-slate-400'
                : product.gananciaMeli < 0
                ? 'text-red-600'
                : 'text-emerald-600'
            }`}
          >
            {product.gananciaMeli !== null ? formatCurrency(product.gananciaMeli) : '-'}
          </span>
        </div>
      </div>

      {/* Sugerido alert if under sugerido */}
      {differenceWithSugerido > 500 && (
        <div className="mb-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg flex items-center justify-between">
          <span>Debajo del sugerido ({formatCurrency(product.sugerido)})</span>
          <span className="font-bold">-{formatCurrency(differenceWithSugerido)}</span>
        </div>
      )}

      {/* Expand / Collapse trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition border border-slate-200/70"
      >
        <span>
          {isExpanded ? 'Ocultar desglose de costos' : 'Ver desglose de precios y márgenes'}
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
      </button>

      {/* Detailed Price Items & Scenario Margins */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-3">
          {/* Detailed Itemized Costs */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <span>📋</span> Detalle de Precios & Deducciones
            </h4>
            <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div className="flex justify-between items-center text-slate-700">
                <span>Precio Venta Meli:</span>
                <span className="font-bold text-slate-900">{formatCurrency(product.ventaMeli)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Precio Sugerido:</span>
                <span className="text-slate-500">{formatCurrency(product.sugerido)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Costo de Compra:</span>
                <span className="font-semibold text-slate-900">
                  {product.compra !== null ? formatCurrency(product.compra) : 'Falta registrar'}
                </span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between items-center text-slate-600">
                <span>Comisión Meli ({product.comisionMeli.percentage}%):</span>
                <span className="text-red-600 font-medium">-{formatCurrency(product.comisionMeli.amount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>{product.deduction.description}:</span>
                <span className="text-red-600 font-medium">-{formatCurrency(product.deduction.amount)}</span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between items-center text-slate-900 font-bold">
                <span>Recibís en Mano (Meli):</span>
                <span className="text-blue-700">{formatCurrency(product.recibisMeli)}</span>
              </div>
            </div>
          </div>

          {/* 3 Margin Scenarios Comparison */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <span>📊</span> Comparativa de 3 Escenarios de Margen
            </h4>
            <div className="space-y-1.5">
              {/* Scenario 1: Meli Normal */}
              <div
                className={`p-2.5 rounded-xl border text-xs ${
                  product.gananciaMeli !== null && product.gananciaMeli < 0
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Mercado Libre (con flete)
                  </span>
                  <span
                    className={`font-black text-xs px-2 py-0.2 rounded-md ${
                      product.gananciaMeli !== null && product.gananciaMeli < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {formatPercent(product.margenMeliPercent)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Ganancia neta:</span>
                  <span
                    className={`font-bold ${
                      product.gananciaMeli !== null && product.gananciaMeli < 0 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {product.gananciaMeli !== null ? formatCurrency(product.gananciaMeli) : '-'}
                  </span>
                </div>
              </div>

              {/* Scenario 2: Sin envío (Local / Directo) */}
              <div className="p-2.5 rounded-xl border bg-white border-slate-200 text-xs text-slate-800">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    {product.sinEnvio.title}
                  </span>
                  <span className="font-black text-xs px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                    {formatPercent(product.sinEnvio.marginPercent)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Ganancia neta:</span>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(product.sinEnvio.profit)}
                  </span>
                </div>
                {product.sinEnvio.note && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{product.sinEnvio.note}</p>
                )}
              </div>

              {/* Scenario 3: Simulador pantalla / Retenciones */}
              <div
                className={`p-2.5 rounded-xl border text-xs ${
                  product.simuladorPantalla.profit !== null && product.simuladorPantalla.profit < 0
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    {product.simuladorPantalla.title}
                  </span>
                  <span
                    className={`font-black text-xs px-2 py-0.2 rounded-md ${
                      product.simuladorPantalla.profit !== null && product.simuladorPantalla.profit < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {formatPercent(product.simuladorPantalla.marginPercent)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Ganancia neta:</span>
                  <span
                    className={`font-bold ${
                      product.simuladorPantalla.profit !== null && product.simuladorPantalla.profit < 0
                        ? 'text-red-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {formatCurrency(product.simuladorPantalla.profit)}
                  </span>
                </div>
                {product.simuladorPantalla.note && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{product.simuladorPantalla.note}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onSimulate(product)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              Simular precio para este producto
            </button>
            {product.compra === null && onEditCost && (
              <button
                onClick={() => onEditCost(product)}
                className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold active:scale-95 transition"
              >
                Ingresar costo
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
