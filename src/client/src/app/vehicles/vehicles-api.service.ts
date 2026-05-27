import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateExpensePayload, CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from './vehicle.model';

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

  update(id: string, payload: UpdateVehiclePayload) {
    return this.http.put<Vehicle>(`${this.apiUrl}/vehicles/${id}`, payload);
  }

  addExpense(vehicleId: string, payload: CreateExpensePayload) {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicles/${vehicleId}/expenses`, payload);
  }

  removeExpense(vehicleId: string, expenseId: string) {
    return this.http.delete<Vehicle>(`${this.apiUrl}/vehicles/${vehicleId}/expenses/${expenseId}`);
  }

  remove(id: string) {
    return this.http.delete<{ id: string }>(`${this.apiUrl}/vehicles/${id}`);
  }
}
