import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScenario,
  formatCurrency,
  formatPercent,
  getProfitStatus,
  sortProductsForRanking,
  filterProducts,
} from './calculator';
import { ProductItem } from '../types/product';

test('formatCurrency formats values correctly and handles null', () => {
  assert.equal(formatCurrency(null), 'Sin dato');
  const positive = formatCurrency(149200);
  assert.ok(positive.includes('149.200') || positive.includes('149,200'));
  const negative = formatCurrency(-25806.44);
  assert.ok(negative.startsWith('-'));
});

test('formatPercent formats decimals and signs correctly', () => {
  assert.equal(formatPercent(null), '-%');
  assert.equal(formatPercent(13.04), '13.0%');
  assert.equal(formatPercent(-42.8), '-42.8%');
  assert.equal(formatPercent(13.04, true), '+13.0%');
});

test('getProfitStatus categorizes profit thresholds correctly', () => {
  assert.equal(getProfitStatus(null), 'unknown');
  assert.equal(getProfitStatus(-500), 'loss');
  assert.equal(getProfitStatus(1500), 'low');
  assert.equal(getProfitStatus(19442), 'profit');
});

test('calculateScenario computes commission, recibis and margin correctly', () => {
  // Royal Canin Mini Adulto 15 kg: Venta 149200, Compra 94817.13, comision 12.5% = 18650, envio = 16290
  const result = calculateScenario(149200, 94817.13, 12.5, 16290);
  assert.equal(result.comisionAmount, 18650);
  assert.equal(result.recibis, 114260);
  assert.ok(Math.abs((result.ganancia ?? 0) - 19442.87) < 0.01);
  assert.ok(Math.abs((result.margenPercent ?? 0) - 13.03) < 0.1);
});

test('sortProductsForRanking sorts by margin descending properly', () => {
  const dummyProducts: ProductItem[] = [
    {
      id: 'p1',
      name: 'Prod 1',
      supplier: 'Royal Canin',
      petType: 'perro',
      weightLabel: '15 kg',
      ventaMeli: 10000,
      compra: 8000,
      sugerido: 10000,
      recibisMeli: 8750,
      comisionMeli: { percentage: 12.5, amount: 1250 },
      deduction: { type: 'envio', description: 'envio', amount: 0 },
      gananciaMeli: 750,
      margenMeliPercent: 7.5,
      sinEnvio: { title: 'Sin envio', profit: 750, marginPercent: 7.5 },
      simuladorPantalla: { title: 'Simulador', profit: 500, marginPercent: 5.0 },
    },
    {
      id: 'p2',
      name: 'Prod 2',
      supplier: 'Fawna',
      petType: 'gato',
      weightLabel: '3 kg',
      ventaMeli: 20000,
      compra: 10000,
      sugerido: 20000,
      recibisMeli: 17500,
      comisionMeli: { percentage: 12.5, amount: 2500 },
      deduction: { type: 'envio', description: 'envio', amount: 0 },
      gananciaMeli: 7500,
      margenMeliPercent: 37.5,
      sinEnvio: { title: 'Sin envio', profit: 7500, marginPercent: 37.5 },
      simuladorPantalla: { title: 'Simulador', profit: 7000, marginPercent: 35.0 },
    },
    {
      id: 'p3',
      name: 'Prod 3',
      supplier: 'Royal Canin',
      petType: 'gato',
      weightLabel: '7.5 kg',
      ventaMeli: 30000,
      compra: 35000,
      sugerido: 30000,
      recibisMeli: 26250,
      comisionMeli: { percentage: 12.5, amount: 3750 },
      deduction: { type: 'envio', description: 'envio', amount: 0 },
      gananciaMeli: -8750,
      margenMeliPercent: -29.1,
      sinEnvio: { title: 'Sin envio', profit: -8750, marginPercent: -29.1 },
      simuladorPantalla: { title: 'Simulador', profit: -9000, marginPercent: -30.0 },
    },
  ];

  const sorted = sortProductsForRanking(dummyProducts, 'meli', 'margin', 'desc');
  assert.equal(sorted[0].id, 'p2'); // 37.5%
  assert.equal(sorted[1].id, 'p1'); // 7.5%
  assert.equal(sorted[2].id, 'p3'); // -29.1%
});

test('filterProducts filters by supplier and pet type', () => {
  const dummyProducts: ProductItem[] = [
    {
      id: 'p1',
      name: 'Royal Canin Mini Adulto',
      supplier: 'Royal Canin',
      petType: 'perro',
      weightLabel: '15 kg',
      ventaMeli: 10000,
      compra: 8000,
      sugerido: 10000,
      recibisMeli: 8750,
      comisionMeli: { percentage: 12.5, amount: 1250 },
      deduction: { type: 'envio', description: 'envio', amount: 0 },
      gananciaMeli: 750,
      margenMeliPercent: 7.5,
      sinEnvio: { title: 'Sin envio', profit: 750, marginPercent: 7.5 },
      simuladorPantalla: { title: 'Simulador', profit: 500, marginPercent: 5.0 },
    },
    {
      id: 'p2',
      name: 'Fawna Adult Cat',
      supplier: 'Fawna',
      petType: 'gato',
      weightLabel: '3 kg',
      ventaMeli: 20000,
      compra: 10000,
      sugerido: 20000,
      recibisMeli: 17500,
      comisionMeli: { percentage: 12.5, amount: 2500 },
      deduction: { type: 'envio', description: 'envio', amount: 0 },
      gananciaMeli: 7500,
      margenMeliPercent: 37.5,
      sinEnvio: { title: 'Sin envio', profit: 7500, marginPercent: 37.5 },
      simuladorPantalla: { title: 'Simulador', profit: 7000, marginPercent: 35.0 },
    },
  ];

  const filteredRoyal = filterProducts(dummyProducts, { supplier: 'Royal Canin' });
  assert.equal(filteredRoyal.length, 1);
  assert.equal(filteredRoyal[0].name, 'Royal Canin Mini Adulto');

  const filteredGato = filterProducts(dummyProducts, { petType: 'gato' });
  assert.equal(filteredGato.length, 1);
  assert.equal(filteredGato[0].supplier, 'Fawna');

  const filteredSearch = filterProducts(dummyProducts, { searchTerm: 'Mini' });
  assert.equal(filteredSearch.length, 1);
});
