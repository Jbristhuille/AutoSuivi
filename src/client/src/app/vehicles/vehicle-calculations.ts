import { Vehicle } from './vehicle.model';

export function getVehicleExpensesTotalCents(vehicle: Vehicle) {
  return vehicle.expenses.reduce((total, expense) => total + expense.amountCents, 0);
}

export function getVehicleInvestmentCents(vehicle: Vehicle) {
  return vehicle.purchasePriceCents + getVehicleExpensesTotalCents(vehicle);
}

export function getVehicleMarginCents(vehicle: Vehicle) {
  return (vehicle.targetSalePriceCents ?? 0) - getVehicleInvestmentCents(vehicle);
}

export function getPortfolioInvestmentCents(vehicles: Vehicle[]) {
  return vehicles.reduce((total, vehicle) => total + getVehicleInvestmentCents(vehicle), 0);
}

export function getPortfolioTargetMarginCents(vehicles: Vehicle[]) {
  return vehicles.reduce((total, vehicle) => total + getVehicleMarginCents(vehicle), 0);
}
