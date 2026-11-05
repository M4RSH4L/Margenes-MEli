import React from 'react';
import { Supplier } from '../types/product';

interface SupplierSegmentedBarProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | 'Todos';
  onSelectSupplier: (supplier: Supplier | 'Todos') => void;
  supplierCounts: Record<string, number>;
}

export const SupplierSegmentedBar: React.FC<SupplierSegmentedBarProps> = ({
  suppliers,
  selectedSupplier,
  onSelectSupplier,
  supplierCounts,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/90 py-2 px-4 sticky top-[95px] z-20 shadow-xs">
      <div className="max-w-4xl mx-auto space-y-1.5">
        {/* Header label */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Segmentado por Proveedor
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {selectedSupplier === 'Todos' ? 'Todos los proveedores' : selectedSupplier}
          </span>
        </div>

        {/* Clean wrapped supplier pills */}
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
      </div>
    </div>
  );
};
