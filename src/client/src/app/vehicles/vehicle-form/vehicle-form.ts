import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateVehiclePayload, Vehicle, VehicleForm as VehicleFormModel } from '../vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss',
})
export class VehicleFormComponent implements OnChanges {
  @Input() saving = false;
  @Input() error = '';
  @Input() resetVersion = 0;
  @Input() vehicle: Vehicle | null = null;
  @Input() showHeader = true;

  @Output() cancelled = new EventEmitter<void>();
  @Output() vehicleSubmitted = new EventEmitter<CreateVehiclePayload>();

  protected readonly form: VehicleFormModel = this.getEmptyForm();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicle']) {
      this.setFormFromVehicle(this.vehicle);
    }

    if (changes['resetVersion'] && !changes['resetVersion'].firstChange) {
      this.resetForm();
    }
  }

  protected submit() {
    if (!this.form.brand.trim() || !this.form.model.trim()) {
      return;
    }

    this.vehicleSubmitted.emit(this.toPayload());
  }

  protected cancelEdit() {
    this.cancelled.emit();
  }

  private toPayload(): CreateVehiclePayload {
    return {
      plateNumber: this.optionalText(this.form.plateNumber),
      brand: this.form.brand.trim(),
      model: this.form.model.trim(),
      year: this.optionalNumber(this.form.year),
      mileage: this.optionalNumber(this.form.mileage),
      purchaseDate: this.optionalText(this.form.purchaseDate),
      purchasePriceCents: this.toCents(this.form.purchasePrice),
      targetSalePriceCents: this.toCents(this.form.targetSalePrice),
    };
  }

  private resetForm() {
    Object.assign(this.form, this.getEmptyForm());
  }

  private setFormFromVehicle(vehicle: Vehicle | null) {
    if (!vehicle) {
      this.resetForm();
      return;
    }

    Object.assign(this.form, {
      plateNumber: vehicle.plateNumber ?? '',
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year ?? null,
      mileage: vehicle.mileage ?? null,
      purchaseDate: this.toInputDate(vehicle.purchaseDate),
      purchasePrice: vehicle.purchasePriceCents / 100,
      targetSalePrice:
        vehicle.targetSalePriceCents === null || vehicle.targetSalePriceCents === undefined
          ? null
          : vehicle.targetSalePriceCents / 100,
    });
  }

  private getEmptyForm(): VehicleFormModel {
    return {
      plateNumber: '',
      brand: '',
      model: '',
      year: null,
      mileage: null,
      purchaseDate: '',
      purchasePrice: null,
      targetSalePrice: null,
    };
  }

  private optionalText(value: string) {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  private optionalNumber(value: number | null) {
    return value === null ? null : Number(value);
  }

  private toCents(value: number | null) {
    return value === null ? null : Math.round(Number(value) * 100);
  }

  private toInputDate(value: string | null | undefined) {
    return value ? value.slice(0, 10) : '';
  }
}
