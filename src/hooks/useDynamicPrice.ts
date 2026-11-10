import { useMemo } from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { PAINT_OPTIONS } from '../data/paintOptions';
import { WHEEL_OPTIONS } from '../data/wheelOptions';
import { INTERIOR_OPTIONS } from '../data/interiorOptions';
import { ACCESSORY_OPTIONS } from '../data/accessoryOptions';

export interface PriceBreakdown {
  basePrice: number;
  paintPrice: number;
  wheelPrice: number;
  interiorPrice: number;
  accessoriesPrice: number;
  totalPrice: number;
}

/**
 * Hook que calcula dinamicamente o preço total da configuração:
 * Preço Base + Pintura + Rodas + Interior + Acessórios compatíveis ativos
 */
export function useDynamicPrice(): PriceBreakdown {
  const selectedVehicleId = useConfigStore((s) => s.selectedVehicleId);
  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const selectedPaintId = useConfigStore((s) => s.selectedPaintId);
  const selectedWheelId = useConfigStore((s) => s.selectedWheelId);
  const selectedInteriorId = useConfigStore((s) => s.selectedInteriorId);
  const selectedAccessoryIds = useConfigStore((s) => s.selectedAccessoryIds);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  return useMemo(() => {
    const vehicle = getActiveVehicle();
    const basePrice = vehicle.basePrice;

    const paint = PAINT_OPTIONS.find((p) => p.id === selectedPaintId);
    const paintPrice = paint ? paint.price : 0;

    const wheel = WHEEL_OPTIONS.find((w) => w.id === selectedWheelId);
    const wheelPrice = wheel ? wheel.price : 0;

    const interior = INTERIOR_OPTIONS.find((i) => i.id === selectedInteriorId);
    const interiorPrice = interior ? interior.price : 0;

    const accessoriesPrice = selectedAccessoryIds.reduce((sum, accId) => {
      if (!vehicle.compatibleAccessoryIds.includes(accId)) return sum;
      const acc = ACCESSORY_OPTIONS.find((a) => a.id === accId);
      return sum + (acc ? acc.price : 0);
    }, 0);

    const totalPrice =
      basePrice + paintPrice + wheelPrice + interiorPrice + accessoriesPrice;

    return {
      basePrice,
      paintPrice,
      wheelPrice,
      interiorPrice,
      accessoriesPrice,
      totalPrice,
    };
  }, [
    selectedVehicleId,
    customImportedGLB,
    selectedPaintId,
    selectedWheelId,
    selectedInteriorId,
    selectedAccessoryIds,
    getActiveVehicle,
  ]);
}
