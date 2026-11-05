import React from 'react';
import { Search, X, Calculator, Plus, AlertCircle } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
  filteredCount: number;
  lossCount: number;
  onOpenCalculator: () => void;
  onOpenNewProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  totalCount,
  filteredCount,
  lossCount,
  onOpenCalculator,
  onOpenNewProduct,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5">
        {/* Top bar with branding and actions */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-black text-base shadow-xs">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">PetMargin</h1>
                <span className="text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded-md">
                  Precios & Margen
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">Control de rentabilidad en Mercado Libre</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenCalculator}
              aria-label="Abrir simulador rápido"
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition text-slate-700 border border-slate-200 flex items-center gap-1.5 text-xs font-semibold"
              title="Simulador de margen"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Simulador</span>
            </button>
            <button
              onClick={onOpenNewProduct}
              aria-label="Agregar producto"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 transition text-white flex items-center gap-1 text-xs font-semibold shadow-xs"
              title="Nuevo producto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {/* Minimal Search Bar */}
        <div className="mt-2.5 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar alimento, presentación (15 kg), gato, perro..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600"
                aria-label="Borrar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Counter brief */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-0.5">
          <span>
            Mostrando <strong className="text-slate-800">{filteredCount}</strong> de {totalCount} productos
          </span>
          {lossCount > 0 && (
            <span className="inline-flex items-center gap-1 text-red-600 font-semibold bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-md">
              <AlertCircle className="w-3 h-3 text-red-500" />
              {lossCount} a pérdida
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
