import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioSummaryComponent } from './portfolio-summary/portfolio-summary';
import { ConfirmModalComponent } from './shared/confirm-modal.component';
import { ModalComponent } from './shared/modal.component';
import { Toast, ToastListComponent, ToastVariant } from './shared/toast-list.component';
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
  imports: [
    CommonModule,
    ConfirmModalComponent,
    ModalComponent,
    PortfolioSummaryComponent,
    RouterOutlet,
    ToastListComponent,
    VehicleFormComponent,
    VehicleListComponent,
  ],
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
  protected readonly vehicleFormOpen = signal(false);
  protected readonly addingExpenseVehicleId = signal<string | null>(null);
  protected readonly deletingExpenseId = signal<string | null>(null);
  protected readonly toasts = signal<Toast[]>([]);
  protected readonly pendingDelete = signal<
    | { type: 'vehicle'; id: string; label: string }
    | { type: 'expense'; expenseId: string; vehicleId: string }
    | null
  >(null);

  protected readonly deleteConfirmTitle = computed(() =>
    this.pendingDelete()?.type === 'vehicle' ? 'Delete vehicle' : 'Delete expense',
  );
  protected readonly deleteConfirmMessage = computed(() => {
    const pendingDelete = this.pendingDelete();

    if (!pendingDelete) {
      return '';
    }

    if (pendingDelete.type === 'vehicle') {
      return `Delete ${pendingDelete.label}? This will also remove its expenses.`;
    }

    return 'Delete this expense?';
  });

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
        this.showToast('Unable to load vehicles. Check that the API is running.', 'error');
        this.loading.set(false);
      },
    });
  }

  protected saveVehicle(payload: CreateVehiclePayload) {
    if (!payload.brand.trim() || !payload.model.trim()) {
      this.error.set('Brand and model are required.');
      this.showToast('Brand and model are required.', 'error');
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
    this.vehicleFormOpen.set(true);
    this.error.set('');
  }

  protected cancelEdit() {
    this.editingVehicle.set(null);
    this.vehicleFormOpen.set(false);
    this.error.set('');
    this.formResetVersion.update((version) => version + 1);
  }

  protected openVehicleForm() {
    this.vehicleFormOpen.set(true);
  }

  protected closeVehicleForm() {
    this.editingVehicle.set(null);
    this.vehicleFormOpen.set(false);
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
        this.vehicleFormOpen.set(false);
        this.saving.set(false);
        this.showToast('Vehicle added.', 'success');
      },
      error: () => {
        this.error.set('Unable to save this vehicle.');
        this.saving.set(false);
        this.showToast('Unable to save this vehicle.', 'error');
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
        this.vehicleFormOpen.set(false);
        this.saving.set(false);
        this.showToast('Vehicle updated.', 'success');
      },
      error: () => {
        this.error.set('Unable to save this vehicle.');
        this.saving.set(false);
        this.showToast('Unable to save this vehicle.', 'error');
      },
    });
  }

  protected deleteVehicle(id: string) {
    const vehicle = this.vehicles().find((item) => item.id === id);
    const label = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'this vehicle';

    this.pendingDelete.set({ type: 'vehicle', id, label });
  }

  protected confirmDelete() {
    const pendingDelete = this.pendingDelete();

    if (!pendingDelete) {
      return;
    }

    this.pendingDelete.set(null);

    if (pendingDelete.type === 'vehicle') {
      this.removeVehicle(pendingDelete.id);
      return;
    }

    this.removeExpense(pendingDelete);
  }

  protected cancelDelete() {
    this.pendingDelete.set(null);
  }

  private removeVehicle(id: string) {
    this.deletingVehicleId.set(id);
    this.error.set('');

    this.vehiclesApi.remove(id).subscribe({
      next: () => {
        this.vehicles.update((vehicles) => vehicles.filter((item) => item.id !== id));
        if (this.editingVehicle()?.id === id) {
          this.editingVehicle.set(null);
          this.vehicleFormOpen.set(false);
          this.formResetVersion.update((version) => version + 1);
        }
        this.deletingVehicleId.set(null);
        this.showToast('Vehicle deleted.', 'success');
      },
      error: () => {
        this.error.set('Unable to delete this vehicle.');
        this.deletingVehicleId.set(null);
        this.showToast('Unable to delete this vehicle.', 'error');
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
        this.showToast('Expense added.', 'success');
      },
      error: () => {
        this.error.set('Unable to add this expense.');
        this.addingExpenseVehicleId.set(null);
        this.showToast('Unable to add this expense.', 'error');
      },
    });
  }

  protected deleteExpense(event: { expenseId: string; vehicleId: string }) {
    this.pendingDelete.set({ type: 'expense', ...event });
  }

  private removeExpense(event: { expenseId: string; vehicleId: string }) {
    this.deletingExpenseId.set(event.expenseId);
    this.error.set('');

    this.vehiclesApi.removeExpense(event.vehicleId, event.expenseId).subscribe({
      next: (updatedVehicle) => {
        this.vehicles.update((vehicles) =>
          vehicles.map((vehicle) => (vehicle.id === event.vehicleId ? updatedVehicle : vehicle)),
        );
        this.deletingExpenseId.set(null);
        this.showToast('Expense deleted.', 'success');
      },
      error: () => {
        this.error.set('Unable to delete this expense.');
        this.deletingExpenseId.set(null);
        this.showToast('Unable to delete this expense.', 'error');
      },
    });
  }

  protected dismissToast(id: number) {
    this.toasts.update((toasts) =>
      toasts.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)),
    );
    window.setTimeout(() => {
      this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 180);
  }

  private showToast(message: string, variant: ToastVariant) {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    this.toasts.update((toasts) => [...toasts, { id, message, variant }]);
    window.setTimeout(() => this.dismissToast(id), 4500);
  }
}
