import React, { useState, useMemo } from 'react';
import { ProductItem, Supplier } from '../types/product';
import { formatCurrency, formatPercent, RankingScenarioKey, RankingSortKey, sortProductsForRanking } from '../utils/calculator';
import { Trophy, ArrowDownUp, AlertTriangle, Flame, Calculator } from 'lucide-react';

interface RankingViewProps {
  products: ProductItem[];
  suppliers: Supplier[];
  onSimulate: (product: ProductItem, useSuggested?: boolean) => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  products,
  suppliers,
  onSimulate,
}) => {
  const [scenario, setScenario] = useState<RankingScenarioKey>('meli');
  const [sortBy, setSortBy] = useState<RankingSortKey>('margin');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'Todos'>('Todos');

  // Filter products by selected supplier first
  const supplierFiltered = useMemo(() => {
    if (selectedSupplier === 'Todos') return products;
    return products.filter((p) => p.supplier === selectedSupplier);
  }, [products, selectedSupplier]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProductsForRanking(supplierFiltered, scenario, sortBy, order);
  }, [supplierFiltered, scenario, sortBy, order]);

  // Identify loss items for warnings
  const lossItems = useMemo(() => {
    return sortedProducts.filter((p) => {
      if (scenario === 'meli') return p.margenMeliPercent !== null && p.margenMeliPercent < 0;
      if (scenario === 'sinEnvio') return p.sinEnvio.marginPercent !== null && p.sinEnvio.marginPercent < 0;
      return p.simuladorPantalla.marginPercent !== null && p.simuladorPantalla.marginPercent < 0;
    });
  }, [sortedProducts, scenario]);

  const top3 = sortedProducts.slice(0, 3);

  const getScenarioLabel = (s: RankingScenarioKey) => {
    switch (s) {
      case 'meli':
        return 'Mercado Libre (Envío Incluido)';
      case 'sinEnvio':
        return 'Sin Envío (Venta Local / Retiro)';
      case 'simuladorPantalla':
        return 'Simulador Pantalla / Retenciones';
    }
  };

  const getProductMargin = (p: ProductItem) => {
    if (scenario === 'meli') return p.margenMeliPercent;
    if (scenario === 'sinEnvio') return p.sinEnvio.marginPercent;
    return p.simuladorPantalla.marginPercent;
  };

  const getProductProfit = (p: ProductItem) => {
    if (scenario === 'meli') return p.gananciaMeli;
    if (scenario === 'sinEnvio') return p.sinEnvio.profit;
    return p.simuladorPantalla.profit;
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Title & Description in Minimal Light Style */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Ranking de Rentabilidad</h2>
            <p className="text-xs text-slate-500">
              Ordenado de mayor a menor margen para detectar productos estrella y pérdidas.
            </p>
          </div>
        </div>
      </div>

      {/* Loss Warning Banner if any items lose money */}
      {lossItems.length > 0 && order === 'desc' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-900">
          <div className="p-1 rounded-lg bg-red-100 text-red-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-red-800">
              ⚠️ Alerta: {lossItems.length} productos con margen NEGATIVO
            </h4>
            <p className="text-red-700/90 text-[11px] mt-0.5 leading-relaxed">
              En el escenario actual estos artículos dan pérdida por costo de flete.
            </p>
            <button
              onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
              className="text-[11px] font-bold text-red-700 underline hover:text-red-900 mt-1 block"
            >
              {order === 'desc' ? 'Ver productos a pérdida primero' : 'Volver a ver más rentables primero'}
            </button>
          </div>
        </div>
      )}

      {/* Minimal Control Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 space-y-2.5 shadow-xs">
        {/* Scenario Tabs */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Escenario a Evaluar:
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setScenario('meli')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center ${
                scenario === 'meli'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meli Estándar
            </button>
            <button
              onClick={() => setScenario('sinEnvio')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center ${
                scenario === 'sinEnvio'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sin Envío (Local)
            </button>
            <button
              onClick={() => setScenario('simuladorPantalla')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center ${
                scenario === 'simuladorPantalla'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Con Retenciones
            </button>
          </div>
        </div>

        {/* Metric & Order Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Métrica:</span>
            <button
              onClick={() => setSortBy('margin')}
              className={`text-xs px-2.5 py-1 rounded-lg border transition font-bold ${
                sortBy === 'margin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              % Margen
            </button>
            <button
              onClick={() => setSortBy('profit')}
              className={`text-xs px-2.5 py-1 rounded-lg border transition font-bold ${
                sortBy === 'profit'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Ganancia $
            </button>
          </div>

          <button
            onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold transition"
          >
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-500" />
            {order === 'desc' ? 'Mayor a Menor' : 'Menor a Mayor'}
          </button>
        </div>

        {/* Brand chips wrapped (NO scrollbars) */}
        <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-medium text-slate-500 mr-1">Marca:</span>
          <button
            onClick={() => setSelectedSupplier('Todos')}
            className={`text-xs px-2 py-0.5 rounded-md transition ${
              selectedSupplier === 'Todos'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          {suppliers.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSupplier(s)}
              className={`text-xs px-2 py-0.5 rounded-md transition ${
                selectedSupplier === s
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Podium for Top 3 (if sorted desc) */}
      {order === 'desc' && top3.length >= 3 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Podio: Top 3 Más Rentables
            </span>
            <span className="text-[10px] text-slate-400">{getScenarioLabel(scenario)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* 2nd place */}
            <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-lg block mb-0.5">🥈</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">2º Puesto</span>
                <p className="text-[11px] font-bold text-slate-800 line-clamp-2 mt-0.5 leading-tight">
                  {top3[1].name}
                </p>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                <span className="text-xs font-black text-emerald-700 block">
                  {formatPercent(getProductMargin(top3[1]))}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {formatCurrency(getProductProfit(top3[1]))}
                </span>
              </div>
            </div>

            {/* 1st place */}
            <div className="bg-amber-50/80 border-2 border-amber-400 p-2 rounded-xl flex flex-col justify-between relative shadow-xs">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Líder
              </span>
              <div>
                <span className="text-xl block mb-0.5">🥇</span>
                <span className="text-[10px] uppercase font-black text-amber-800">1º Puesto</span>
                <p className="text-[11px] font-bold text-slate-900 line-clamp-2 mt-0.5 leading-tight">
                  {top3[0].name}
                </p>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-amber-300/80">
                <span className="text-sm font-black text-emerald-800 block">
                  {formatPercent(getProductMargin(top3[0]))}
                </span>
                <span className="text-[10px] font-bold text-amber-900 block">
                  {formatCurrency(getProductProfit(top3[0]))}
                </span>
              </div>
            </div>

            {/* 3rd place */}
            <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-lg block mb-0.5">🥉</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">3º Puesto</span>
                <p className="text-[11px] font-bold text-slate-800 line-clamp-2 mt-0.5 leading-tight">
                  {top3[2].name}
                </p>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                <span className="text-xs font-black text-emerald-700 block">
                  {formatPercent(getProductMargin(top3[2]))}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {formatCurrency(getProductProfit(top3[2]))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Ranked List */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Ranking completo ({sortedProducts.length} productos)</span>
          <span>Orden: {sortBy === 'margin' ? '% Margen' : 'Ganancia $'}</span>
        </div>

        {sortedProducts.map((product, index) => {
          const margin = getProductMargin(product);
          const profit = getProductProfit(product);
          const isNegative = margin !== null && margin < 0;

          return (
            <div
              key={product.id}
              className={`p-2.5 rounded-xl border transition ${
                isNegative
                  ? 'bg-red-50/60 border-red-200'
                  : index < 3 && order === 'desc'
                  ? 'bg-amber-50/30 border-amber-300/80'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Rank Number */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    order === 'desc' && index === 0
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : order === 'desc' && index === 1
                      ? 'bg-slate-300 text-slate-900 font-bold'
                      : order === 'desc' && index === 2
                      ? 'bg-amber-700 text-white font-bold'
                      : isNegative
                      ? 'bg-red-100 text-red-700 font-bold'
                      : 'bg-slate-100 text-slate-700 font-bold'
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {product.supplier}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {product.weightLabel}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-500 mt-0.5">
                    <span>
                      Venta: <strong className="text-slate-800">{formatCurrency(product.ventaMeli)}</strong>
                    </span>
                    <span>
                      Costo:{' '}
                      <strong className="text-slate-800">
                        {product.compra !== null ? formatCurrency(product.compra) : 'Sin dato'}
                      </strong>
                    </span>
                  </div>

                  {/* Visual Margin Bar */}
                  {margin !== null && (
                    <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isNegative ? 'bg-red-500' : margin > 15 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{
                          width: `${Math.min(Math.max(Math.abs(margin), 5), 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Margin & Profit Result */}
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs sm:text-sm font-black block ${
                      margin === null ? 'text-slate-400' : isNegative ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {formatPercent(margin, true)}
                  </span>
                  <span
                    className={`text-[11px] font-semibold block ${
                      profit === null ? 'text-slate-400' : isNegative ? 'text-red-600' : 'text-slate-700'
                    }`}
                  >
                    {formatCurrency(profit)}
                  </span>
                  <div className="flex flex-col items-end gap-1 mt-1">
                    {product.sugerido > product.ventaMeli && (
                      <button
                        onClick={() => onSimulate(product, true)}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-0.5 transition"
                        title="Calcular con precio sugerido oficial"
                      >
                        ⚡ Con sugerido
                      </button>
                    )}
                    <button
                      onClick={() => onSimulate(product, false)}
                      className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 justify-end"
                    >
                      <Calculator className="w-3 h-3 text-slate-500" />
                      Simular
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
