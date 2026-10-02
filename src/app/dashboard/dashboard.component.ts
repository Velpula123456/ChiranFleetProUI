import { Component, OnInit } from '@angular/core';

import { VehicleService } from '../core/services/vehicle.service';
import { Vehicle } from '../shared/models/vehicle.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // All vehicles
  vehicles: Vehicle[] = [];

  // Dashboard counts
  totalVehicles = 0;
  availableVehicles = 0;
  unavailableVehicles = 0;

  // UI state
  loading = false;
  errorMessage = '';

  constructor(
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Fleet utilization percentage.
   *
   * Utilization =
   * Unavailable Vehicles / Total Vehicles * 100
   */
  get utilizationPercentage(): number {

    if (this.totalVehicles <= 0) {
      return 0;
    }

    return (
      (this.totalVehicles - this.availableVehicles) /
      this.totalVehicles
    ) * 100;
  }

  /**
   * Fleet availability percentage.
   *
   * Availability =
   * Available Vehicles / Total Vehicles * 100
   */
  get availabilityPercentage(): number {

    if (this.totalVehicles <= 0) {
      return 0;
    }

    return (
      this.availableVehicles /
      this.totalVehicles
    ) * 100;
  }

  /**
   * Load dashboard vehicle information.
   */
  loadDashboardData(): void {

    this.loading = true;
    this.errorMessage = '';

    // ==========================================
    // GET /api/vehicles
    // ==========================================

    this.vehicleService.getVehicles().subscribe({

      next: (response) => {

        this.vehicles = response.items ?? [];

        this.totalVehicles =
          response.totalCount ??
          response.items.length;

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Vehicles API error:',
          error
        );

        this.errorMessage =
          'Unable to load fleet information.';

        this.loading = false;
      }

    });


    // ==========================================
    // GET /api/vehicles/available
    // ==========================================

    this.vehicleService.getAvailableVehicles().subscribe({

      next: (response) => {

        this.availableVehicles =
          response.totalCount ??
          response.items.length;

      },

      error: (error) => {

        console.error(
          'Available vehicles API error:',
          error
        );

      }

    });


    // ==========================================
    // GET /api/vehicles/unavailable
    // ==========================================

    this.vehicleService.getUnavailableVehicles().subscribe({

      next: (response) => {

        this.unavailableVehicles =
          response.totalCount ??
          response.items.length;

      },

      error: (error) => {

        console.error(
          'Unavailable vehicles API error:',
          error
        );

      }

    });
  }
}
