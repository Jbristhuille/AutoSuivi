import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  protected investmentCents() {
    return getVehicleInvestmentCents(this.vehicle);
  }

  protected marginCents() {
    return getVehicleMarginCents(this.vehicle);
  }
}
