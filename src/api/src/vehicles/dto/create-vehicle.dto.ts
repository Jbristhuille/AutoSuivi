export type CreateVehicleDto = {
  plateNumber?: string | null;
  brand: string;
  model: string;
  year?: number | null;
  mileage?: number | null;
  purchaseDate?: string | null;
  purchasePriceCents?: number | null;
  targetSalePriceCents?: number | null;
};
