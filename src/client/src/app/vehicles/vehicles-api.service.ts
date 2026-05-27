import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateVehiclePayload, Vehicle } from './vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehiclesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  findAll() {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
  }

  create(payload: CreateVehiclePayload) {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicles`, payload);
  }
}
