import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioSummaryComponent } from './portfolio-summary/portfolio-summary';
import {
  getPortfolioInvestmentCents,
  getPortfolioTargetMarginCents,
} from './vehicles/vehicle-calculations';
import { VehicleFormComponent } from './vehicles/vehicle-form/vehicle-form';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list';
import { CreateVehiclePayload, Vehicle } from './vehicles/vehicle.model';
import { VehiclesApiService } from './vehicles/vehicles-api.service';

@Component({
  selector: 'app-root',
  imports: [PortfolioSummaryComponent, RouterOutlet, VehicleFormComponent, VehicleListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly vehiclesApi = inject(VehiclesApiService);

  protected readonly vehicles = signal<Vehicle[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly formResetVersion = signal(0);
  protected readonly deletingVehicleId = signal<string | null>(null);

  protected readonly totalInvestmentCents = computed(() => getPortfolioInvestmentCents(this.vehicles()));
  protected readonly totalTargetMarginCents = computed(() =>
    getPortfolioTargetMarginCents(this.vehicles()),
  );

  constructor() {
    this.loadVehicles();
  }

  protected loadVehicles() {
    this.loading.set(true);
    this.error.set('');

    this.vehiclesApi.findAll().subscribe({
      next: (vehicles) => {
        this.vehicles.set(vehicles);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load vehicles. Check that the API is running.');
        this.loading.set(false);
      },
    });
  }

  protected createVehicle(payload: CreateVehiclePayload) {
    if (!payload.brand.trim() || !payload.model.trim()) {
      this.error.set('Brand and model are required.');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.vehiclesApi.create(payload).subscribe({
      next: (vehicle) => {
        this.vehicles.update((vehicles) => [vehicle, ...vehicles]);
        this.formResetVersion.update((version) => version + 1);
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Unable to save this vehicle.');
        this.saving.set(false);
      },
    });
  }

  protected deleteVehicle(id: string) {
    const vehicle = this.vehicles().find((item) => item.id === id);
    const label = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'this vehicle';

    if (!confirm(`Delete ${label}?`)) {
      return;
    }

    this.deletingVehicleId.set(id);
    this.error.set('');

    this.vehiclesApi.remove(id).subscribe({
      next: () => {
        this.vehicles.update((vehicles) => vehicles.filter((item) => item.id !== id));
        this.deletingVehicleId.set(null);
      },
      error: () => {
        this.error.set('Unable to delete this vehicle.');
        this.deletingVehicleId.set(null);
      },
    });
  }
}
