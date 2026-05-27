export type Expense = {
  id: string;
  amountCents: number;
};

export type Vehicle = {
  id: string;
  plateNumber?: string | null;
  brand: string;
  model: string;
  year?: number | null;
  mileage?: number | null;
  purchaseDate?: string | null;
  purchasePriceCents: number;
  targetSalePriceCents?: number | null;
  status: string;
  expenses: Expense[];
};

export type CreateVehiclePayload = {
  plateNumber: string | null;
  brand: string;
  model: string;
  year: number | null;
  mileage: number | null;
  purchaseDate: string | null;
  purchasePriceCents: number | null;
  targetSalePriceCents: number | null;
};

export type UpdateVehiclePayload = CreateVehiclePayload;

export type VehicleForm = {
  plateNumber: string;
  brand: string;
  model: string;
  year: number | null;
  mileage: number | null;
  purchaseDate: string;
  purchasePrice: number | null;
  targetSalePrice: number | null;
};
