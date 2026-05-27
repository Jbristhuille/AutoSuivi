import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vehicle } from '../vehicle.model';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card';

@Component({
  selector: 'app-vehicle-list',
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
})
export class VehicleListComponent {
  @Input({ required: true }) vehicles: Vehicle[] = [];
  @Input() loading = false;
  @Input() deletingVehicleId: string | null = null;

  @Output() refresh = new EventEmitter<void>();
  @Output() deleteVehicle = new EventEmitter<string>();
  @Output() editVehicle = new EventEmitter<Vehicle>();
}
