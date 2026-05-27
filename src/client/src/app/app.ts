import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioSummaryComponent } from './portfolio-summary/portfolio-summary';
import {
  getPortfolioInvestmentCents,
  getPortfolioTargetMarginCents,
} from './vehicles/vehicle-calculations';
import { VehicleFormComponent } from './vehicles/vehicle-form/vehicle-form';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list';
import { CreateExpensePayload, CreateVehiclePayload, Vehicle } from './vehicles/vehicle.model';
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
  protected readonly editingVehicle = signal<Vehicle | null>(null);
  protected readonly addingExpenseVehicleId = signal<string | null>(null);

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

  protected saveVehicle(payload: CreateVehiclePayload) {
    if (!payload.brand.trim() || !payload.model.trim()) {
      this.error.set('Brand and model are required.');
      return;
    }

    const vehicle = this.editingVehicle();

    if (vehicle) {
      this.updateVehicle(vehicle.id, payload);
      return;
    }

    this.createVehicle(payload);
  }

  protected editVehicle(vehicle: Vehicle) {
    this.editingVehicle.set(vehicle);
    this.error.set('');
  }

  protected cancelEdit() {
    this.editingVehicle.set(null);
    this.error.set('');
    this.formResetVersion.update((version) => version + 1);
  }

  protected createVehicle(payload: CreateVehiclePayload) {
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

  protected updateVehicle(id: string, payload: CreateVehiclePayload) {
    this.saving.set(true);
    this.error.set('');

    this.vehiclesApi.update(id, payload).subscribe({
      next: (updatedVehicle) => {
        this.vehicles.update((vehicles) =>
          vehicles.map((vehicle) => (vehicle.id === id ? updatedVehicle : vehicle)),
        );
        this.editingVehicle.set(null);
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
        if (this.editingVehicle()?.id === id) {
          this.editingVehicle.set(null);
          this.formResetVersion.update((version) => version + 1);
        }
        this.deletingVehicleId.set(null);
      },
      error: () => {
        this.error.set('Unable to delete this vehicle.');
        this.deletingVehicleId.set(null);
      },
    });
  }

  protected addExpense(event: { payload: CreateExpensePayload; vehicleId: string }) {
    this.addingExpenseVehicleId.set(event.vehicleId);
    this.error.set('');

    this.vehiclesApi.addExpense(event.vehicleId, event.payload).subscribe({
      next: (updatedVehicle) => {
        this.vehicles.update((vehicles) =>
          vehicles.map((vehicle) => (vehicle.id === event.vehicleId ? updatedVehicle : vehicle)),
        );
        this.addingExpenseVehicleId.set(null);
      },
      error: () => {
        this.error.set('Unable to add this expense.');
        this.addingExpenseVehicleId.set(null);
      },
    });
  }
}
