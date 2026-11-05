import React from 'react';
import { Supplier } from '../types/product';

interface SupplierSegmentedBarProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | 'Todos';
  onSelectSupplier: (supplier: Supplier | 'Todos') => void;
  supplierCounts: Record<string, number>;
  selectedPetType: 'todos' | 'perro' | 'gato';
  onSelectPetType: (type: 'todos' | 'perro' | 'gato') => void;
  selectedProfitFilter: 'todos' | 'rentable' | 'baja' | 'perdida';
  onSelectProfitFilter: (filter: 'todos' | 'rentable' | 'baja' | 'perdida') => void;
}

export const SupplierSegmentedBar: React.FC<SupplierSegmentedBarProps> = ({
  suppliers,
  selectedSupplier,
  onSelectSupplier,
  supplierCounts,
  selectedPetType,
  onSelectPetType,
  selectedProfitFilter,
  onSelectProfitFilter,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/90 py-2 px-4 sticky top-[113px] z-20 shadow-xs">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Header label */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Segmentado por Proveedor
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {selectedSupplier === 'Todos' ? 'Todos los proveedores' : selectedSupplier}
          </span>
        </div>

        {/* Clean, wrapped supplier pills without any horizontal scrollbars */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectSupplier('Todos')}
            className={`px-2.5 py-1 rounded-lg text-xs transition border flex items-center gap-1.5 ${
              selectedSupplier === 'Todos'
                ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span>Todos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedSupplier === 'Todos' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {supplierCounts['Todos'] || 0}
            </span>
          </button>

          {suppliers.map((supp) => {
            const isActive = selectedSupplier === supp;
            const count = supplierCounts[supp] || 0;
            return (
              <button
                key={supp}
                onClick={() => onSelectSupplier(supp)}
                className={`px-2.5 py-1 rounded-lg text-xs transition border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>{supp}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimal secondary filters (no scrollbars, flex-wrap) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100 text-xs">
          {/* Pet Type filters */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-slate-400 mr-1">Mascota:</span>
            <button
              onClick={() => onSelectPetType('todos')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition ${
                selectedPetType === 'todos'
                  ? 'bg-slate-200/90 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => onSelectPetType('perro')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition flex items-center gap-1 ${
                selectedPetType === 'perro'
                  ? 'bg-blue-100 text-blue-900 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🐶 Perros
            </button>
            <button
              onClick={() => onSelectPetType('gato')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition flex items-center gap-1 ${
                selectedPetType === 'gato'
                  ? 'bg-purple-100 text-purple-900 font-bold border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🐱 Gatos
            </button>
          </div>

          {/* Profit status filters */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-slate-400 mr-1">Margen:</span>
            <button
              onClick={() => onSelectProfitFilter('todos')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition ${
                selectedProfitFilter === 'todos'
                  ? 'bg-slate-200/90 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => onSelectProfitFilter('rentable')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition ${
                selectedProfitFilter === 'rentable'
                  ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 &gt;10%
            </button>
            <button
              onClick={() => onSelectProfitFilter('perdida')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition ${
                selectedProfitFilter === 'perdida'
                  ? 'bg-red-100 text-red-900 font-bold border border-red-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔴 Pérdida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
