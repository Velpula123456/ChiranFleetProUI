import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AssignVehicleRequest,
  AssignVehicleResponse,
  UnassignVehicleRequest
} from '../../shared/models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private readonly apiUrl = `${environment.apiBaseUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  assignVehicle(
    vehicleId: number,
    request: AssignVehicleRequest
  ): Observable<AssignVehicleResponse> {

    return this.http.post<AssignVehicleResponse>(
      `${this.apiUrl}/${vehicleId}/assign`,
      request
    );
  }

  unassignVehicle(
  vehicleId: number,
  request: UnassignVehicleRequest
): Observable<AssignVehicleResponse> {

  return this.http.post<AssignVehicleResponse>(
    `${this.apiUrl}/${vehicleId}/unassign`,
    request
  );
}
}
