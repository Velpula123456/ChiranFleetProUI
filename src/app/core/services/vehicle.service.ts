import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Vehicle } from '../../shared/models/vehicle.model';
import { PagedResponse } from '../../shared/models/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private readonly apiUrl = `${environment.apiBaseUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<PagedResponse<Vehicle>> {
    return this.http.get<PagedResponse<Vehicle>>(this.apiUrl);
  }

  getVehicleById(vehicleId: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(
      `${this.apiUrl}/${vehicleId}`
    );
  }

  getAvailableVehicles(): Observable<PagedResponse<Vehicle>> {
    return this.http.get<PagedResponse<Vehicle>>(
      `${this.apiUrl}/available`
    );
  }

  getUnavailableVehicles(): Observable<PagedResponse<Vehicle>> {
    return this.http.get<PagedResponse<Vehicle>>(
      `${this.apiUrl}/unavailable`
    );
  }
}
