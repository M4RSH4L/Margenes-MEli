export type Supplier =
  | 'Royal Canin'
  | 'Old Prince'
  | 'Purina Excellent'
  | 'Fawna'
  | 'Eukanuba'
  | 'Origen'
  | 'Baires';

export type PetType = 'perro' | 'gato' | 'ambos';

export interface ScenarioMargin {
  title: string;
  profit: number | null;
  marginPercent: number | null;
  note?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  supplier: Supplier;
  petType: PetType;
  weightKg?: number;
  weightLabel: string;
  ventaMeli: number;
  compra: number | null; // null if unknown
  sugerido: number;
  recibisMeli: number;
  comisionMeli: {
    percentage: number;
    amount: number;
  };
  deduction: {
    type: 'envio' | 'cargo_fijo';
    description: string;
    amount: number;
  };
  gananciaMeli: number | null;
  margenMeliPercent: number | null;
  sinEnvio: ScenarioMargin;
  simuladorPantalla: ScenarioMargin;
  notes?: string;
}
