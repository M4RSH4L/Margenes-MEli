import React from 'react';
import { Package, Trophy, Calculator, BarChart3 } from 'lucide-react';

export type ActiveTab = 'catalog' | 'ranking' | 'calculator' | 'stats';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  lossCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  lossCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 text-slate-600 shadow-lg safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5">
        {/* Catálogo */}
        <button
          onClick={() => onChangeTab('catalog')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
            activeTab === 'catalog'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Package className={`w-5 h-5 mb-0.5 ${activeTab === 'catalog' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Catálogo</span>
        </button>

        {/* Ranking */}
        <button
          onClick={() => onChangeTab('ranking')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl relative transition ${
            activeTab === 'ranking'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Trophy className={`w-5 h-5 mb-0.5 ${activeTab === 'ranking' ? 'text-amber-500' : 'text-slate-400'}`} />
            {lossCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px]">Ranking</span>
        </button>

        {/* Simulador */}
        <button
          onClick={() => onChangeTab('calculator')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
            activeTab === 'calculator'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Calculator className={`w-5 h-5 mb-0.5 ${activeTab === 'calculator' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Simulador</span>
        </button>

        {/* Resumen */}
        <button
          onClick={() => onChangeTab('stats')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
            activeTab === 'stats'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <BarChart3 className={`w-5 h-5 mb-0.5 ${activeTab === 'stats' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Resumen</span>
        </button>
      </div>
    </nav>
  );
};
