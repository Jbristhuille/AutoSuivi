import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalDatePipe } from '../../shared/local-date.pipe';
import { MoneyPipe } from '../../shared/money.pipe';
import { getVehicleInvestmentCents, getVehicleMarginCents } from '../vehicle-calculations';
import { Vehicle } from '../vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule, LocalDatePipe, MoneyPipe],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.scss',
})
export class VehicleCardComponent {
  @Input({ required: true }) vehicle!: Vehicle;
  @Input() deleting = false;

  @Output() deleteRequested = new EventEmitter<string>();

  protected investmentCents() {
    return getVehicleInvestmentCents(this.vehicle);
  }

  protected marginCents() {
    return getVehicleMarginCents(this.vehicle);
  }

  protected requestDelete() {
    this.deleteRequested.emit(this.vehicle.id);
  }
}
