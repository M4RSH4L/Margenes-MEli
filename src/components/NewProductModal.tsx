import React, { useState } from 'react';
import { ProductItem, Supplier, PetType } from '../types/product';
import { SUPPLIERS } from '../data/products';
import { calculateScenario } from '../utils/calculator';
import { X, Plus, Package } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductItem) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [supplier, setSupplier] = useState<Supplier>('Royal Canin');
  const [petType, setPetType] = useState<PetType>('perro');
  const [weightLabel, setWeightLabel] = useState('15 kg');
  const [ventaMeli, setVentaMeli] = useState<number>(100000);
  const [compra, setCompra] = useState<number>(65000);
  const [sugerido, setSugerido] = useState<number>(100000);
  const [envioAmount, setEnvioAmount] = useState<number>(16290);
  const [envioDesc, setEnvioDesc] = useState('Envío estándar');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const calc = calculateScenario(ventaMeli, compra, 12.5, envioAmount);

    const newProd: ProductItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      supplier,
      petType,
      weightLabel: weightLabel.trim() || '15 kg',
      ventaMeli,
      compra,
      sugerido: sugerido || ventaMeli,
      recibisMeli: calc.recibis,
      comisionMeli: {
        percentage: 12.5,
        amount: calc.comisionAmount,
      },
      deduction: {
        type: 'envio',
        description: envioDesc,
        amount: envioAmount,
      },
      gananciaMeli: calc.ganancia,
      margenMeliPercent: calc.margenPercent !== null ? Number(calc.margenPercent.toFixed(1)) : null,
      sinEnvio: {
        title: 'Sin envío (solo 12,5%)',
        profit: ventaMeli - calc.comisionAmount - compra,
        marginPercent: Number((((ventaMeli - calc.comisionAmount - compra) / ventaMeli) * 100).toFixed(1)),
      },
      simuladorPantalla: {
        title: 'Simulador pantalla',
        profit: calc.ganancia ? calc.ganancia - (ventaMeli * 0.006) : null,
        marginPercent: calc.margenPercent ? Number((calc.margenPercent - 0.6).toFixed(1)) : null,
        note: 'Con ret. 0,6%',
      },
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-slate-900 text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Agregar Nuevo Producto</h3>
              <p className="text-xs text-slate-500">Ingresa precios para cálculo de márgenes</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar modal" className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre del Alimento</label>
            <input
              type="text"
              required
              placeholder="Ej: Royal Canin Maxi Puppy 15 kg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Proveedor / Marca</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value as Supplier)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              >
                {SUPPLIERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mascota</label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value as PetType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="perro">🐶 Perro</option>
                <option value="gato">🐱 Gato</option>
                <option value="ambos">🐾 Ambos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Presentación</label>
              <input
                type="text"
                value={weightLabel}
                onChange={(e) => setWeightLabel(e.target.value)}
                placeholder="Ej: 15 kg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Venta Meli ($)</label>
              <input
                type="number"
                required
                value={ventaMeli || ''}
                onChange={(e) => setVentaMeli(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Costo Compra ($)</label>
              <input
                type="number"
                required
                value={compra || ''}
                onChange={(e) => setCompra(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Sugerido ($)</label>
              <input
                type="number"
                value={sugerido || ''}
                onChange={(e) => setSugerido(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Envío / Fijo ($)</label>
              <input
                type="number"
                value={envioAmount}
                onChange={(e) => setEnvioAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Detalle Envío</label>
              <input
                type="text"
                value={envioDesc}
                onChange={(e) => setEnvioDesc(e.target.value)}
                placeholder="Ej: Envío 13 a 15 kg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
