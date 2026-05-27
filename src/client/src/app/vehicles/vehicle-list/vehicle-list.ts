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

  @Output() refresh = new EventEmitter<void>();
}
