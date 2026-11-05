import { ProductItem, Supplier } from '../types/product';

/**
 * Formats a numeric value into Argentine Peso currency string ($ 123.456 or $ 123.456,78).
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Sin dato';
  }
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: absAmount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats a percentage value (e.g. 13.5 -> "13.5%", -4.2 -> "-4.2%").
 */
export function formatPercent(percent: number | null | undefined, showSign = false): string {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return '-%';
  }
  const sign = showSign && percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

/**
 * Determines profit status category for visual colors and badges.
 */
export function getProfitStatus(profit: number | null | undefined): 'profit' | 'low' | 'loss' | 'unknown' {
  if (profit === null || profit === undefined || isNaN(profit)) return 'unknown';
  if (profit < 0) return 'loss';
  if (profit < 2000) return 'low';
  return 'profit';
}

/**
 * Calculates profit and margin based on sale price, purchase cost, commission % and deduction fee.
 */
export function calculateScenario(
  venta: number,
  compra: number | null,
  commissionPercent: number,
  deductionAmount: number
) {
  const comisionAmount = (venta * commissionPercent) / 100;
  const recibis = venta - comisionAmount - deductionAmount;
  const ganancia = compra !== null ? recibis - compra : null;
  const margenPercent = (ganancia !== null && venta > 0) ? (ganancia / venta) * 100 : null;
  const markupPercent = (ganancia !== null && compra !== null && compra > 0) ? (ganancia / compra) * 100 : null;

  return {
    venta,
    compra,
    comisionAmount,
    deductionAmount,
    recibis,
    ganancia,
    margenPercent,
    markupPercent,
  };
}

export type RankingScenarioKey = 'meli' | 'sinEnvio' | 'simuladorPantalla';
export type RankingSortKey = 'margin' | 'profit' | 'venta';

/**
 * Sorts products for the Ranking view.
 */
export function sortProductsForRanking(
  products: ProductItem[],
  scenario: RankingScenarioKey = 'meli',
  sortBy: RankingSortKey = 'margin',
  order: 'desc' | 'asc' = 'desc'
): ProductItem[] {
  return [...products].sort((a, b) => {
    let valA: number;
    let valB: number;

    if (scenario === 'meli') {
      if (sortBy === 'margin') {
        valA = a.margenMeliPercent ?? -9999;
        valB = b.margenMeliPercent ?? -9999;
      } else if (sortBy === 'profit') {
        valA = a.gananciaMeli ?? -9999999;
        valB = b.gananciaMeli ?? -9999999;
      } else {
        valA = a.ventaMeli;
        valB = b.ventaMeli;
      }
    } else if (scenario === 'sinEnvio') {
      if (sortBy === 'margin') {
        valA = a.sinEnvio.marginPercent ?? -9999;
        valB = b.sinEnvio.marginPercent ?? -9999;
      } else if (sortBy === 'profit') {
        valA = a.sinEnvio.profit ?? -9999999;
        valB = b.sinEnvio.profit ?? -9999999;
      } else {
        valA = a.ventaMeli;
        valB = b.ventaMeli;
      }
    } else {
      if (sortBy === 'margin') {
        valA = a.simuladorPantalla.marginPercent ?? -9999;
        valB = b.simuladorPantalla.marginPercent ?? -9999;
      } else if (sortBy === 'profit') {
        valA = a.simuladorPantalla.profit ?? -9999999;
        valB = b.simuladorPantalla.profit ?? -9999999;
      } else {
        valA = a.ventaMeli;
        valB = b.ventaMeli;
      }
    }

    return order === 'desc' ? valB - valA : valA - valB;
  });
}

/**
 * Filter products based on search term, supplier, and pet type.
 */
export function filterProducts(
  products: ProductItem[],
  filters: {
    searchTerm?: string;
    supplier?: Supplier | 'Todos';
    petType?: 'todos' | 'perro' | 'gato';
    profitFilter?: 'todos' | 'rentable' | 'baja' | 'perdida';
  }
): ProductItem[] {
  const query = filters.searchTerm?.toLowerCase().trim() || '';

  return products.filter((prod) => {
    // Supplier check
    if (filters.supplier && filters.supplier !== 'Todos' && prod.supplier !== filters.supplier) {
      return false;
    }

    // Pet type check
    if (filters.petType && filters.petType !== 'todos') {
      if (prod.petType !== filters.petType && prod.petType !== 'ambos') {
        return false;
      }
    }

    // Profit filter check
    if (filters.profitFilter && filters.profitFilter !== 'todos') {
      const margin = prod.margenMeliPercent;
      if (margin === null) {
        return false;
      } else if (filters.profitFilter === 'rentable' && margin < 10) {
        return false;
      } else if (filters.profitFilter === 'baja' && (margin < 0 || margin >= 10)) {
        return false;
      } else if (filters.profitFilter === 'perdida' && margin >= 0) {
        return false;
      }
    }

    // Search query check
    if (query) {
      const matchesName = prod.name.toLowerCase().includes(query);
      const matchesSupplier = prod.supplier.toLowerCase().includes(query);
      const matchesWeight = prod.weightLabel.toLowerCase().includes(query);
      if (!matchesName && !matchesSupplier && !matchesWeight) {
        return false;
      }
    }

    return true;
  });
}
