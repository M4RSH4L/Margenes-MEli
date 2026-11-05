import React from 'react';
import { ProductItem, Supplier } from '../types/product';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

interface StatsOverviewProps {
  products: ProductItem[];
  suppliers: Supplier[];
  onSelectSupplier: (supplier: Supplier) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  products,
  suppliers,
  onSelectSupplier,
}) => {
  const totalProducts = products.length;
  const productsWithMargin = products.filter((p) => p.margenMeliPercent !== null);

  const avgMargin =
    productsWithMargin.reduce((acc, p) => acc + (p.margenMeliPercent ?? 0), 0) /
    (productsWithMargin.length || 1);

  const totalProfitPool = products.reduce((acc, p) => acc + (p.gananciaMeli ?? 0), 0);

  const profitableCount = products.filter((p) => (p.gananciaMeli ?? 0) > 0).length;
  const lossCount = products.filter((p) => (p.gananciaMeli ?? 0) < 0).length;

  // Breakdown by supplier
  const supplierStats = suppliers.map((supplier) => {
    const suppProducts = products.filter((p) => p.supplier === supplier);
    const valid = suppProducts.filter((p) => p.margenMeliPercent !== null);
    const suppAvgMargin =
      valid.reduce((acc, p) => acc + (p.margenMeliPercent ?? 0), 0) / (valid.length || 1);
    const suppTotalProfit = suppProducts.reduce((acc, p) => acc + (p.gananciaMeli ?? 0), 0);
    const lossSuppCount = suppProducts.filter((p) => (p.gananciaMeli ?? 0) < 0).length;

    return {
      supplier,
      count: suppProducts.length,
      avgMargin: suppAvgMargin,
      totalProfit: suppTotalProfit,
      lossCount: lossSuppCount,
    };
  }).sort((a, b) => b.avgMargin - a.avgMargin);

  // Distribution ranges
  const rangeHigh = products.filter((p) => (p.margenMeliPercent ?? 0) >= 15).length;
  const rangeMed = products.filter((p) => (p.margenMeliPercent ?? 0) >= 5 && (p.margenMeliPercent ?? 0) < 15).length;
  const rangeLow = products.filter((p) => (p.margenMeliPercent ?? 0) >= 0 && (p.margenMeliPercent ?? 0) < 5).length;
  const rangeNegative = lossCount;

  return (
    <div className="space-y-3.5 pb-20">
      {/* Top Banner in Light Mode */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Resumen Ejecutivo de Rentabilidad
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Métricas consolidadas de precios, comisiones y rentabilidad de catálogo.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Margen Promedio */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Margen Promedio Meli
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-0.5">
            {formatPercent(avgMargin)}
          </span>
          <span className="text-[11px] text-slate-500">Sobre venta bruta</span>
        </div>

        {/* Ganancia Acumulada */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Pool Ganancia Catálogo
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 block mt-0.5">
            {formatCurrency(totalProfitPool)}
          </span>
          <span className="text-[11px] text-slate-500">1 u. de cada producto</span>
        </div>

        {/* Productos Rentables */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1.5 mb-0.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Rentables</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-emerald-700 block">
            {profitableCount}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.round((profitableCount / totalProducts) * 100)}%)
            </span>
          </span>
          <span className="text-[11px] text-slate-500">Dejan ganancia neta</span>
        </div>

        {/* Productos a Pérdida */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[10px] uppercase font-bold text-slate-400">A Pérdida</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-red-600 block">
            {lossCount}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.round((lossCount / totalProducts) * 100)}%)
            </span>
          </span>
          <span className="text-[11px] text-red-600/90 font-medium">Revisar precios/envío</span>
        </div>
      </div>

      {/* Distribution of Margins Bar */}
      <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Distribución de Márgenes del Catálogo
        </h3>
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex mb-2">
          <div
            style={{ width: `${(rangeHigh / totalProducts) * 100}%` }}
            className="bg-emerald-500 h-full"
            title={`Alta rentabilidad (>15%): ${rangeHigh}`}
          />
          <div
            style={{ width: `${(rangeMed / totalProducts) * 100}%` }}
            className="bg-sky-500 h-full"
            title={`Media (5-15%): ${rangeMed}`}
          />
          <div
            style={{ width: `${(rangeLow / totalProducts) * 100}%` }}
            className="bg-amber-400 h-full"
            title={`Baja (0-5%): ${rangeLow}`}
          />
          <div
            style={{ width: `${(rangeNegative / totalProducts) * 100}%` }}
            className="bg-red-500 h-full"
            title={`Pérdida (<0%): ${rangeNegative}`}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>&gt;15%: {rangeHigh} prods</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
            <span>5-15%: {rangeMed} prods</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>0-5%: {rangeLow} prods</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>&lt;0%: {rangeNegative} prods</span>
          </div>
        </div>
      </div>

      {/* Supplier Comparison Table */}
      <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Rentabilidad Comparativa por Proveedor
        </h3>
        <div className="space-y-1.5">
          {supplierStats.map((item, idx) => (
            <div
              key={item.supplier}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100/70 transition cursor-pointer"
              onClick={() => onSelectSupplier(item.supplier)}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 text-slate-400 font-bold">#{idx + 1}</span>
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1">
                    {item.supplier}
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {item.count} productos {item.lossCount > 0 && `(${item.lossCount} a pérdida)`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-black text-xs sm:text-sm block ${
                    item.avgMargin < 0 ? 'text-red-600' : item.avgMargin > 15 ? 'text-emerald-700' : 'text-slate-900'
                  }`}
                >
                  {formatPercent(item.avgMargin)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Pool: {formatCurrency(item.totalProfit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
