/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ProductItem, Supplier } from './types/product';
import { INITIAL_PRODUCTS, SUPPLIERS } from './data/products';
import { filterProducts } from './utils/calculator';
import { Header } from './components/Header';
import { SupplierSegmentedBar } from './components/SupplierSegmentedBar';
import { ProductCard } from './components/ProductCard';
import { RankingView } from './components/RankingView';
import { StatsOverview } from './components/StatsOverview';
import { QuickSimulatorModal } from './components/QuickSimulatorModal';
import { NewProductModal } from './components/NewProductModal';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { Package, Sparkles, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'petmargin_products_v2_light';

export default function App() {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore
    }
  }, [products]);

  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'Todos'>('Todos');
  const [selectedPetType, setSelectedPetType] = useState<'todos' | 'perro' | 'gato'>('todos');
  const [selectedProfitFilter, setSelectedProfitFilter] = useState<'todos' | 'rentable' | 'baja' | 'perdida'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulationProduct, setSimulationProduct] = useState<ProductItem | null>(null);
  const [simulatorUseSugerido, setSimulatorUseSugerido] = useState(false);
  const [newProductOpen, setNewProductOpen] = useState(false);

  // Supplier Counts calculation
  const supplierCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: products.length,
    };
    SUPPLIERS.forEach((s) => {
      counts[s] = products.filter((p) => p.supplier === s).length;
    });
    return counts;
  }, [products]);

  // Filtered Products for the catalog
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      supplier: selectedSupplier,
      petType: selectedPetType,
      profitFilter: selectedProfitFilter,
      searchTerm,
    });
  }, [products, selectedSupplier, selectedPetType, selectedProfitFilter, searchTerm]);

  // Overall loss count
  const lossCount = useMemo(() => {
    return products.filter((p) => p.gananciaMeli !== null && p.gananciaMeli < 0).length;
  }, [products]);

  // Handlers
  const handleOpenSimulator = (product?: ProductItem, useSuggested = false) => {
    setSimulationProduct(product || products[0]);
    setSimulatorUseSugerido(useSuggested);
    setSimulatorOpen(true);
  };

  const handleSaveProductPrice = (updated: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    setActiveTab('catalog');
  };

  const handleResetCatalog = () => {
    if (confirm('¿Restablecer el catálogo a los datos iniciales?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Minimal Light Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={products.length}
        filteredCount={filteredProducts.length}
        lossCount={lossCount}
        onOpenCalculator={() => handleOpenSimulator()}
        onOpenNewProduct={() => setNewProductOpen(true)}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto pb-16">
        {activeTab === 'catalog' && (
          <div>
            {/* Minimal Segmented Bar by Supplier (wrapped, no scrollbars) */}
            <SupplierSegmentedBar
              suppliers={SUPPLIERS}
              selectedSupplier={selectedSupplier}
              onSelectSupplier={setSelectedSupplier}
              supplierCounts={supplierCounts}
            />

            {/* Catalog Products List */}
            <div className="p-3.5 space-y-2.5">
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center my-6 shadow-xs">
                  <Package className="w-10 h-10 text-slate-400 mx-auto mb-2.5" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    No se encontraron productos
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-3.5">
                    Prueba cambiando los filtros de proveedor o la búsqueda.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSupplier('Todos');
                      setSelectedPetType('todos');
                      setSelectedProfitFilter('todos');
                      setSearchTerm('');
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                  >
                    Restablecer filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSimulate={handleOpenSimulator}
                      onEditCost={handleOpenSimulator}
                    />
                  ))}
                </div>
              )}

              {/* Reset to defaults helper button at the bottom */}
              <div className="text-center pt-5 pb-8">
                <button
                  onClick={handleResetCatalog}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restablecer catálogo inicial
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="p-3.5">
            <RankingView
              products={products}
              suppliers={SUPPLIERS}
              onSimulate={handleOpenSimulator}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="p-3.5 space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Simulador Rápido de Precios
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecciona cualquier producto para simular variaciones de precio de venta, comisiones y costos de envío.
              </p>
            </div>

            {/* Product Picker */}
            <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Seleccionar Producto del Catálogo:
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                value={simulationProduct?.id || products[0]?.id}
                onChange={(e) => {
                  const found = products.find((p) => p.id === e.target.value);
                  if (found) setSimulationProduct(found);
                }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.supplier}] {p.name} - Venta: ${p.ventaMeli}
                  </option>
                ))}
              </select>
              {/* Propuesta si el producto seleccionado está por debajo del sugerido */}
              {simulationProduct && simulationProduct.sugerido > simulationProduct.ventaMeli && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Precio por debajo del sugerido
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Sugerido: ${simulationProduct.sugerido.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Actualmente se vende a ${simulationProduct.ventaMeli.toLocaleString('es-AR')}. Puedes calcular directamente con el sugerido oficial del proveedor.
                  </p>
                  <button
                    onClick={() => handleOpenSimulator(simulationProduct, true)}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <span>Calcular con precio sugerido (${simulationProduct.sugerido.toLocaleString('es-AR')})</span>
                  </button>
                </div>
              )}

              <div className="mt-3">
                <button
                  onClick={() => handleOpenSimulator(simulationProduct || products[0], false)}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  Abrir Calculadora Interactiva en Vivo
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-700 shadow-xs">
              <h4 className="font-bold text-slate-900">💡 Consejos para optimizar márgenes en Mercado Libre:</h4>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>
                  <strong>Bolsas de 15 kg a 22 kg:</strong> El flete logístico ($16.290 a $23.190) reduce el margen si el precio de venta está muy ajustado.
                </li>
                <li>
                  <strong>Retiro en sucursal / Local:</strong> Al vender directo o con retiro propio se ahorra el flete, duplicando el margen en productos como Baires o Purina.
                </li>
                <li>
                  <strong>Productos con precio por debajo del sugerido:</strong> Ajustar paulatinamente el precio hacia el sugerido oficial del fabricante.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="p-3.5">
            <StatsOverview
              products={products}
              suppliers={SUPPLIERS}
              onSelectSupplier={(supp) => {
                setSelectedSupplier(supp);
                setActiveTab('catalog');
              }}
            />
          </div>
        )}
      </main>

      {/* Simulator Modal */}
      <QuickSimulatorModal
        isOpen={simulatorOpen}
        product={simulationProduct}
        initialUseSugerido={simulatorUseSugerido}
        onClose={() => setSimulatorOpen(false)}
        onSaveProductPrice={handleSaveProductPrice}
      />

      {/* New Product Modal */}
      <NewProductModal
        isOpen={newProductOpen}
        onClose={() => setNewProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Mobile Bottom Navigation Bar */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        lossCount={lossCount}
      />
    </div>
  );
}
