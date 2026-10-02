import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Driver } from '../../shared/models/driver.model';

export interface DriverPagedResponse {
  items: Driver[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private readonly apiUrl = `${environment.apiBaseUrl}/drivers`;

  constructor(private http: HttpClient) {}

  getAvailableDrivers(): Observable<DriverPagedResponse> {
    return this.http.get<DriverPagedResponse>(
      `${this.apiUrl}/available`
    );
  }
}
